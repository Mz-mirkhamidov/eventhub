package uz.eventhub.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.eventhub.backend.dto.BloggerProfileRequest;
import uz.eventhub.backend.dto.BloggerProfileResponse;
import uz.eventhub.backend.service.BloggerService;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/bloggers")
@RequiredArgsConstructor
public class BloggerController {

    private final BloggerService bloggerService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('BLOGGER')")
    public BloggerProfileResponse getMyProfile() {
        return bloggerService.getMyProfile();
    }

    @PostMapping("/profile")
    @PreAuthorize("hasRole('BLOGGER')")
    public BloggerProfileResponse createOrUpdateProfile(@Valid @RequestBody BloggerProfileRequest request) {
        return bloggerService.createOrUpdateProfile(request);
    }

    @GetMapping("/search")
    public Page<BloggerProfileResponse> search(
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) Long minFollowers,
            @RequestParam(required = false) Long maxFollowers,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return bloggerService.search(platform, minFollowers, maxFollowers, category, maxPrice, search, page, size);
    }

    @GetMapping("/{id}")
    public BloggerProfileResponse getById(@PathVariable UUID id) {
        return bloggerService.getById(id);
    }
}
