package uz.eventhub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.eventhub.backend.domain.entity.EventPlan;

import java.util.List;
import java.util.UUID;

public interface EventPlanRepository extends JpaRepository<EventPlan, UUID> {

    List<EventPlan> findByClientIdOrderByCreatedAtDesc(UUID clientId);
}
