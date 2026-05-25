package uz.eventhub.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.eventhub.backend.dto.ArtistProfileRequest;
import uz.eventhub.backend.dto.ArtistProfileResponse;
import uz.eventhub.backend.service.ArtistService;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistService artistService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('ARTIST')")
    public ArtistProfileResponse getMyProfile() {
        return artistService.getMyProfile();
    }

    @GetMapping("/search")
    public Page<ArtistProfileResponse> search(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return artistService.search(categoryId, minPrice, maxPrice, search, page, size);
    }

    @PostMapping("/profile")
    @PreAuthorize("hasRole('ARTIST')")
    public ArtistProfileResponse createOrUpdateProfile(@Valid @RequestBody ArtistProfileRequest request) {
        return artistService.createOrUpdateProfile(request);
    }
}
