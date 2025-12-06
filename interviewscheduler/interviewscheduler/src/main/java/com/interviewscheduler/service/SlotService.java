package com.interviewscheduler.service;

import com.interviewscheduler.model.Availability;
import com.interviewscheduler.model.Booking;
import com.interviewscheduler.model.Interviewer;
import com.interviewscheduler.model.Slot;
import com.interviewscheduler.repository.AvailabilityRepository;
import com.interviewscheduler.repository.BookingRepository;
import com.interviewscheduler.repository.InterviewerRepository;
import com.interviewscheduler.repository.SlotRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class SlotService {

    private final SlotRepository slotRepo;
    private final AvailabilityRepository availabilityRepo;
    private final InterviewerRepository interviewerRepo;
    private final BookingRepository bookingRepo;

    public SlotService(SlotRepository slotRepo,
                       AvailabilityRepository availabilityRepo,
                       InterviewerRepository interviewerRepo,
                       BookingRepository bookingRepo) {
        this.slotRepo = slotRepo;
        this.availabilityRepo = availabilityRepo;
        this.interviewerRepo = interviewerRepo;
        this.bookingRepo = bookingRepo;
    }

    // --- PAGINATED WEEKLY SLOTS ---
    public Page<Slot> getSlotsByWeek(String weekType, int page, int size) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start;
        LocalDateTime end;

        switch (weekType) {
            case "next" -> {
                start = now.plusWeeks(1);
                end = now.plusWeeks(2);
            }
            case "nextNext" -> {
                start = now.plusWeeks(2);
                end = now.plusWeeks(3);
            }
            default -> {
                start = now;
                end = now.plusWeeks(1);
            }
        }

        return slotRepo.findByBookedFalseAndStartAtBetweenOrderByStartAtAsc(
                start, end, PageRequest.of(page, size)
        );
    }

    public Slot getSlotById(Long id) {
        return slotRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("SLOT_NOT_FOUND"));
    }

    // Fetch for Admin/User
    public List<Slot> getAllAvailableSlots() {
        return slotRepo.findByBookedFalseOrderByStartAtAsc();
    }

    public List<Slot> getAvailableSlotsForInterviewer(Long interviewerId) {
        Interviewer interviewer = interviewerRepo.findById(interviewerId)
                .orElseThrow(() -> new IllegalArgumentException("INTERVIEWER_NOT_FOUND"));

        return slotRepo
                .findByInterviewerAndBookedFalseAndStartAtAfterOrderByStartAtAsc(
                interviewer, LocalDateTime.now()
        );
    }

    // --- BOOK SLOT WITH LOCK (AVOID DOUBLE BOOKING) ---
    @Transactional
    public Booking bookSlot(Long slotId, String candidateName, String candidateEmail) {

        if (bookingRepo.existsByCandidateEmailAndStatus(candidateEmail, "scheduled")) {
            throw new IllegalStateException("CANDIDATE_LIMIT_REACHED");
        }

        Slot slot = slotRepo.findByIdWithLock(slotId)
                .orElseThrow(() -> new RuntimeException("SLOT_NOT_FOUND"));

        if (slot.isBooked()) {
            throw new RuntimeException("SLOT_ALREADY_TAKEN");
        }

        slot.setBooked(true);
        slotRepo.save(slot);

        Booking booking = new Booking();
        booking.setStartAt(slot.getStartAt());
        booking.setEndAt(slot.getEndAt());
        booking.setInterviewer(slot.getInterviewer());
        booking.setCandidateName(candidateName);
        booking.setCandidateEmail(candidateEmail);
        booking.setStatus("scheduled");

        return bookingRepo.save(booking);
    }

    // --- CANCEL BOOKING ---
    @Transactional
    public void cancelBooking(Long bookingId) {

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("BOOKING_NOT_FOUND"));

        if (!"scheduled".equals(booking.getStatus())) {
            throw new RuntimeException("ONLY_SCHEDULED_CAN_BE_CANCELLED");
        }

        booking.setStatus("cancelled");
        bookingRepo.save(booking);

        Slot slot = slotRepo.findByInterviewerAndStartAt(
                booking.getInterviewer(), booking.getStartAt()
        ).orElseThrow(() -> new RuntimeException("SLOT_NOT_FOUND_FOR_BOOKING"));

        slot.setBooked(false);
        slotRepo.save(slot);
    }

    // --- REGENERATE FUTURE SLOTS ---
    @Transactional
    public void regenerateSlotsForInterviewer(Long interviewerId, int weeksToGenerate) {
        Interviewer interviewer = interviewerRepo.findById(interviewerId)
                .orElseThrow(() -> new IllegalArgumentException("INTERVIEWER_NOT_FOUND"));

        List<Availability> availabilities = availabilityRepo.findByInterviewerId(interviewerId);
        if (availabilities == null || availabilities.isEmpty()) return;

        List<Slot> existing = slotRepo.findFutureByInterviewer(interviewerId, LocalDateTime.now());
        existing.stream().filter(s -> !s.isBooked()).forEach(slotRepo::delete);

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusWeeks(weeksToGenerate);

        for (LocalDate date = today; date.isBefore(endDate); date = date.plusDays(1)) {
            int dayOfWeek = date.getDayOfWeek().getValue();
            for (Availability a : availabilities) {
                if (a.getDayOfWeek() == dayOfWeek) {
                    createSlotsForDay(interviewer, date, a.getStartTime(), a.getEndTime());
                }
            }
        }
    }

    private void createSlotsForDay(Interviewer interviewer, LocalDate date, String startStr, String endStr) {
        LocalTime start = LocalTime.parse(startStr);
        LocalTime end = LocalTime.parse(endStr);

        for (LocalTime time = start; !time.isAfter(end.minusHours(1)); time = time.plusHours(1)) {
            LocalDateTime slotStart = LocalDateTime.of(date, time);
            if (slotRepo.findByInterviewerAndStartAt(interviewer, slotStart).isEmpty()) {
                Slot slot = new Slot(slotStart, slotStart.plusHours(1), interviewer);
                slotRepo.save(slot);
            }
        }
    }
}
