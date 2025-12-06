package com.interviewscheduler.repository;

import com.interviewscheduler.model.Slot;
import com.interviewscheduler.model.Interviewer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SlotRepository extends JpaRepository<Slot, Long> {

    // ====== Core Fetch Methods ======
    List<Slot> findByBookedFalseOrderByStartAtAsc();

    List<Slot> findByInterviewerAndBookedFalseAndStartAtAfterOrderByStartAtAsc(
            Interviewer interviewer,
            LocalDateTime after
    );

    Optional<Slot> findByInterviewerAndStartAt(
            Interviewer interviewer,
            LocalDateTime startAt
    );

    @Query("""
           SELECT s FROM Slot s
           WHERE s.interviewer.id = :interviewerId
             AND s.booked = FALSE
             AND s.startAt >= :from
             AND s.startAt < :to
           ORDER BY s.startAt
           """)
    List<Slot> findAvailableInRange(
            @Param("interviewerId") Long interviewerId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("""
           SELECT s FROM Slot s
           WHERE s.interviewer.id = :interviewerId
             AND s.startAt >= :from
           ORDER BY s.startAt
           """)
    List<Slot> findFutureByInterviewer(
            @Param("interviewerId") Long interviewerId,
            @Param("from") LocalDateTime from
    );

    // Weekly Pagination with filtering
    Page<Slot> findByBookedFalseAndStartAtBetweenOrderByStartAtAsc(
            LocalDateTime start,
            LocalDateTime end,
            Pageable pageable
    );


    // ====== Lock for Booking Collision Prevention ======
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Slot s WHERE s.id = :id")
    Optional<Slot> findByIdWithLock(@Param("id") Long id);


    // ====== Dashboard Statistics ======
    long countByBookedFalseAndStartAtAfter(LocalDateTime now);
}
