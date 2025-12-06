package com.interviewscheduler.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "slot")
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime startAt;

    @Column(nullable = false)
    private LocalDateTime endAt;

    private boolean booked = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewer_id")
    @JsonIgnoreProperties({"slots", "password", "bookings"})
    private Interviewer interviewer;

    public Slot() {}

    public Slot(LocalDateTime startAt, LocalDateTime endAt, Interviewer interviewer) {
        this.startAt = startAt;
        this.endAt = endAt;
        this.interviewer = interviewer;
    }

    @JsonProperty("id")
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }

    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }

    public boolean isBooked() { return booked; }
    public void setBooked(boolean booked) { this.booked = booked; }

    public Interviewer getInterviewer() { return interviewer; }
    public void setInterviewer(Interviewer interviewer) { this.interviewer = interviewer; }
}
