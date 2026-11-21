package com.propval.user.dto;

import java.time.LocalDateTime;

public class UserDto {
    private String id;
    private String name;
    private String email;
    private String role;
    private String avatar;
    private String title;
    private String location;
    private String phone;
    private String status;
    private Integer valuationsConducted;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;

    public UserDto() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getValuationsConducted() { return valuationsConducted; }
    public void setValuationsConducted(Integer valuationsConducted) { this.valuationsConducted = valuationsConducted; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
