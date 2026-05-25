package uz.eventhub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VenueProfileRequest {

    private Long categoryId;

    @NotBlank
    private String name;

    private String coverPhoto;

    private java.util.List<String> photos;

    private String description;

    @NotBlank
    private String address;

    private Double latitude;

    private Double longitude;

    @NotNull
    private Integer capacity;

    @NotNull
    private BigDecimal pricePerHour;

    private Integer advancePaymentPercent;
}
