package uz.eventhub.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.eventhub.backend.dto.EventPlanRequest;
import uz.eventhub.backend.dto.EventPlanResponse;
import uz.eventhub.backend.service.EventPlanService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class EventPlanController {

    private final EventPlanService eventPlanService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public EventPlanResponse savePlan(@Valid @RequestBody EventPlanRequest request) {
        return eventPlanService.savePlan(request);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CLIENT')")
    public List<EventPlanResponse> getMyPlans() {
        return eventPlanService.getMyPlans();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public void deletePlan(@PathVariable UUID id) {
        eventPlanService.deletePlan(id);
    }
}
