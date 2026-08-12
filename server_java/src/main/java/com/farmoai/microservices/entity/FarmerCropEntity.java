package com.farmoai.microservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmer_crops")
@Data
public class FarmerCropEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "farmer_id", nullable = false, length = 36)
    private String farmerId;

    @Column(nullable = false)
    private String name;

    private String variety;

    private Double area = 1.0;

    private Integer health = 90;

    private String stage = "Planning";

    @Column(name = "next_action", columnDefinition = "TEXT")
    private String nextAction;

    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
