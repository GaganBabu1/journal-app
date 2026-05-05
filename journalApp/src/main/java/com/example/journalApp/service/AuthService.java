package com.example.journalApp.service;

import com.example.journalApp.entity.User;
import com.example.journalApp.repository.UserRepository;
import com.example.journalApp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(String name, String email, String password) throws Exception {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new Exception("Email already registered");
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));

        return userRepository.save(newUser);
    }

    public String login(String email, String password) throws Exception {
        Optional<User> user = userRepository.findByEmail(email);
        if (!user.isPresent()) {
            throw new Exception("User not found");
        }

        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            throw new Exception("Invalid password");
        }

        return jwtUtil.generateToken(email);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
