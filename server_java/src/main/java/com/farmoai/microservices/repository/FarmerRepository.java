package com.farmoai.microservices.repository;

import com.farmoai.microservices.entity.FarmerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FarmerRepository extends JpaRepository<FarmerEntity, String> {
}
