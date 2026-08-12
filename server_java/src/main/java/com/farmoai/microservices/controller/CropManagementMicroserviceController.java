package com.farmoai.microservices.controller;

import com.farmoai.microservices.entity.FarmerCropEntity;
import com.farmoai.microservices.entity.UserEntity;
import com.farmoai.microservices.repository.FarmerCropRepository;
import com.farmoai.microservices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class CropManagementMicroserviceController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerCropRepository cropRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam(required = false) String email) {
        Map<String, Object> res = new HashMap<>();
        Optional<UserEntity> uOpt;

        if (email != null && !email.trim().isEmpty()) {
            uOpt = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase());
        } else {
            List<UserEntity> users = userRepository.findAll();
            uOpt = users.stream().findFirst();
        }

        if (uOpt.isPresent()) {
            UserEntity u = uOpt.get();
            Map<String, Object> profileData = new HashMap<>();
            profileData.put("id", u.getId());
            profileData.put("full_name", u.getFullName());
            profileData.put("email", u.getEmail());
            profileData.put("phone", u.getPhone() != null ? u.getPhone() : "+91 94470 12345");
            profileData.put("district", u.getDistrict() != null ? u.getDistrict() : "Idukki");
            profileData.put("crop", "Paddy (Jyothi)");
            profileData.put("acres", 4.5);
            profileData.put("state", "Kerala");

            res.put("success", true);
            res.put("data", profileData);
            return ResponseEntity.ok(res);
        }

        res.put("success", false);
        res.put("error", "User profile not found");
        return ResponseEntity.status(404).body(res);
    }

    @GetMapping("/crops")
    public ResponseEntity<?> getUserCrops(@RequestParam(required = false) String email) {
        Map<String, Object> res = new HashMap<>();
        if (email == null || email.trim().isEmpty()) {
            res.put("success", true);
            res.put("data", Collections.emptyList());
            return ResponseEntity.ok(res);
        }

        Optional<UserEntity> uOpt = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase());
        if (uOpt.isPresent()) {
            List<FarmerCropEntity> crops = cropRepository.findByFarmerIdOrderByCreatedAtDesc(uOpt.get().getId());
            res.put("success", true);
            res.put("data", crops);
            return ResponseEntity.ok(res);
        }

        res.put("success", true);
        res.put("data", Collections.emptyList());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/crops")
    public ResponseEntity<?> addCrop(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String name = (String) payload.get("name");
        String variety = (String) payload.getOrDefault("variety", "Hybrid / Standard Variety");
        Double area = payload.get("area") != null ? Double.parseDouble(payload.get("area").toString()) : 1.0;
        Integer health = payload.get("health") != null ? Integer.parseInt(payload.get("health").toString()) : 90;
        String stage = (String) payload.getOrDefault("stage", "Planning");
        String nextAction = (String) payload.getOrDefault("next_action", "Regular crop monitoring");

        Map<String, Object> res = new HashMap<>();
        if (name == null || email == null) {
            res.put("success", false);
            res.put("error", "Crop name and user email are required.");
            return ResponseEntity.badRequest().body(res);
        }

        Optional<UserEntity> uOpt = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase());
        if (!uOpt.isPresent()) {
            res.put("success", false);
            res.put("error", "Target user account not found.");
            return ResponseEntity.badRequest().body(res);
        }

        FarmerCropEntity crop = new FarmerCropEntity();
        crop.setId("add_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 4));
        crop.setFarmerId(uOpt.get().getId());
        crop.setName(name.trim());
        crop.setVariety(variety);
        crop.setArea(area);
        crop.setHealth(health);
        crop.setStage(stage);
        crop.setNextAction(nextAction);

        cropRepository.save(crop);

        res.put("success", true);
        res.put("message", "Product / Land portion added successfully via Java Microservice");
        res.put("data", crop);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/crops/{id}")
    public ResponseEntity<?> deleteCrop(@PathVariable String id) {
        cropRepository.deleteById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Crop deleted successfully via Java Microservice");
        return ResponseEntity.ok(res);
    }
}
