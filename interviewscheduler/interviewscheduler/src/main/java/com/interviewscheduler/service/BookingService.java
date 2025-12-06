package com.interviewscheduler.service;

import com.interviewscheduler.model.Booking;
import com.interviewscheduler.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;

    public BookingService(BookingRepository bookingRepo) {
        this.bookingRepo = bookingRepo;
    }

    // Get bookings for an interviewer (employee dashboard)
    public List<Booking> getBookingsByInterviewer(Long interviewerId) {
        return bookingRepo.findAllByInterviewer(interviewerId);
    }

    // Get bookings for a candidate (frontend booking list)
    public List<Booking> getBookingsByCandidate(String email) {
        if (email == null || email.isBlank()) return Collections.emptyList();
        return bookingRepo.findByCandidateEmail(email);
    }

    // Status counts (employee stats)
    public long countScheduled(Long interviewerId) {
        return bookingRepo.countByInterviewerAndStatus(interviewerId, "scheduled");
    }

    public long countCompleted(Long interviewerId) {
        return bookingRepo.countByInterviewerAndStatus(interviewerId, "completed");
    }

    public long countCancelled(Long interviewerId) {
        return bookingRepo.countByInterviewerAndStatus(interviewerId, "cancelled");
    }

    // Update status with ownership check
    public ResponseEntity<?> updateStatus(Long interviewerId, Long bookingId, String action) {
        Booking booking = bookingRepo.findById(bookingId).orElse(null);
        if (booking == null) return ResponseEntity.notFound().build();

        if (!booking.getInterviewer().getId().equals(interviewerId)) {
            return ResponseEntity.status(403).body("Forbidden: Not your booking");
        }

        switch (action) {
            case "complete" -> booking.setStatus("completed");
            case "cancel" -> booking.setStatus("cancelled");
            default -> {
                return ResponseEntity.badRequest().body("Invalid action");
            }
        }

        bookingRepo.save(booking);
        return ResponseEntity.ok(booking);
    }
}
