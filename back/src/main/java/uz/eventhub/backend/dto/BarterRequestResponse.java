package uz.eventhub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.eventhub.backend.domain.enums.BarterStatus;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BarterRequestResponse {

    private UUID id;
    private UUID offerId;
    private String offerTitle;
    private UUID requesterId;
    private String requesterName;
    private Long followerCount;
    private String profileUrl;
    private String message;
    private BarterStatus status;
    private Instant createdAt;
}
