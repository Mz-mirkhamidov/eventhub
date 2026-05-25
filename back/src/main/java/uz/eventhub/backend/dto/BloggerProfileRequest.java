package uz.eventhub.backend.dto;

import lombok.Data;
import uz.eventhub.backend.dto.blogger.BloggerContentFormatDto;
import uz.eventhub.backend.dto.blogger.BloggerPlatformDto;

import java.util.ArrayList;
import java.util.List;

@Data
public class BloggerProfileRequest {
    private String bio;
    private String profilePhoto;
    private List<BloggerPlatformDto> platforms = new ArrayList<>();
    private List<BloggerContentFormatDto> contentFormats = new ArrayList<>();
    private List<String> categories = new ArrayList<>();

    private Integer advancePaymentPercent;
}
