package uz.eventhub.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uz.eventhub.backend.domain.entity.ArtistProfile;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

public interface ArtistProfileRepository extends JpaRepository<ArtistProfile, UUID> {

    Optional<ArtistProfile> findByUserId(UUID userId);

    @Query("""
            SELECT a FROM ArtistProfile a
            JOIN a.user u
            WHERE u.isActive = true
            AND (:categoryId IS NULL OR a.category.id = :categoryId)
            AND (:minPrice IS NULL OR a.pricePerHour >= :minPrice)
            AND (:maxPrice IS NULL OR a.pricePerHour <= :maxPrice)
            AND (
                :search IS NULL OR :search = '' OR
                LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(COALESCE(a.bio, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR
                (:searchAlt IS NOT NULL AND :searchAlt <> '' AND (
                    LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchAlt, '%')) OR
                    LOWER(COALESCE(a.bio, '')) LIKE LOWER(CONCAT('%', :searchAlt, '%'))
                ))
            )
            """)
    Page<ArtistProfile> search(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("search") String search,
            @Param("searchAlt") String searchAlt,
            Pageable pageable);
}
