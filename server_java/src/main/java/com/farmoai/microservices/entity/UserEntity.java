package com.farmoai.microservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class UserEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    private String role = "farmer";

    private String district;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
