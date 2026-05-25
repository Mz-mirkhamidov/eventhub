package uz.eventhub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CancelBookingRequest {

    @NotBlank(message = "Bekor qilish sababi majburiy")
    private String reason;
}
