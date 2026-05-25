package uz.eventhub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.eventhub.backend.domain.entity.Booking;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByClientIdOrderByCreatedAtDesc(UUID clientId);

    Optional<Booking> findByIdAndClientId(UUID id, UUID clientId);
}
