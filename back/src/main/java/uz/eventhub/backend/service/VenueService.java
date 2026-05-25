package uz.eventhub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.eventhub.backend.domain.entity.Category;
import uz.eventhub.backend.domain.entity.User;
import uz.eventhub.backend.domain.entity.VenueProfile;
import uz.eventhub.backend.domain.enums.UserRole;
import uz.eventhub.backend.dto.VenueProfileRequest;
import uz.eventhub.backend.dto.VenueProfileResponse;
import uz.eventhub.backend.exception.ApiException;
import uz.eventhub.backend.repository.CategoryRepository;
import uz.eventhub.backend.repository.UserRepository;
import uz.eventhub.backend.repository.VenueProfileRepository;
import uz.eventhub.backend.util.SearchTransliteration;
import uz.eventhub.backend.util.SecurityUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueProfileRepository venueProfileRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public VenueProfileResponse createOrUpdateProfile(VenueProfileRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() != UserRole.VENUE) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only venues can manage venue profiles");
        }
        VenueProfile profile = venueProfileRepository.findByUserId(userId)
                .orElse(VenueProfile.builder().user(user).build());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found"));
            if (!"VENUE".equalsIgnoreCase(category.getType())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Category must be of type VENUE");
            }
            profile.setCategory(category);
        }
        profile.setName(request.getName());
        if (request.getCoverPhoto() != null) profile.setCoverPhoto(request.getCoverPhoto());
        if (request.getPhotos() != null) profile.setPhotos(new java.util.ArrayList<>(request.getPhotos()));
        profile.setDescription(request.getDescription());
        profile.setAddress(request.getAddress());
        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());
        profile.setCapacity(request.getCapacity());
        profile.setPricePerHour(request.getPricePerHour());
        if (request.getAdvancePaymentPercent() != null) {
            profile.setAdvancePaymentPercent(request.getAdvancePaymentPercent());
        }
        profile = venueProfileRepository.save(profile);
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public VenueProfileResponse getMyProfile() {
        UUID userId = SecurityUtils.getCurrentUserId();
        VenueProfile profile = venueProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Venue profile not found"));
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public Page<VenueProfileResponse> search(
            Integer minCapacity,
            Integer maxCapacity,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String city,
            String search,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size);
        String primary = null;
        String alternate = null;
        if (search != null && !search.isBlank()) {
            List<String> variants = SearchTransliteration.searchVariants(search);
            primary = variants.get(0);
            alternate = variants.size() > 1 ? variants.get(1) : null;
        }
        String cityFilter = city != null && !city.isBlank() ? city.trim() : null;
        return venueProfileRepository.search(
                        minCapacity, maxCapacity, minPrice, maxPrice, cityFilter, primary, alternate, pageable)
                .map(this::toResponse);
    }

    public VenueProfileResponse toResponse(VenueProfile profile) {
        return VenueProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .categoryId(profile.getCategory() != null ? profile.getCategory().getId() : null)
                .categoryName(profile.getCategory() != null ? profile.getCategory().getName() : null)
                .name(profile.getName())
                .coverPhoto(profile.getCoverPhoto())
                .photos(profile.getPhotos())
                .description(profile.getDescription())
                .address(profile.getAddress())
                .latitude(profile.getLatitude())
                .longitude(profile.getLongitude())
                .capacity(profile.getCapacity())
                .pricePerHour(profile.getPricePerHour())
                .advancePaymentPercent(profile.getAdvancePaymentPercent())
                .rating(profile.getRating())
                .isVerified(profile.isVerified())
                .build();
    }
}
