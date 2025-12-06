package com.interviewscheduler.service;

import org.springframework.stereotype.Service;

import com.interviewscheduler.repository.CandidateRepository;

import com.interviewscheduler.model.Candidate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {

    private final CandidateRepository repo;
    private final PasswordEncoder passwordEncoder;

    public CandidateService(CandidateRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.passwordEncoder = encoder;
    }

    public List<Candidate> findAll() {
        return repo.findAll();
    }

    public Optional<Candidate> findById(Long id) {
        return repo.findById(id);
    }

    public Optional<Candidate> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public Candidate create(Candidate c) {
        // hash password before saving
        c.setPassword(passwordEncoder.encode(c.getPassword()));

        // set role if not provided
        if (c.getRole() == null) c.setRole("candidate");

        return repo.save(c);
    }

    public Optional<Candidate> update(Long id, Candidate updates) {
        return repo.findById(id).map(c -> {

            c.setName(updates.getName());
            c.setEmail(updates.getEmail());

            if (updates.getPassword() != null && !updates.getPassword().isBlank()) {
                c.setPassword(passwordEncoder.encode(updates.getPassword()));
            }

            return repo.save(c);
        });
    }

    public boolean delete(Long id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id);
        return true;
    }
}
