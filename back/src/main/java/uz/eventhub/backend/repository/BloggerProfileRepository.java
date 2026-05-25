package uz.eventhub.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uz.eventhub.backend.domain.entity.BloggerProfile;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

public interface BloggerProfileRepository extends JpaRepository<BloggerProfile, UUID> {

    Optional<BloggerProfile> findByUserId(UUID userId);

    @Query(value = """
            SELECT DISTINCT b.* FROM blogger_profiles b
            JOIN users u ON u.id = b.user_id
            WHERE u.is_active = true
            AND (:search IS NULL OR :search = '' OR LOWER(u.full_name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR (:searchAlt IS NOT NULL AND :searchAlt <> '' AND LOWER(u.full_name) LIKE LOWER(CONCAT('%', :searchAlt, '%'))))
            AND (:category IS NULL OR :category = '' OR b.categories::text ILIKE CONCAT('%', :category, '%'))
            AND (:platform IS NULL OR EXISTS (
                SELECT 1 FROM jsonb_array_elements(b.platforms) elem
                WHERE elem->>'platform' = CAST(:platform AS text)
            ))
            AND (:minFollowers IS NULL OR EXISTS (
                SELECT 1 FROM jsonb_array_elements(b.platforms) elem
                WHERE (elem->>'followerCount')::bigint >= :minFollowers
            ))
            AND (:maxFollowers IS NULL OR EXISTS (
                SELECT 1 FROM jsonb_array_elements(b.platforms) elem
                WHERE (elem->>'followerCount')::bigint <= :maxFollowers
            ))
            AND (:maxPrice IS NULL OR EXISTS (
                SELECT 1 FROM jsonb_array_elements(b.content_formats) elem
                WHERE (elem->>'price')::numeric <= :maxPrice
            ))
            """,
            countQuery = """
            SELECT COUNT(DISTINCT b.id) FROM blogger_profiles b
            JOIN users u ON u.id = b.user_id
            WHERE u.is_active = true
            AND (:search IS NULL OR :search = '' OR LOWER(u.full_name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR (:searchAlt IS NOT NULL AND :searchAlt <> '' AND LOWER(u.full_name) LIKE LOWER(CONCAT('%', :searchAlt, '%'))))
            AND (:category IS NULL OR :category = '' OR b.categories::text ILIKE CONCAT('%', :category, '%'))
            AND (:platform IS NULL OR EXISTS (
                SELECT 1 FROM jsonb_array_elements(b.platforms) elem
                WHERE elem->>'platform' = CAST(:platform AS text)
            ))
            AND (:minFollowers IS NULL OR EXISTS (
                SELECT 1 FROM jsonb_array_elements(b.platforms) elem
                WHERE (elem->>'followerCount')::bigint >= :minFollowers
            ))
            AND (:maxFollowers IS NULL OR EXISTS (
                SELECT 1 FROM jsonb_array_elements(b.platforms) elem
                WHERE (elem->>'followerCount')::bigint <= :maxFollowers
            ))
            AND (:maxPrice IS NULL OR EXISTS (
                SELECT 1 FROM jsonb_array_elements(b.content_formats) elem
                WHERE (elem->>'price')::numeric <= :maxPrice
            ))
            """,
            nativeQuery = true)
    Page<BloggerProfile> search(
            @Param("platform") String platform,
            @Param("minFollowers") Long minFollowers,
            @Param("maxFollowers") Long maxFollowers,
            @Param("category") String category,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("search") String search,
            @Param("searchAlt") String searchAlt,
            Pageable pageable);
}
