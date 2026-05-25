package uz.eventhub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistProfileResponse {

    private UUID id;
    private UUID userId;
    private String fullName;
    private Long categoryId;
    private String categoryName;
    private String bio;
    private String profilePhoto;
    private java.util.List<String> portfolioPhotos;
    private BigDecimal pricePerHour;
    private BigDecimal pricePerEvent;
    private Integer advancePaymentPercent;
    private Double rating;
    private boolean isVerified;
}
