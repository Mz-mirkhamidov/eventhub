package uz.eventhub.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uz.eventhub.backend.domain.entity.VenueProfile;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

public interface VenueProfileRepository extends JpaRepository<VenueProfile, UUID> {

    Optional<VenueProfile> findByUserId(UUID userId);

    @Query("""
            SELECT v FROM VenueProfile v
            JOIN v.user u
            WHERE u.isActive = true
            AND (:minCapacity IS NULL OR v.capacity >= :minCapacity)
            AND (:maxCapacity IS NULL OR v.capacity <= :maxCapacity)
            AND (:minPrice IS NULL OR v.pricePerHour >= :minPrice)
            AND (:maxPrice IS NULL OR v.pricePerHour <= :maxPrice)
            AND (:city IS NULL OR :city = '' OR LOWER(v.address) LIKE LOWER(CONCAT('%', :city, '%')))
            AND (
                :search IS NULL OR :search = '' OR
                LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(COALESCE(v.description, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(v.address) LIKE LOWER(CONCAT('%', :search, '%')) OR
                (:searchAlt IS NOT NULL AND :searchAlt <> '' AND (
                    LOWER(v.name) LIKE LOWER(CONCAT('%', :searchAlt, '%')) OR
                    LOWER(COALESCE(v.description, '')) LIKE LOWER(CONCAT('%', :searchAlt, '%')) OR
                    LOWER(v.address) LIKE LOWER(CONCAT('%', :searchAlt, '%'))
                ))
            )
            """)
    Page<VenueProfile> search(
            @Param("minCapacity") Integer minCapacity,
            @Param("maxCapacity") Integer maxCapacity,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("city") String city,
            @Param("search") String search,
            @Param("searchAlt") String searchAlt,
            Pageable pageable);
}
