package com.interviewscheduler.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "availability")
public class Availability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer dayOfWeek; // 1=Monday .. 7=Sunday

    private String startTime; // "09:00"
    private String endTime;   // "17:00"

    @ManyToOne
    @JoinColumn(name = "interviewer_id")
    private Interviewer interviewer;

    // getters / setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public Interviewer getInterviewer() { return interviewer; }
    public void setInterviewer(Interviewer interviewer) { this.interviewer = interviewer; }
}
