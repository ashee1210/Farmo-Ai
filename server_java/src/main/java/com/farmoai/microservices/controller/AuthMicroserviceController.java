package com.farmoai.microservices.controller;

import com.farmoai.microservices.entity.UserEntity;
import com.farmoai.microservices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthMicroserviceController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String password = payload.getOrDefault("password", "Farmer@123");
        String phone = payload.getOrDefault("phone", "");
        String district = payload.getOrDefault("district", "Idukki");
        String role = payload.getOrDefault("role", "farmer");

        if (name == null || email == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Name and email are required");
            return ResponseEntity.badRequest().body(err);
        }

        String cleanEmail = email.trim().toLowerCase();
        Optional<UserEntity> existing = userRepository.findByEmailIgnoreCase(cleanEmail);
        if (existing.isPresent()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Email is already registered.");
            return ResponseEntity.badRequest().body(err);
        }

        UserEntity u = new UserEntity();
        u.setId("u_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 4));
        u.setFullName(name.trim());
        u.setEmail(cleanEmail);
        u.setPassword(password);
        u.setPhone(phone);
        u.setDistrict(district);
        u.setRole(role.toLowerCase());

        userRepository.save(u);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "User registered successfully in Java Spring Boot Microservice");
        res.put("token", "jwt_" + u.getId());
        res.put("user", u);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String q = payload.get("email");
        String password = payload.get("password");

        if (q == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Email or User ID required");
            return ResponseEntity.badRequest().body(err);
        }

        String cleanQ = q.trim().toLowerCase();
        Optional<UserEntity> userOpt = userRepository.findByEmailIgnoreCase(cleanQ);

        if (userOpt.isPresent()) {
            UserEntity u = userOpt.get();
            if (password != null && !password.equals(u.getPassword())) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("error", "Incorrect password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
            }

            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("token", "jwt_" + u.getId());
            res.put("user", u);
            return ResponseEntity.ok(res);
        }

        Map<String, Object> err = new HashMap<>();
        err.put("success", false);
        err.put("error", "No account found with provided credentials.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
    }
}
