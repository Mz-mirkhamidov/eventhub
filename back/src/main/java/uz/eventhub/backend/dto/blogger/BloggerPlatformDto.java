package uz.eventhub.backend.dto.blogger;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.eventhub.backend.domain.enums.SocialPlatform;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloggerPlatformDto {
    private SocialPlatform platform;
    private String username;
    private Long followerCount;
    private BigDecimal engagementRate;
    private String profileUrl;
}
