package com.interviewscheduler.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startAt;
    private LocalDateTime endAt;

    private String status; // "scheduled", "completed", "cancelled"

    private String candidateName;
    private String candidateEmail;

    @ManyToOne
    @JoinColumn(name = "interviewer_id")
    @JsonIgnoreProperties({"slots", "bookings"})
    private Interviewer interviewer;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }

    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public Interviewer getInterviewer() { return interviewer; }
    public void setInterviewer(Interviewer interviewer) { this.interviewer = interviewer; }
}