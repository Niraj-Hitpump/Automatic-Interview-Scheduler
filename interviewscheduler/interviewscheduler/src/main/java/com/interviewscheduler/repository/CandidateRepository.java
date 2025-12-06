package com.interviewscheduler.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.interviewscheduler.model.Candidate;

import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByEmail(String email);
}