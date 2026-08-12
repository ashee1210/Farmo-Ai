package com.farmoai.microservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmers")
@Data
public class FarmerEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String crop = "Paddy (Jyothi)";

    private Double acres = 1.0;

    @Column(name = "soil_type")
    private String soilType = "Alluvial";

    private String status = "active";

    @Column(name = "join_date")
    private LocalDate joinDate;

    private String phone;

    @Column(name = "disease_scans")
    private Integer diseaseScans = 0;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
