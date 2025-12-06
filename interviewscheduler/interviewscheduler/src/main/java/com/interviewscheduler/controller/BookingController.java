package com.interviewscheduler.controller;

import com.interviewscheduler.model.Booking;
import com.interviewscheduler.service.BookingService;
import com.interviewscheduler.service.SlotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class BookingController {

    private final BookingService bookingService;
    private final SlotService slotService; // Inject SlotService for cancellations

    public BookingController(BookingService bookingService, SlotService slotService) {
        this.bookingService = bookingService;
        this.slotService = slotService;
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getBookings(@RequestParam(required = false) String candidateEmail) {
        if (candidateEmail != null) {
            return ResponseEntity.ok(bookingService.getBookingsByCandidate(candidateEmail));
        }
        return ResponseEntity.badRequest().build();
    }

    // DELETE /bookings/{id} - cancel a booking and free the slot
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            slotService.cancelBooking(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}