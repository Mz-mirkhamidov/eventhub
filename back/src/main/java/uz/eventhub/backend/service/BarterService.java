package uz.eventhub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.eventhub.backend.domain.entity.BarterOffer;
import uz.eventhub.backend.domain.entity.BarterRequest;
import uz.eventhub.backend.domain.entity.User;
import uz.eventhub.backend.domain.enums.BarterStatus;
import uz.eventhub.backend.domain.enums.UserRole;
import uz.eventhub.backend.dto.BarterOfferRequest;
import uz.eventhub.backend.dto.BarterOfferResponse;
import uz.eventhub.backend.dto.BarterRequestDto;
import uz.eventhub.backend.dto.BarterRequestResponse;
import uz.eventhub.backend.exception.ApiException;
import uz.eventhub.backend.repository.BarterOfferRepository;
import uz.eventhub.backend.repository.BarterRequestRepository;
import uz.eventhub.backend.repository.UserRepository;
import uz.eventhub.backend.util.SecurityUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BarterService {

    private final BarterOfferRepository barterOfferRepository;
    private final BarterRequestRepository barterRequestRepository;
    private final UserRepository userRepository;

    @Transactional
    public BarterOfferResponse createOffer(BarterOfferRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User business = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (business.getRole() != UserRole.BUSINESS) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only business users can create barter offers");
        }
        BarterOffer offer = BarterOffer.builder()
                .business(business)
                .title(request.getTitle())
                .description(request.getDescription())
                .productValue(request.getProductValue())
                .platform(request.getPlatform())
                .minFollowers(request.getMinFollowers())
                .expiresAt(request.getExpiresAt())
                .status(BarterStatus.OPEN)
                .build();
        offer = barterOfferRepository.save(offer);
        return toOfferResponse(offer);
    }

    @Transactional
    public BarterRequestResponse requestBarter(UUID offerId, BarterRequestDto dto) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (requester.getRole() != UserRole.ARTIST && requester.getRole() != UserRole.BLOGGER) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only artists or bloggers can request barter");
        }
        BarterOffer offer = barterOfferRepository.findById(offerId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Offer not found"));
        if (offer.getStatus() != BarterStatus.OPEN) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Offer is not open");
        }
        if (offer.getExpiresAt() != null && offer.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Offer has expired");
        }
        if (offer.getMinFollowers() != null && dto.getFollowerCount() < offer.getMinFollowers()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Follower count does not meet minimum requirement");
        }
        if (barterRequestRepository.existsByOfferIdAndRequesterId(offerId, userId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You have already requested this offer");
        }
        BarterRequest barterRequest = BarterRequest.builder()
                .offer(offer)
                .requester(requester)
                .followerCount(dto.getFollowerCount())
                .profileUrl(dto.getProfileUrl())
                .message(dto.getMessage())
                .status(BarterStatus.REQUESTED)
                .build();
        offer.setStatus(BarterStatus.REQUESTED);
        barterOfferRepository.save(offer);
        barterRequest = barterRequestRepository.save(barterRequest);
        return toRequestResponse(barterRequest);
    }

    @Transactional
    public BarterRequestResponse confirmRequest(UUID requestId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        BarterRequest barterRequest = barterRequestRepository.findByIdAndOffer_Business_Id(requestId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Request not found"));
        if (barterRequest.getStatus() != BarterStatus.REQUESTED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Request is not in requested status");
        }
        barterRequest.setStatus(BarterStatus.CONFIRMED);
        BarterOffer offer = barterRequest.getOffer();
        offer.setStatus(BarterStatus.CONFIRMED);
        barterOfferRepository.save(offer);
        barterRequest = barterRequestRepository.save(barterRequest);
        return toRequestResponse(barterRequest);
    }

    @Transactional(readOnly = true)
    public List<BarterOfferResponse> getOffers() {
        return barterOfferRepository.findByStatusOrderByCreatedAtDesc(BarterStatus.OPEN).stream()
                .map(this::toOfferResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BarterOfferResponse> getMyOffers() {
        UUID userId = SecurityUtils.getCurrentUserId();
        User business = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (business.getRole() != UserRole.BUSINESS) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only business users can view their offers");
        }
        return barterOfferRepository.findByBusiness_IdOrderByCreatedAtDesc(userId).stream()
                .map(this::toOfferResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BarterRequestResponse> getIncomingRequests() {
        return getMyRequests();
    }

    @Transactional(readOnly = true)
    public List<BarterRequestResponse> getMyRequests() {
        UUID userId = SecurityUtils.getCurrentUserId();
        User business = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (business.getRole() != UserRole.BUSINESS) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only business users can view barter requests");
        }
        return barterRequestRepository.findByOffer_Business_IdOrderByCreatedAtDesc(userId).stream()
                .map(this::toRequestResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BarterRequestResponse> getRequestsForOffer(UUID offerId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        BarterOffer offer = barterOfferRepository.findById(offerId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Offer not found"));
        if (!offer.getBusiness().getId().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not your offer");
        }
        return barterRequestRepository.findByOffer_IdOrderByCreatedAtDesc(offerId).stream()
                .map(this::toRequestResponse)
                .toList();
    }

    public BarterRequestResponse toRequestResponse(BarterRequest request) {
        return BarterRequestResponse.builder()
                .id(request.getId())
                .offerId(request.getOffer().getId())
                .offerTitle(request.getOffer().getTitle())
                .requesterId(request.getRequester().getId())
                .requesterName(request.getRequester().getFullName())
                .followerCount(request.getFollowerCount())
                .profileUrl(request.getProfileUrl())
                .message(request.getMessage())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .build();
    }

    public BarterOfferResponse toOfferResponse(BarterOffer offer) {
        return BarterOfferResponse.builder()
                .id(offer.getId())
                .businessId(offer.getBusiness().getId())
                .businessName(offer.getBusiness().getFullName())
                .title(offer.getTitle())
                .description(offer.getDescription())
                .productValue(offer.getProductValue())
                .platform(offer.getPlatform())
                .minFollowers(offer.getMinFollowers())
                .status(offer.getStatus())
                .expiresAt(offer.getExpiresAt())
                .createdAt(offer.getCreatedAt())
                .build();
    }
}
