package com.interviewscheduler.repository;

import com.interviewscheduler.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ====== Candidate Queries ======
    List<Booking> findByCandidateEmail(String email);

    boolean existsByCandidateEmailAndStatus(String email, String status);

    // Candidate cannot book if they have ANY future scheduled interview
    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.candidateEmail = :email
          AND b.status = 'scheduled'
          AND b.startAt >= :now
    """)
    boolean hasActiveFutureBooking(
            @Param("email") String email,
            @Param("now") LocalDateTime now
    );


    // ====== Interviewer Queries ======
    @Query("SELECT b FROM Booking b WHERE b.interviewer.id = :interviewerId ORDER BY b.startAt ASC")
    List<Booking> findAllByInterviewer(@Param("interviewerId") Long interviewerId);

    List<Booking> findByInterviewerIdAndStatusOrderByStartAtAsc(Long interviewerId, String status);

    @Query("""
        SELECT COUNT(b) FROM Booking b
        WHERE b.interviewer.id = :interviewerId
          AND b.status = :status
    """)
    long countByInterviewerAndStatus(
            @Param("interviewerId") Long interviewerId,
            @Param("status") String status
    );


    // ====== Dashboard Stats ======
    long countByStatus(String status);

    // For upcoming interviews only (home screen)
    List<Booking> findByStatusAndStartAtAfterOrderByStartAtAsc(
            String status,
            LocalDateTime now
    );


    // ====== Slot Collision Prevention ======
    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.interviewer.id = :interviewerId
          AND b.startAt = :startAt
          AND b.status = 'scheduled'
    """)
    boolean existsScheduledConflict(
            @Param("interviewerId") Long interviewerId,
            @Param("startAt") LocalDateTime startAt
    );
}
