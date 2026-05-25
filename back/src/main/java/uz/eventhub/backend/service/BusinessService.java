package uz.eventhub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.eventhub.backend.domain.entity.User;
import uz.eventhub.backend.domain.enums.UserRole;
import uz.eventhub.backend.dto.BusinessProfileRequest;
import uz.eventhub.backend.dto.BusinessProfileResponse;
import uz.eventhub.backend.exception.ApiException;
import uz.eventhub.backend.repository.UserRepository;
import uz.eventhub.backend.util.SecurityUtils;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BusinessService {

    private final UserRepository userRepository;

    @Transactional
    public BusinessProfileResponse updateProfile(BusinessProfileRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() != UserRole.BUSINESS) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only business users can update business profile");
        }
        if (request.getLogo() != null) user.setLogo(request.getLogo());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getLatitude() != null) user.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) user.setLongitude(request.getLongitude());
        user = userRepository.save(user);
        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public BusinessProfileResponse getProfile() {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() != UserRole.BUSINESS) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only business users");
        }
        return toResponse(user);
    }

    private BusinessProfileResponse toResponse(User user) {
        return BusinessProfileResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .logo(user.getLogo())
                .address(user.getAddress())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .build();
    }
}
