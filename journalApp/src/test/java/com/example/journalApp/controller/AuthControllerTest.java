package com.example.journalApp.controller;

import com.example.journalApp.entity.User;
import com.example.journalApp.service.AuthService;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

        @Mock
        private AuthService authService;

        @InjectMocks
        private AuthController authController;

        @Test
        public void register_ReturnsCreatedAndUser() throws Exception {
                User user = new User();
                user.setId(new ObjectId());
                user.setName("Test User");
                user.setEmail("test@example.com");
                user.setCreatedAt(LocalDateTime.now());
                user.setRoles(new ArrayList<>());
                user.getRoles().add("ROLE_USER");

                when(authService.register(anyString(), anyString(), anyString())).thenReturn(user);

                com.example.journalApp.dto.RegisterRequest req = new com.example.journalApp.dto.RegisterRequest();
                req.setName("Test User");
                req.setEmail("test@example.com");
                req.setPassword("Pass1234");

                var respEntity = authController.register(req);
                assertThat(respEntity.getStatusCode().value()).isEqualTo(201);
                var body = respEntity.getBody();
                assertThat(body).isNotNull();
        }

        @Test
        public void login_ReturnsTokenAndUser() throws Exception {
                User user = new User();
                user.setId(new ObjectId());
                user.setName("Test User");
                user.setEmail("test@example.com");
                user.setCreatedAt(LocalDateTime.now());
                user.setRoles(new ArrayList<>());
                user.getRoles().add("ROLE_USER");

                when(authService.login(anyString(), anyString())).thenReturn("mock-token");
                when(authService.getUserByEmail(anyString())).thenReturn(java.util.Optional.of(user));

                com.example.journalApp.dto.LoginRequest req = new com.example.journalApp.dto.LoginRequest();
                req.setEmail("test@example.com");
                req.setPassword("Pass1234");

                var respEntity = authController.login(req);
                assertThat(respEntity.getStatusCode().value()).isEqualTo(200);
                var body = respEntity.getBody();
                assertThat(body).isNotNull();
        }
}
