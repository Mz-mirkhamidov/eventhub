package uz.eventhub.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.eventhub.backend.domain.entity.ArtistProfile;
import uz.eventhub.backend.domain.entity.BloggerProfile;
import uz.eventhub.backend.domain.entity.Booking;
import uz.eventhub.backend.domain.entity.User;
import uz.eventhub.backend.domain.entity.VenueProfile;
import uz.eventhub.backend.domain.enums.BookingStatus;
import uz.eventhub.backend.domain.enums.OrderType;
import uz.eventhub.backend.domain.enums.UserRole;
import uz.eventhub.backend.dto.BookingRequest;
import uz.eventhub.backend.dto.BookingResponse;
import uz.eventhub.backend.exception.ApiException;
import uz.eventhub.backend.repository.ArtistProfileRepository;
import uz.eventhub.backend.repository.BloggerProfileRepository;
import uz.eventhub.backend.repository.BookingRepository;
import uz.eventhub.backend.repository.UserRepository;
import uz.eventhub.backend.repository.VenueProfileRepository;
import uz.eventhub.backend.util.SecurityUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final int DEFAULT_ADVANCE_PERCENT = 30;

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ArtistProfileRepository artistProfileRepository;
    private final VenueProfileRepository venueProfileRepository;
    private final BloggerProfileRepository bloggerProfileRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User client = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (client.getRole() != UserRole.CLIENT) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only clients can create bookings");
        }
        if (request.getOrderType() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "orderType is required");
        }
        if (request.getTotalPrice() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "totalPrice is required");
        }

        int advancePercent = DEFAULT_ADVANCE_PERCENT;
        Booking.BookingBuilder builder = Booking.builder()
                .client(client)
                .orderType(request.getOrderType())
                .totalPrice(request.getTotalPrice())
                .notes(request.getNotes())
                .eventCity(request.getEventCity())
                .guestsCount(request.getGuestsCount())
                .status(BookingStatus.PENDING);

        switch (request.getOrderType()) {
            case BLOGGER_ORDER -> advancePercent = applyBloggerOrder(builder, request);
            case ARTIST_BOOKING -> advancePercent = applyArtistBooking(builder, request);
            case VENUE_BOOKING -> advancePercent = applyVenueBooking(builder, request);
        }

        BigDecimal advance = resolveAdvancePayment(request.getAdvancePayment(), request.getTotalPrice(), advancePercent);
        builder.advancePayment(advance);

        Booking booking = bookingRepository.save(builder.build());
        return toResponse(booking);
    }

    private BigDecimal resolveAdvancePayment(BigDecimal requested, BigDecimal total, int percent) {
        BigDecimal advance = requested;
        if (advance == null) {
            advance = total
                    .multiply(BigDecimal.valueOf(percent))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }
        if (advance.compareTo(total) > 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "advancePayment cannot exceed totalPrice");
        }
        if (advance.compareTo(BigDecimal.ZERO) < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "advancePayment must be non-negative");
        }
        return advance;
    }

    private int percentOrDefault(Integer percent) {
        return percent != null && percent > 0 && percent <= 100 ? percent : DEFAULT_ADVANCE_PERCENT;
    }

    private int applyBloggerOrder(Booking.BookingBuilder builder, BookingRequest request) {
        if (request.getBloggerId() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "bloggerId is required for BLOGGER_ORDER");
        }
        if (request.getPublicationDate() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "publicationDate is required");
        }
        if (request.getContentFormat() == null || request.getContentFormat().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "contentFormat is required");
        }
        if (request.getBriefDescription() == null || request.getBriefDescription().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "briefDescription is required");
        }
        BloggerProfile blogger = bloggerProfileRepository.findById(request.getBloggerId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Blogger not found"));
        builder.blogger(blogger)
                .publicationDate(request.getPublicationDate())
                .eventDate(request.getPublicationDate())
                .contentFormat(request.getContentFormat().toUpperCase())
                .briefDescription(request.getBriefDescription())
                .referenceLink(request.getReferenceLink())
                .startTime(java.time.LocalTime.of(0, 0))
                .endTime(java.time.LocalTime.of(23, 59));
        return percentOrDefault(blogger.getAdvancePaymentPercent());
    }

    private int applyArtistBooking(Booking.BookingBuilder builder, BookingRequest request) {
        if (request.getArtistId() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "artistId is required for ARTIST_BOOKING");
        }
        if (request.getEventDate() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "eventDate is required");
        }
        ArtistProfile artist = artistProfileRepository.findById(request.getArtistId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Artist not found"));
        boolean perEvent = request.getStartTime() == null && request.getEndTime() == null;
        if (!perEvent) {
            if (request.getStartTime() == null || request.getEndTime() == null) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Both startTime and endTime required for hourly booking");
            }
            if (!request.getEndTime().isAfter(request.getStartTime())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "End time must be after start time");
            }
        }
        builder.artist(artist)
                .eventDate(request.getEventDate())
                .startTime(perEvent ? java.time.LocalTime.of(0, 0) : request.getStartTime())
                .endTime(perEvent ? java.time.LocalTime.of(23, 59) : request.getEndTime());
        return percentOrDefault(artist.getAdvancePaymentPercent());
    }

    private int applyVenueBooking(Booking.BookingBuilder builder, BookingRequest request) {
        if (request.getVenueId() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "venueId is required for VENUE_BOOKING");
        }
        if (request.getEventDate() == null || request.getStartTime() == null || request.getEndTime() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "eventDate, startTime and endTime are required");
        }
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }
        VenueProfile venue = venueProfileRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Venue not found"));
        builder.venue(venue)
                .eventDate(request.getEventDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime());
        return percentOrDefault(venue.getAdvancePaymentPercent());
    }

    @Transactional
    public BookingResponse confirmBooking(UUID bookingId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only pending bookings can be confirmed");
        }
        if (!isProviderOwner(booking, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the provider can confirm this booking");
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(UUID bookingId, String reason) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only pending bookings can be cancelled");
        }
        if (reason == null || reason.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cancellation reason is required");
        }
        boolean isClient = booking.getClient().getId().equals(userId);
        if (!isClient && !isProviderOwner(booking, userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not authorized to cancel this booking");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason.trim());
        booking = bookingRepository.save(booking);
        return toResponse(booking);
    }

    private boolean isProviderOwner(Booking booking, UUID userId) {
        if (booking.getArtist() != null && booking.getArtist().getUser().getId().equals(userId)) return true;
        if (booking.getVenue() != null && booking.getVenue().getUser().getId().equals(userId)) return true;
        return booking.getBlogger() != null && booking.getBlogger().getUser().getId().equals(userId);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings() {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        List<Booking> bookings;
        if (user.getRole() == UserRole.CLIENT) {
            bookings = bookingRepository.findByClientIdOrderByCreatedAtDesc(userId);
        } else if (user.getRole() == UserRole.ARTIST) {
            ArtistProfile artist = artistProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Artist profile not found"));
            bookings = bookingRepository.findAll().stream()
                    .filter(b -> b.getArtist() != null && b.getArtist().getId().equals(artist.getId()))
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .toList();
        } else if (user.getRole() == UserRole.VENUE) {
            VenueProfile venue = venueProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Venue profile not found"));
            bookings = bookingRepository.findAll().stream()
                    .filter(b -> b.getVenue() != null && b.getVenue().getId().equals(venue.getId()))
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .toList();
        } else if (user.getRole() == UserRole.BLOGGER) {
            BloggerProfile blogger = bloggerProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Blogger profile not found"));
            bookings = bookingRepository.findAll().stream()
                    .filter(b -> b.getBlogger() != null && b.getBlogger().getId().equals(blogger.getId()))
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .toList();
        } else {
            bookings = List.of();
        }
        return bookings.stream().map(this::toResponse).toList();
    }

    public BookingResponse toResponse(Booking booking) {
        BigDecimal advance = booking.getAdvancePayment() != null ? booking.getAdvancePayment() : BigDecimal.ZERO;
        BigDecimal remaining = booking.getTotalPrice().subtract(advance);
        return BookingResponse.builder()
                .id(booking.getId())
                .clientId(booking.getClient().getId())
                .orderType(booking.getOrderType())
                .artistId(booking.getArtist() != null ? booking.getArtist().getId() : null)
                .venueId(booking.getVenue() != null ? booking.getVenue().getId() : null)
                .bloggerId(booking.getBlogger() != null ? booking.getBlogger().getId() : null)
                .eventDate(booking.getEventDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .publicationDate(booking.getPublicationDate())
                .contentFormat(booking.getContentFormat())
                .briefDescription(booking.getBriefDescription())
                .referenceLink(booking.getReferenceLink())
                .totalPrice(booking.getTotalPrice())
                .advancePayment(booking.getAdvancePayment())
                .remainingPayment(remaining.max(BigDecimal.ZERO))
                .eventCity(booking.getEventCity())
                .guestsCount(booking.getGuestsCount())
                .status(booking.getStatus())
                .notes(booking.getNotes())
                .cancellationReason(booking.getCancellationReason())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
