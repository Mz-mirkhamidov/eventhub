package uz.eventhub.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.eventhub.backend.dto.BarterOfferRequest;
import uz.eventhub.backend.dto.BarterOfferResponse;
import uz.eventhub.backend.dto.BarterRequestDto;
import uz.eventhub.backend.dto.BarterRequestResponse;
import uz.eventhub.backend.service.BarterService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/barter")
@RequiredArgsConstructor
public class BarterController {

    private final BarterService barterService;

    @GetMapping("/offers")
    public List<BarterOfferResponse> getOffers() {
        return barterService.getOffers();
    }

    @GetMapping("/offers/mine")
    @PreAuthorize("hasRole('BUSINESS')")
    public List<BarterOfferResponse> getMyOffers() {
        return barterService.getMyOffers();
    }

    @GetMapping("/requests")
    @PreAuthorize("hasRole('BUSINESS')")
    public List<BarterRequestResponse> getMyRequests() {
        return barterService.getMyRequests();
    }

    @GetMapping("/requests/incoming")
    @PreAuthorize("hasRole('BUSINESS')")
    public List<BarterRequestResponse> getIncomingRequests() {
        return barterService.getIncomingRequests();
    }

    @GetMapping("/offers/{offerId}/requests")
    @PreAuthorize("hasRole('BUSINESS')")
    public List<BarterRequestResponse> getRequestsForOffer(@PathVariable UUID offerId) {
        return barterService.getRequestsForOffer(offerId);
    }

    @PostMapping("/offers")
    @PreAuthorize("hasRole('BUSINESS')")
    public BarterOfferResponse createOffer(@Valid @RequestBody BarterOfferRequest request) {
        return barterService.createOffer(request);
    }

    @PostMapping("/offers/{id}/request")
    @PreAuthorize("hasRole('ARTIST')")
    public BarterRequestResponse requestBarter(@PathVariable UUID id, @Valid @RequestBody BarterRequestDto dto) {
        return barterService.requestBarter(id, dto);
    }

    @PutMapping("/requests/{id}/confirm")
    @PreAuthorize("hasRole('BUSINESS')")
    public BarterRequestResponse confirmRequest(@PathVariable UUID id) {
        return barterService.confirmRequest(id);
    }
}
