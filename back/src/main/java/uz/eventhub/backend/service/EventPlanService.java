package uz.eventhub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.eventhub.backend.domain.entity.EventPlan;
import uz.eventhub.backend.domain.entity.User;
import uz.eventhub.backend.domain.enums.UserRole;
import uz.eventhub.backend.dto.EventPlanRequest;
import uz.eventhub.backend.dto.EventPlanResponse;
import uz.eventhub.backend.exception.ApiException;
import uz.eventhub.backend.repository.EventPlanRepository;
import uz.eventhub.backend.repository.UserRepository;
import uz.eventhub.backend.util.SecurityUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventPlanService {

    private final EventPlanRepository eventPlanRepository;
    private final UserRepository userRepository;

    @Transactional
    public EventPlanResponse savePlan(EventPlanRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User client = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (client.getRole() != UserRole.CLIENT) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only clients can save event plans");
        }
        EventPlan plan = EventPlan.builder()
                .client(client)
                .eventType(request.getEventType())
                .city(request.getCity())
                .eventDate(request.getDate())
                .guestsCount(request.getGuestsCount())
                .budget(request.getBudget())
                .selectedServices(request.getSelectedServices())
                .build();
        plan = eventPlanRepository.save(plan);
        return toResponse(plan);
    }

    @Transactional(readOnly = true)
    public List<EventPlanResponse> getMyPlans() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return eventPlanRepository.findByClientIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deletePlan(UUID id) {
        UUID userId = SecurityUtils.getCurrentUserId();
        EventPlan plan = eventPlanRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Plan not found"));
        if (!plan.getClient().getId().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not authorized to delete this plan");
        }
        eventPlanRepository.delete(plan);
    }

    private EventPlanResponse toResponse(EventPlan plan) {
        return EventPlanResponse.builder()
                .id(plan.getId())
                .eventType(plan.getEventType())
                .city(plan.getCity())
                .eventDate(plan.getEventDate())
                .guestsCount(plan.getGuestsCount())
                .budget(plan.getBudget())
                .selectedServices(plan.getSelectedServices())
                .createdAt(plan.getCreatedAt())
                .build();
    }
}
