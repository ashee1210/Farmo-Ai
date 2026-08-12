package com.farmoai.microservices.repository;

import com.farmoai.microservices.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByEmailIgnoreCase(String email);
    Optional<UserEntity> findByEmailOrIdOrFullName(String email, String id, String fullName);
}
