package com.propval.auth.controller;

import com.propval.auth.dto.ChangePasswordRequest;
import com.propval.auth.dto.LoginRequest;
import com.propval.auth.dto.LoginResponse;
import com.propval.auth.dto.RegisterRequest;
import com.propval.common.ApiResponse;
import com.propval.common.ResourceNotFoundException;
import com.propval.security.JwtTokenProvider;
import com.propval.user.dto.UpdateUserRequest;
import com.propval.user.dto.UserDto;
import com.propval.user.entity.User;
import com.propval.user.repository.UserRepository;
import com.propval.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserRepository userRepository,
                          UserService userService,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if ("SUSPENDED".equalsIgnoreCase(user.getStatus())) {
            throw new BadCredentialsException("Your account has been suspended by an Administrator.");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String jwt = tokenProvider.generateToken(user.getEmail(), user.getRole(), user.getId());
        UserDto userDto = userService.toDto(user);

        return ResponseEntity.ok(new LoginResponse(jwt, userDto));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("A user with this email address already exists.");
        }

        User user = new User();
        user.setId("usr_" + System.currentTimeMillis());
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // Always strictly enforce USER role for public registrations
        user.setRole("USER");
        user.setStatus("ACTIVE");
        user.setPhone(request.getPhone() != null && !request.getPhone().isBlank() ? request.getPhone().trim() : null);
        user.setTitle("Valuation Professional");
        user.setLocation("NCR Region");
        user.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80");
        user.setValuationsConducted(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        UserDto userDto = userService.toDto(savedUser);

        return ResponseEntity.ok(ApiResponse.ok("User registered successfully", userDto));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new BadCredentialsException("Not authenticated");
        }
        User user = userRepository.findByEmailIgnoreCase(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(userService.toDto(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestBody UpdateUserRequest request) {
        if (userDetails == null) {
            throw new BadCredentialsException("Not authenticated");
        }
        User user = userRepository.findByEmailIgnoreCase(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Regular user cannot change own role or status via profile
        request.setRole(null);
        request.setStatus(null);

        UserDto updated = userService.updateUser(user.getId(), request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                                              @Valid @RequestBody ChangePasswordRequest request) {
        if (userDetails == null) {
            throw new BadCredentialsException("Not authenticated");
        }
        User user = userRepository.findByEmailIgnoreCase(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getCurrentPassword() != null && !request.getCurrentPassword().isBlank()) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BadCredentialsException("Current password does not match.");
            }
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.ok("Password updated successfully"));
    }
}
