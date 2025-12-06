package com.interviewscheduler.repository;

import com.interviewscheduler.model.Interviewer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InterviewerRepository extends JpaRepository<Interviewer, Long> {
  Optional<Interviewer> findByEmail(String email);
}
