package com.interviewscheduler.controller;

import com.interviewscheduler.model.Booking;
import com.interviewscheduler.repository.BookingRepository;
import com.interviewscheduler.repository.CandidateRepository;
import com.interviewscheduler.repository.SlotRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DashboardController {

    private final BookingRepository bookingRepo;
    private final CandidateRepository candidateRepo;
    private final SlotRepository slotRepo;

    public DashboardController(BookingRepository bookingRepo,
                               CandidateRepository candidateRepo,
                               SlotRepository slotRepo) {
        this.bookingRepo = bookingRepo;
        this.candidateRepo = candidateRepo;
        this.slotRepo = slotRepo;
    }

    @GetMapping
    public ResponseEntity<?> getDashboardStats() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Fetch Stats
        long scheduled = bookingRepo.countByStatus("scheduled");
        long completed = bookingRepo.countByStatus("completed"); // "Pending Feedback"
        long candidates = candidateRepo.count();
        long openSlots = slotRepo.countByBookedFalseAndStartAtAfter(now); // "Open Positions" proxy

        // 2. Fetch Upcoming Interviews (Top 5)
        List<Booking> upcoming = bookingRepo.findByStatusAndStartAtAfterOrderByStartAtAsc("scheduled", now);
        if (upcoming.size() > 5) {
            upcoming = upcoming.subList(0, 5);
        }

        // 3. Construct Response
        Map<String, Object> response = new HashMap<>();
        response.put("stats", Map.of(
            "scheduled", scheduled,
            "pendingFeedback", completed,
            "activeCandidates", candidates,
            "openSlots", openSlots
        ));
        response.put("upcoming", upcoming);

        return ResponseEntity.ok(response);
    }
}