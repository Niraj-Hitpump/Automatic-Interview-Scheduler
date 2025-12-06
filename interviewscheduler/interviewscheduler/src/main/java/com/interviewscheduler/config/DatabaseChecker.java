package com.interviewscheduler.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DatabaseChecker {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void checkConnection() {
        try {
            jdbcTemplate.execute("SELECT 1");
            System.out.println("🎯 PostgreSQL Database Connected Successfully!");
        } catch (Exception e) {
            System.out.println("⚠ PostgreSQL Database NOT Connected!");
            System.out.println("📌 Trying to create database...");

            try {
                jdbcTemplate.execute("CREATE DATABASE interviewdb");
                System.out.println("✨ PostgreSQL Database Created Successfully!");
            } catch (Exception ex) {
                System.out.println("❌ Failed to create database: " + ex.getMessage());
            }
        }
    }
}
