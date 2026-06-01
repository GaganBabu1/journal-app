package com.example.journalApp.controller;

import com.example.journalApp.entity.User;
import com.example.journalApp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@jakarta.validation.Valid @RequestBody com.example.journalApp.dto.RegisterRequest request) {
        try {
            User user = authService.register(request.getName(), request.getEmail(), request.getPassword());
            com.example.journalApp.dto.UserResponse userResp = new com.example.journalApp.dto.UserResponse(
                    user.getId() != null ? user.getId().toString() : null,
                    user.getName(),
                    user.getEmail(),
                    user.getCreatedAt(),
                    user.getRoles()
            );
            com.example.journalApp.dto.AuthResponse resp = new com.example.journalApp.dto.AuthResponse(true, null, userResp);
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

        @PostMapping("/login")
        public ResponseEntity<?> login(@jakarta.validation.Valid @RequestBody com.example.journalApp.dto.LoginRequest request) {
        try {
            String token = authService.login(request.getEmail(), request.getPassword());
            User user = authService.getUserByEmail(request.getEmail()).get();
            com.example.journalApp.dto.UserResponse userResp = new com.example.journalApp.dto.UserResponse(
                    user.getId() != null ? user.getId().toString() : null,
                    user.getName(),
                    user.getEmail(),
                    user.getCreatedAt(),
                    user.getRoles()
            );
            com.example.journalApp.dto.AuthResponse resp = new com.example.journalApp.dto.AuthResponse(true, token, userResp);
            return ResponseEntity.status(HttpStatus.OK).body(resp);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @GetMapping("/admin-test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminTest() {
        return ResponseEntity.ok(Map.of("success", true, "message", "admin access granted"));
    }

    
}
