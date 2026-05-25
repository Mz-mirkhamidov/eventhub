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
public class VenueProfileResponse {

    private UUID id;
    private UUID userId;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String coverPhoto;
    private java.util.List<String> photos;
    private String description;
    private String address;
    private Double latitude;
    private Double longitude;
    private Integer capacity;
    private BigDecimal pricePerHour;
    private Integer advancePaymentPercent;
    private Double rating;
    private boolean isVerified;
}
