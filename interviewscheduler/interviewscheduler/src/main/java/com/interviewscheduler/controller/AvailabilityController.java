package com.interviewscheduler.controller;

import com.interviewscheduler.model.Availability;
import com.interviewscheduler.model.Interviewer;
import com.interviewscheduler.repository.AvailabilityRepository;
import com.interviewscheduler.repository.InterviewerRepository;
import com.interviewscheduler.service.SlotService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/employee")
@CrossOrigin(origins = {"http://localhost:3000"})
public class AvailabilityController {

    private final AvailabilityRepository availabilityRepository;
    private final InterviewerRepository interviewerRepository;
    private final SlotService slotService;

    public AvailabilityController(
            AvailabilityRepository availabilityRepository,
            InterviewerRepository interviewerRepository,
            SlotService slotService
    ) {
        this.availabilityRepository = availabilityRepository;
        this.interviewerRepository = interviewerRepository;
        this.slotService = slotService;
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<Availability>> get(@PathVariable Long id) {
        return ResponseEntity.ok(availabilityRepository.findByInterviewerId(id));
    }

    @Transactional
    @PostMapping("/{id}/availability")
    public ResponseEntity<?> save(@PathVariable Long id, @RequestBody List<Availability> incoming) {

        Interviewer interviewer = interviewerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interviewer not found"));

        for (Availability a : incoming) {
            if (a.getDayOfWeek() == null || a.getStartTime() == null || a.getEndTime() == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            LocalTime start = LocalTime.parse(a.getStartTime());
            LocalTime end = LocalTime.parse(a.getEndTime());
            if (!end.isAfter(start)) {
                return ResponseEntity.badRequest().body("End time must be after start time");
            }

            a.setInterviewer(interviewer);
            a.setId(null);
        }

        availabilityRepository.deleteByInterviewerId(id);
        availabilityRepository.saveAll(incoming);

        // Updated to 3 weeks
        slotService.regenerateSlotsForInterviewer(id, 3);

        return ResponseEntity.ok(availabilityRepository.findByInterviewerId(id));
    }
}