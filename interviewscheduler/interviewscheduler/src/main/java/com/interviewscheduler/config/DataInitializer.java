package com.interviewscheduler.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.interviewscheduler.service.CandidateService;
import com.interviewscheduler.model.Candidate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CandidateService candidateService;

    public DataInitializer(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @Override
    public void run(String... args) throws Exception {
        final String adminEmail = "admin@example.com";
        final String adminPassword = "admin@123";

        candidateService.findByEmail(adminEmail).ifPresentOrElse(
            existingAdmin -> System.out.println("Admin already exists: " + adminEmail),
            () -> {
                Candidate admin = new Candidate();
                admin.setName("Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(adminPassword);
                admin.setRole("admin");  // ✅ Set correct role here

                candidateService.create(admin);
                System.out.println("Created admin user with role ADMIN: " + adminEmail);
            }
        );
    }
}
