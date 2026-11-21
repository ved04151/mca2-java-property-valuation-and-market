package com.propval.user.service;

import com.propval.common.ResourceNotFoundException;
import com.propval.user.dto.CreateUserRequest;
import com.propval.user.dto.UpdateUserRequest;
import com.propval.user.dto.UserDto;
import com.propval.user.entity.User;
import com.propval.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toDto(user);
    }

    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("A user with this email address already exists.");
        }

        User user = new User();
        user.setId("usr_" + System.currentTimeMillis());
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole().toUpperCase() : "USER");
        user.setTitle(request.getTitle() != null ? request.getTitle() : "Real Estate Surveyor");
        user.setLocation(request.getLocation() != null ? request.getLocation() : "Delhi NCR");
        user.setPhone(request.getPhone());
        user.setStatus("ACTIVE");
        user.setAvatar(request.getAvatar() != null ? request.getAvatar() : 
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80");
        user.setValuationsConducted(0);

        User saved = userRepository.save(user);
        return toDto(saved);
    }

    @Transactional
    public UserDto updateUser(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getTitle() != null) user.setTitle(request.getTitle());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatar() != null) user.setAvatar(request.getAvatar());
        if (request.getRole() != null) user.setRole(request.getRole().toUpperCase());
        if (request.getStatus() != null) user.setStatus(request.getStatus().toUpperCase());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updated = userRepository.save(user);
        return toDto(updated);
    }

    @Transactional
    public UserDto updateStatus(String id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setStatus(status.toUpperCase());
        return toDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setAvatar(user.getAvatar());
        dto.setTitle(user.getTitle());
        dto.setLocation(user.getLocation());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());
        dto.setValuationsConducted(user.getValuationsConducted());
        dto.setLastLogin(user.getLastLogin());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
