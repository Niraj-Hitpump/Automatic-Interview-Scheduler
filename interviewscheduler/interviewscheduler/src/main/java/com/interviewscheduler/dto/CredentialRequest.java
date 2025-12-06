package com.interviewscheduler.dto;

import lombok.Data;

@Data
public class CredentialRequest {
    private String email;
    private String password;
}
