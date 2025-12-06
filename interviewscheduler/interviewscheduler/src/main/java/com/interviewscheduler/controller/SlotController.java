package com.interviewscheduler.controller;

import com.interviewscheduler.model.Booking;
import com.interviewscheduler.model.Slot;
import com.interviewscheduler.service.SlotService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/slots")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class SlotController {

    private final SlotService slotService;

    public SlotController(SlotService slotService) {
        this.slotService = slotService;
    }

    /**
     * Get Slots with Pagination & Week Filter
     * Example: /slots?weekType=next&page=1&size=10
     */
    @GetMapping
    public ResponseEntity<Page<Slot>> getSlots(
            @RequestParam(defaultValue = "current") String weekType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        if (page < 0) page = 0;
        if (size < 1) size = 20;

        return ResponseEntity.ok(slotService.getSlotsByWeek(weekType, page, size));
    }

    /**
     * Get single slot by ID (New)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getSlot(@PathVariable Long id) {
        try {
            Slot slot = slotService.getSlotById(id);
            return ResponseEntity.ok(slot);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Candidate Books a Slot
     */
    @PostMapping("/{id}/book")
    public ResponseEntity<?> bookSlot(
            @PathVariable Long id,
            @RequestBody BookingRequest request
    ) {
        try {
            if (request.candidateEmail == null || request.candidateEmail.isBlank()
                    || request.candidateName == null || request.candidateName.isBlank()) {

                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("CANDIDATE_NAME_AND_EMAIL_REQUIRED"));
            }

            Booking booking = slotService.bookSlot(id, request.candidateName, request.candidateEmail);
            return ResponseEntity.ok(booking);

        } catch (IllegalStateException e) {
            return ResponseEntity.status(403)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(409)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ErrorResponse("SERVER_ERROR"));
        }
    }

    // Request Body DTO
    static class BookingRequest {
        public String candidateName;
        public String candidateEmail;
    }

    // Standard Error Response Format
    static class ErrorResponse {
        public String message;
        public ErrorResponse(String message) { this.message = message; }
    }
}
