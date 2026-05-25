package uz.eventhub.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.eventhub.backend.dto.VenueProfileRequest;
import uz.eventhub.backend.dto.VenueProfileResponse;
import uz.eventhub.backend.service.VenueService;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('VENUE')")
    public VenueProfileResponse getMyProfile() {
        return venueService.getMyProfile();
    }

    @GetMapping("/search")
    public Page<VenueProfileResponse> search(
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return venueService.search(minCapacity, maxCapacity, minPrice, maxPrice, city, search, page, size);
    }

    @PostMapping("/profile")
    @PreAuthorize("hasRole('VENUE')")
    public VenueProfileResponse createOrUpdateProfile(@Valid @RequestBody VenueProfileRequest request) {
        return venueService.createOrUpdateProfile(request);
    }
}
