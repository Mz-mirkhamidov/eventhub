package uz.eventhub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.eventhub.backend.domain.enums.BookingStatus;
import uz.eventhub.backend.domain.enums.OrderType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private UUID id;
    private UUID clientId;
    private OrderType orderType;
    private UUID artistId;
    private UUID venueId;
    private UUID bloggerId;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate publicationDate;
    private String contentFormat;
    private String briefDescription;
    private String referenceLink;
    private BigDecimal totalPrice;
    private BigDecimal advancePayment;
    private BigDecimal remainingPayment;
    private String eventCity;
    private Integer guestsCount;
    private BookingStatus status;
    private String notes;
    private String cancellationReason;
    private Instant createdAt;
}
