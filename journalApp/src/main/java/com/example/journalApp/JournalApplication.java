package com.example.journalApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.journalApp.repository.UserRepository;
import com.example.journalApp.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class JournalApplication {

	public static void main(String[] args) {
		SpringApplication.run(JournalApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			String adminEmail = "admin@example.com";
			if (userRepository.findByEmail(adminEmail).isEmpty()) {
				User admin = new User();
				admin.setName("Admin");
				admin.setEmail(adminEmail);
				admin.setPassword(passwordEncoder.encode("AdminPass123"));
				java.util.List<String> roles = new java.util.ArrayList<>();
				roles.add("ROLE_USER");
				roles.add("ROLE_ADMIN");
				admin.setRoles(roles);
				admin.setCreatedAt(java.time.LocalDateTime.now());
				userRepository.save(admin);
				System.out.println("Created default admin user: " + adminEmail + " with password AdminPass123");
			}
		};
	}

}
