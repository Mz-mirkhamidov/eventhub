package uz.eventhub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.eventhub.backend.domain.entity.BarterRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BarterRequestRepository extends JpaRepository<BarterRequest, UUID> {

    boolean existsByOfferIdAndRequesterId(UUID offerId, UUID requesterId);

    Optional<BarterRequest> findByIdAndOffer_Business_Id(UUID id, UUID businessId);

    List<BarterRequest> findByOffer_Business_IdOrderByCreatedAtDesc(UUID businessId);

    List<BarterRequest> findByOffer_IdOrderByCreatedAtDesc(UUID offerId);
}
