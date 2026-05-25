package uz.eventhub.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ArtistProfileRequest {

    @NotNull
    private Long categoryId;

    private String bio;

    private String profilePhoto;

    private java.util.List<String> portfolioPhotos;

    private BigDecimal pricePerHour;

    private BigDecimal pricePerEvent;

    private Integer advancePaymentPercent;
}
