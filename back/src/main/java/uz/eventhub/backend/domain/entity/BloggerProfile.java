package uz.eventhub.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import uz.eventhub.backend.dto.blogger.BloggerContentFormatDto;
import uz.eventhub.backend.dto.blogger.BloggerPlatformDto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "blogger_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloggerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "text")
    private String bio;

    private String profilePhoto;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private List<BloggerPlatformDto> platforms = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private List<BloggerContentFormatDto> contentFormats = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private List<String> categories = new ArrayList<>();

    @Column(name = "advance_payment_percent")
    @Builder.Default
    private Integer advancePaymentPercent = 30;

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private boolean isVerified = false;
}
