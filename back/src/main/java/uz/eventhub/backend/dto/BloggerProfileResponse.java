package uz.eventhub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.eventhub.backend.dto.blogger.BloggerContentFormatDto;
import uz.eventhub.backend.dto.blogger.BloggerPlatformDto;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloggerProfileResponse {
    private UUID id;
    private UUID userId;
    private String fullName;
    private String bio;
    private String profilePhoto;
    private List<BloggerPlatformDto> platforms;
    private List<BloggerContentFormatDto> contentFormats;
    private List<String> categories;
    private Integer advancePaymentPercent;
    private Double rating;
    private boolean isVerified;
}
