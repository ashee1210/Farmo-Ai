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
        if (name == null || email == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Name and email are required");
            return ResponseEntity.badRequest().body(err);
        }

        String cleanEmail = email.trim().toLowerCase();

        // Reject registration of admin email
        if ("admin@gmail.com".equals(cleanEmail)) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "The email 'admin@gmail.com' is reserved for administrator access. Admin accounts cannot be created.");
            return ResponseEntity.badRequest().body(err);
        }

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
        u.setRole("farmer"); // Registration is strictly for farmers

        userRepository.save(u);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Farmer registered successfully");
        res.put("token", "jwt_" + u.getId());
        res.put("user", u);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String q = payload.get("email");
        String password = payload.get("password");
        String role = payload.get("role");

        if (q == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Email or User ID required");
            return ResponseEntity.badRequest().body(err);
        }

        String cleanQ = q.trim().toLowerCase();

        // Reject non-admin email if attempting admin role login
        if ("admin".equalsIgnoreCase(role) && !"admin@gmail.com".equals(cleanQ)) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Access Denied: Only 'admin@gmail.com' meets the criteria for administrator login. Admin accounts cannot be created.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
        }

        // Single Master Admin login
        if ("admin@gmail.com".equals(cleanQ)) {
            if (password == null || (!password.equals("admin@1234") && !password.equals("admin@123") && !password.equals("Farmer@123"))) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("error", "Incorrect master admin password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
            }

            UserEntity adminUser = userRepository.findByEmailIgnoreCase("admin@gmail.com").orElseGet(() -> {
                UserEntity a = new UserEntity();
                a.setId("u_admin_default");
                a.setFullName("Admin Administrator");
                a.setEmail("admin@gmail.com");
                a.setPassword(password);
                a.setPhone("+91 94470 00001");
                a.setDistrict("Kerala");
                a.setRole("admin");
                return userRepository.save(a);
            });

            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("token", "jwt_admin_admin@gmail.com");
            res.put("user", adminUser);
            return ResponseEntity.ok(res);
        }

        Optional<UserEntity> userOpt = userRepository.findByEmailIgnoreCase(cleanQ);

        if (userOpt.isPresent()) {
            UserEntity u = userOpt.get();
            if (password != null && !password.equals(u.getPassword())) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("error", "Incorrect password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
            }

            u.setRole("farmer"); // Non-admin users are farmers
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
