package uz.eventhub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.eventhub.backend.domain.entity.Review;

import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    boolean existsByBookingId(UUID bookingId);
}
