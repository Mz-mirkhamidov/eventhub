package uz.eventhub.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import uz.eventhub.backend.domain.enums.BookingStatus;
import uz.eventhub.backend.domain.enums.OrderType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_type", nullable = false, length = 20)
    private OrderType orderType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private ArtistProfile artist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id")
    private VenueProfile venue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blogger_profile_id")
    private BloggerProfile blogger;

    private LocalDate eventDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalDate publicationDate;

    @Column(length = 30)
    private String contentFormat;

    @Column(columnDefinition = "text")
    private String briefDescription;

    @Column(length = 500)
    private String referenceLink;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    @Column(precision = 12, scale = 2)
    private BigDecimal advancePayment;

    @Column(name = "event_city", length = 100)
    private String eventCity;

    @Column(name = "guests_count")
    private Integer guestsCount;

    @Column(name = "cancellation_reason", columnDefinition = "text")
    private String cancellationReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(columnDefinition = "text")
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
