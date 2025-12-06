package com.interviewscheduler.dto;

import lombok.Data;

@Data
public class EmployeeCredentialRequest {
    private String name;
    private String email;
    private String password;
    private Boolean enabled;
}
