package com.interviewscheduler.service;

import com.interviewscheduler.model.Interviewer;
import com.interviewscheduler.repository.InterviewerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterviewerService {

    private final InterviewerRepository repo;
    private final PasswordEncoder passwordEncoder;

    public InterviewerService(InterviewerRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Interviewer> findAll() {
        return repo.findAll();
    }

    public Optional<Interviewer> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public Optional<Interviewer> findById(Long id) {
        return repo.findById(id);
    }

    public Interviewer create(Interviewer i, String rawPassword) {
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("Password required");
        }
        i.setPassword(passwordEncoder.encode(rawPassword)); // ⚡ Hash password
        return repo.save(i);
    }

    public boolean checkPassword(Interviewer interviewer, String rawPassword) {
        return passwordEncoder.matches(rawPassword, interviewer.getPassword());
    }

    public Interviewer updateCredentials(Long id, String name, String email, String password, Boolean enabled) {
        return repo.findById(id).map(i -> {
            if (name != null) i.setName(name);
            if (email != null) i.setEmail(email);

            if (password != null && !password.isBlank()) {
                i.setPassword(passwordEncoder.encode(password)); // ⚡ Hash update
            }

            if (enabled != null) i.setEnabled(enabled);

            return repo.save(i);
        }).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public boolean delete(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}
