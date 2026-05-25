package uz.eventhub.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "event_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(name = "event_type", length = 50)
    private String eventType;

    @Column(length = 100)
    private String city;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "guests_count")
    private Integer guestsCount;

    @Column(precision = 14, scale = 2)
    private BigDecimal budget;

    @Column(name = "selected_services", columnDefinition = "text")
    private String selectedServices;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
