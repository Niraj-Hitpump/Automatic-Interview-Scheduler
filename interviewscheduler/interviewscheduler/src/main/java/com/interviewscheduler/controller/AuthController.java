package com.interviewscheduler.controller;

import com.interviewscheduler.service.InterviewerService;
import com.interviewscheduler.service.CandidateService;
import com.interviewscheduler.model.Interviewer;
import com.interviewscheduler.model.Candidate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

// ... imports

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class AuthController {

    private final InterviewerService interviewerService;
    private final CandidateService candidateService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(InterviewerService interviewerService,
                          CandidateService candidateService,
                          PasswordEncoder passwordEncoder) {
        this.interviewerService = interviewerService;
        this.candidateService = candidateService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {

        String email = req.getEmail();
        String password = req.getPassword();

        Candidate c = candidateService.findByEmail(email).orElse(null);
        Interviewer i = interviewerService.findByEmail(email).orElse(null);

        System.out.println("Login attempt for email: " + email);
        System.out.println("Candidate found: " + (c != null));
        System.out.println("Interviewer found: " + (i != null));

        // 🛡 Admin Login
        if (c != null && "admin".equalsIgnoreCase(c.getRole()) &&
                passwordEncoder.matches(password, c.getPassword())) {

            String token = UUID.randomUUID().toString();
            return ResponseEntity.ok(new AuthResponse(token,
                    new UserInfo(c.getId(), c.getEmail(), c.getName(), "admin")));
        }

        // 👤 Candidate Login
        if (c != null && "candidate".equalsIgnoreCase(c.getRole()) &&
                passwordEncoder.matches(password, c.getPassword())) {

            String token = UUID.randomUUID().toString();
            return ResponseEntity.ok(new AuthResponse(token,
                    new UserInfo(c.getId(), c.getEmail(), c.getName(), "candidate")));
        }

        // 💼 Interviewer Login
        if (i != null &&
                Boolean.TRUE.equals(i.getEnabled()) &&
                passwordEncoder.matches(password, i.getPassword())) {

            String token = UUID.randomUUID().toString();
            return ResponseEntity.ok(new AuthResponse(token,
                    new UserInfo(i.getId(), i.getEmail(), i.getName(), "employee")));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Invalid username or password"));
    }

    // ================= DTO CLASSES ==================
    public static class AuthRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private UserInfo user;
        public AuthResponse(String token, UserInfo user) {
            this.token = token;
            this.user = user;
        }
        public String getToken() { return token; }
        public UserInfo getUser() { return user; }
    }

    public static class UserInfo {
        private Long id;
        private String email;
        private String name;
        private String role;

        public UserInfo(Long id, String email, String name, String role) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.role = role;
        }

        public Long getId() { return id; }
        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getRole() { return role; }
    }

    public static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}
