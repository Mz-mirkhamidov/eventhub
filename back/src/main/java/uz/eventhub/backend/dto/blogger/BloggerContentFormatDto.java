package uz.eventhub.backend.dto.blogger;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.eventhub.backend.domain.enums.ContentFormat;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloggerContentFormatDto {
    private ContentFormat format;
    private BigDecimal price;
}
