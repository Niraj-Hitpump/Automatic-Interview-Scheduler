package com.interviewscheduler.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "interviewer", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email"})
})
public class Interviewer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    // FIX APPLIED: Removed unique = true
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "employee"; // default employee role

    @Column(nullable = false)
    private Boolean enabled = true; // default active

    @OneToMany(mappedBy = "interviewer", cascade = CascadeType.ALL)
    @JsonIgnore 
    private List<Booking> bookings;

    @OneToMany(mappedBy = "interviewer", cascade = CascadeType.ALL)
    @JsonIgnore // 🚀 Prevents circular JSON
    private List<Slot> slots;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
