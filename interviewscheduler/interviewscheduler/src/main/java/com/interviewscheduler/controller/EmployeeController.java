package com.interviewscheduler.controller;

import com.interviewscheduler.dto.EmployeeCredentialRequest;
import com.interviewscheduler.model.Booking;
import com.interviewscheduler.model.Interviewer;
import com.interviewscheduler.service.BookingService;
import com.interviewscheduler.service.InterviewerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class EmployeeController {

    private final BookingService bookingService;
    private final InterviewerService interviewerService;

    public EmployeeController(BookingService bookingService, InterviewerService interviewerService) {
        this.bookingService = bookingService;
        this.interviewerService = interviewerService;
    }

    // ================== EMPLOYEE MANAGEMENT ==================

    // 1. GET ALL EMPLOYEES
    @GetMapping
    public ResponseEntity<List<Interviewer>> getAllEmployees() {
        return ResponseEntity.ok(interviewerService.findAll());
    }

    // 2. CREATE EMPLOYEE
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeCredentialRequest req) {
        try {
            Interviewer i = new Interviewer();
            i.setName(req.getName());
            i.setEmail(req.getEmail());
            i.setRole("employee");

            if (req.getEnabled() != null) {
                i.setEnabled(req.getEnabled());
            }

            Interviewer created = interviewerService.create(i, req.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 3. UPDATE EMPLOYEE CREDENTIALS (From Admin Panel)
    @PutMapping("/admin/{id}/credentials")
    public ResponseEntity<?> updateCredentials(
            @PathVariable Long id,
            @RequestBody EmployeeCredentialRequest req) {

        try {
            Interviewer updated = interviewerService.updateCredentials(
                    id,
                    req.getName(),
                    req.getEmail(),
                    req.getPassword(),
                    req.getEnabled()
            );

            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Employee not found"));
            }

            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 4. DELETE EMPLOYEE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        boolean deleted = interviewerService.delete(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Employee not found"));
        }
        return ResponseEntity.ok(Map.of("message", "Employee deleted successfully"));
    }

    // ================== BOOKING & STATS ==================

    @GetMapping("/{id}/bookings")
    public ResponseEntity<List<Booking>> getBookings(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingsByInterviewer(id));
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> stats(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of(
                "scheduled", bookingService.countScheduled(id),
                "completed", bookingService.countCompleted(id),
                "cancelled", bookingService.countCancelled(id)
        ));
    }

    @PatchMapping("/{interviewerId}/bookings/{bookingId}")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long interviewerId,
            @PathVariable Long bookingId,
            @RequestParam String action) {

        String normalizedAction = action.trim().toLowerCase();
        if (!List.of("complete", "cancel").contains(normalizedAction)) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Invalid action. Allowed: complete | cancel"));
        }

        return bookingService.updateStatus(interviewerId, bookingId, normalizedAction);
    }
}
