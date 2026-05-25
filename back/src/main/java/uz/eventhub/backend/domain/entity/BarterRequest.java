package uz.eventhub.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import uz.eventhub.backend.domain.enums.BarterStatus;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "barter_requests", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"offer_id", "requester_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarterRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "offer_id", nullable = false)
    private BarterOffer offer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    private Long followerCount;

    @Column(nullable = false)
    private String profileUrl;

    @Column(columnDefinition = "text")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BarterStatus status = BarterStatus.REQUESTED;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
