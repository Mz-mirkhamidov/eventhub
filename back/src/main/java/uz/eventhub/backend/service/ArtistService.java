package uz.eventhub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.eventhub.backend.domain.entity.ArtistProfile;
import uz.eventhub.backend.domain.entity.Category;
import uz.eventhub.backend.domain.entity.User;
import uz.eventhub.backend.domain.enums.UserRole;
import uz.eventhub.backend.dto.ArtistProfileRequest;
import uz.eventhub.backend.dto.ArtistProfileResponse;
import uz.eventhub.backend.exception.ApiException;
import uz.eventhub.backend.repository.ArtistProfileRepository;
import uz.eventhub.backend.repository.CategoryRepository;
import uz.eventhub.backend.repository.UserRepository;
import uz.eventhub.backend.util.SearchTransliteration;
import uz.eventhub.backend.util.SecurityUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistProfileRepository artistProfileRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ArtistProfileResponse createOrUpdateProfile(ArtistProfileRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() != UserRole.ARTIST) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only artists can manage artist profiles");
        }
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));
        if ("VENUE".equalsIgnoreCase(category.getType())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Venue categories cannot be used for artist profiles");
        }
        ArtistProfile profile = artistProfileRepository.findByUserId(userId)
                .orElse(ArtistProfile.builder().user(user).build());
        profile.setCategory(category);
        profile.setBio(request.getBio());
        if (request.getProfilePhoto() != null) profile.setProfilePhoto(request.getProfilePhoto());
        if (request.getPortfolioPhotos() != null) profile.setPortfolioPhotos(new java.util.ArrayList<>(request.getPortfolioPhotos()));
        profile.setPricePerHour(request.getPricePerHour());
        profile.setPricePerEvent(request.getPricePerEvent());
        if (request.getAdvancePaymentPercent() != null) {
            profile.setAdvancePaymentPercent(request.getAdvancePaymentPercent());
        }
        profile = artistProfileRepository.save(profile);
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public ArtistProfileResponse getMyProfile() {
        UUID userId = SecurityUtils.getCurrentUserId();
        ArtistProfile profile = artistProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Artist profile not found"));
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public Page<ArtistProfileResponse> search(
            Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String primary = null;
        String alternate = null;
        if (search != null && !search.isBlank()) {
            List<String> variants = SearchTransliteration.searchVariants(search);
            primary = variants.get(0);
            alternate = variants.size() > 1 ? variants.get(1) : null;
        }
        return artistProfileRepository.search(categoryId, minPrice, maxPrice, primary, alternate, pageable)
                .map(this::toResponse);
    }

    public ArtistProfileResponse toResponse(ArtistProfile profile) {
        return ArtistProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .categoryId(profile.getCategory().getId())
                .categoryName(profile.getCategory().getName())
                .bio(profile.getBio())
                .profilePhoto(profile.getProfilePhoto())
                .portfolioPhotos(profile.getPortfolioPhotos())
                .pricePerHour(profile.getPricePerHour())
                .pricePerEvent(profile.getPricePerEvent())
                .advancePaymentPercent(profile.getAdvancePaymentPercent())
                .rating(profile.getRating())
                .isVerified(profile.isVerified())
                .build();
    }
}
