package com.farmoai.microservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "disease_scans")
@Data
public class DiseaseScanEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "farmer_name", nullable = false)
    private String farmerName;

    @Column(nullable = false)
    private String crop;

    @Column(name = "disease_name", nullable = false)
    private String diseaseName;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore = 95.0;

    @Column(nullable = false)
    private String district;

    private String severity = "Medium";

    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
