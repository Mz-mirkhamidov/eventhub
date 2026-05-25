package uz.eventhub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.eventhub.backend.domain.entity.BloggerProfile;
import uz.eventhub.backend.domain.entity.User;
import uz.eventhub.backend.domain.enums.UserRole;
import uz.eventhub.backend.dto.BloggerProfileRequest;
import uz.eventhub.backend.dto.BloggerProfileResponse;
import uz.eventhub.backend.exception.ApiException;
import uz.eventhub.backend.repository.BloggerProfileRepository;
import uz.eventhub.backend.repository.UserRepository;
import uz.eventhub.backend.util.SearchTransliteration;
import uz.eventhub.backend.util.SecurityUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BloggerService {

    private final BloggerProfileRepository bloggerProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public BloggerProfileResponse createOrUpdateProfile(BloggerProfileRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() != UserRole.BLOGGER) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only bloggers can manage blogger profiles");
        }
        BloggerProfile profile = bloggerProfileRepository.findByUserId(userId)
                .orElse(BloggerProfile.builder().user(user).build());
        profile.setBio(request.getBio());
        profile.setProfilePhoto(request.getProfilePhoto());
        if (request.getPlatforms() != null) {
            profile.setPlatforms(new ArrayList<>(request.getPlatforms()));
        }
        if (request.getContentFormats() != null) {
            profile.setContentFormats(new ArrayList<>(request.getContentFormats()));
        }
        if (request.getCategories() != null) {
            profile.setCategories(new ArrayList<>(request.getCategories()));
        }
        if (request.getAdvancePaymentPercent() != null) {
            profile.setAdvancePaymentPercent(request.getAdvancePaymentPercent());
        }
        profile = bloggerProfileRepository.save(profile);
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public BloggerProfileResponse getMyProfile() {
        UUID userId = SecurityUtils.getCurrentUserId();
        BloggerProfile profile = bloggerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Blogger profile not found"));
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public BloggerProfileResponse getById(UUID id) {
        BloggerProfile profile = bloggerProfileRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Blogger not found"));
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public Page<BloggerProfileResponse> search(
            String platform,
            Long minFollowers,
            Long maxFollowers,
            String category,
            BigDecimal maxPrice,
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
        String platformParam = platform != null && !platform.isBlank() ? platform.toUpperCase() : null;
        return bloggerProfileRepository.search(
                        platformParam, minFollowers, maxFollowers, category, maxPrice, primary, alternate, pageable)
                .map(this::toResponse);
    }

    public BloggerProfileResponse toResponse(BloggerProfile profile) {
        return BloggerProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .bio(profile.getBio())
                .profilePhoto(profile.getProfilePhoto())
                .platforms(profile.getPlatforms())
                .contentFormats(profile.getContentFormats())
                .categories(profile.getCategories())
                .advancePaymentPercent(profile.getAdvancePaymentPercent())
                .rating(profile.getRating())
                .isVerified(profile.isVerified())
                .build();
    }
}
