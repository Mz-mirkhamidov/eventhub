package uz.eventhub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventPlanResponse {

    private UUID id;
    private String eventType;
    private String city;
    private LocalDate eventDate;
    private Integer guestsCount;
    private BigDecimal budget;
    private String selectedServices;
    private Instant createdAt;
}
