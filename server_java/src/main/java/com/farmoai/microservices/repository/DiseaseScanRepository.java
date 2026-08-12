package com.farmoai.microservices.repository;

import com.farmoai.microservices.entity.DiseaseScanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiseaseScanRepository extends JpaRepository<DiseaseScanEntity, String> {
}
