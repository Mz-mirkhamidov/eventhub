package uz.eventhub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.eventhub.backend.domain.entity.BarterOffer;
import uz.eventhub.backend.domain.enums.BarterStatus;

import java.util.List;
import java.util.UUID;

public interface BarterOfferRepository extends JpaRepository<BarterOffer, UUID> {

    List<BarterOffer> findByStatusOrderByCreatedAtDesc(BarterStatus status);

    List<BarterOffer> findByBusiness_IdOrderByCreatedAtDesc(UUID businessId);
}
