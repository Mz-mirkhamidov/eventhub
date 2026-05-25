package uz.eventhub.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.eventhub.backend.dto.BookingRequest;
import uz.eventhub.backend.dto.BookingResponse;
import uz.eventhub.backend.dto.CancelBookingRequest;
import uz.eventhub.backend.service.BookingService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public BookingResponse createBooking(@Valid @RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }

    @GetMapping("/my")
    public List<BookingResponse> getMyBookings() {
        return bookingService.getMyBookings();
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('ARTIST', 'VENUE')")
    public BookingResponse confirmBooking(@PathVariable UUID id) {
        return bookingService.confirmBooking(id);
    }

    @PutMapping("/{id}/cancel")
    public BookingResponse cancelBooking(@PathVariable UUID id, @Valid @RequestBody CancelBookingRequest request) {
        return bookingService.cancelBooking(id, request.getReason());
    }
}
