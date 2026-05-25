package uz.eventhub.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import uz.eventhub.backend.domain.enums.OrderType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class BookingRequest {

    @NotNull
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

    @NotNull
    private BigDecimal totalPrice;

    private BigDecimal advancePayment;

    private String eventCity;

    private Integer guestsCount;

    private String notes;
}
