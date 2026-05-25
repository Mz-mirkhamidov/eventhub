package uz.eventhub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessProfileResponse {
    private UUID userId;
    private String fullName;
    private String logo;
    private String address;
    private Double latitude;
    private Double longitude;
}
