package uz.eventhub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import uz.eventhub.backend.domain.enums.SocialPlatform;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BarterOfferRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private BigDecimal productValue;

    @NotNull
    private SocialPlatform platform;

    private Long minFollowers;

    private LocalDateTime expiresAt;
}
