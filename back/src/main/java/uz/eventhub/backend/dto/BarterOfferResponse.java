package uz.eventhub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.eventhub.backend.domain.enums.BarterStatus;
import uz.eventhub.backend.domain.enums.SocialPlatform;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BarterOfferResponse {

    private UUID id;
    private UUID businessId;
    private String businessName;
    private String title;
    private String description;
    private BigDecimal productValue;
    private SocialPlatform platform;
    private Long minFollowers;
    private BarterStatus status;
    private LocalDateTime expiresAt;
    private Instant createdAt;
}
