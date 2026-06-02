package com.example.journalApp.service;

import com.example.journalApp.entity.User;
import com.example.journalApp.repository.UserRepository;
import com.example.journalApp.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    private static final java.util.List<String> USER_ONLY_ROLE = java.util.List.of("ROLE_USER");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public User register(String name, String email, String password) throws Exception {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new Exception("Email already registered");
        }

        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRoles(USER_ONLY_ROLE);

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

        User loggedInUser = user.get();
        String userId = loggedInUser.getId().toString();

        // Enforce single-role model across existing users as well.
        if (loggedInUser.getRoles() == null || !loggedInUser.getRoles().equals(USER_ONLY_ROLE)) {
            loggedInUser.setRoles(USER_ONLY_ROLE);
            userRepository.save(loggedInUser);
        }

        return jwtTokenProvider.generateToken(userId, USER_ONLY_ROLE);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
