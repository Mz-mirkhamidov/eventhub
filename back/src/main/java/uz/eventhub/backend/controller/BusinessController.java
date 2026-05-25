package uz.eventhub.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.eventhub.backend.dto.BusinessProfileRequest;
import uz.eventhub.backend.dto.BusinessProfileResponse;
import uz.eventhub.backend.service.BusinessService;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessService businessService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('BUSINESS')")
    public BusinessProfileResponse getProfile() {
        return businessService.getProfile();
    }

    @PostMapping("/profile")
    @PreAuthorize("hasRole('BUSINESS')")
    public BusinessProfileResponse updateProfile(@RequestBody BusinessProfileRequest request) {
        return businessService.updateProfile(request);
    }
}
