package uz.eventhub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BarterRequestDto {

    @NotNull
    private Long followerCount;

    @NotBlank
    private String profileUrl;

    private String message;
}
