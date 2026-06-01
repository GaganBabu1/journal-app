package com.example.journalApp.dto;

import java.time.LocalDateTime;
import java.util.List;

public class UserResponse {
    private String id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private List<String> roles;

    public UserResponse() {}

    public UserResponse(String id, String name, String email, LocalDateTime createdAt, List<String> roles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
        this.roles = roles;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
}
