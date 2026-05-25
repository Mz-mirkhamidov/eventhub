package uz.eventhub.backend.dto;

import lombok.Data;

@Data
public class BusinessProfileRequest {
    private String logo;
    private String address;
    private Double latitude;
    private Double longitude;
}
