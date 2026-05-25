package uz.eventhub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EventPlanRequest {

    @NotBlank
    private String eventType;

    @NotBlank
    private String city;

    @NotNull
    private LocalDate date;

    @NotNull
    private Integer guestsCount;

    @NotNull
    private BigDecimal budget;

    @NotBlank
    private String selectedServices;
}
