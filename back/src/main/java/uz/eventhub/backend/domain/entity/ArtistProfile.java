package uz.eventhub.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "artist_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtistProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(columnDefinition = "text")
    private String bio;

    private String profilePhoto;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private java.util.List<String> portfolioPhotos = new java.util.ArrayList<>();

    @Column(precision = 12, scale = 2)
    private BigDecimal pricePerHour;

    @Column(precision = 12, scale = 2)
    private BigDecimal pricePerEvent;

    @Column(name = "advance_payment_percent")
    @Builder.Default
    private Integer advancePaymentPercent = 30;

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private boolean isVerified = false;
}
