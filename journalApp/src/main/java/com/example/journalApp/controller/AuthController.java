package com.example.journalApp.controller;

import com.example.journalApp.entity.User;
import com.example.journalApp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");

            if (name == null || email == null || password == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Name, email, and password are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            User user = authService.register(name, email, password);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user", Map.of(
                    "id", user.getId().toString(),
                    "name", user.getName(),
                    "email", user.getEmail()
            ));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            if (email == null || password == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email and password are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            String token = authService.login(email, password);
            User user = authService.getUserByEmail(email).get();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            response.put("user", Map.of(
                    "id", user.getId().toString(),
                    "name", user.getName(),
                    "email", user.getEmail()
            ));

            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}
