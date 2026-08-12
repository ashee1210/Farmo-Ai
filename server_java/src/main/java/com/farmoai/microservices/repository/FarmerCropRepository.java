package com.farmoai.microservices.repository;

import com.farmoai.microservices.entity.FarmerCropEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FarmerCropRepository extends JpaRepository<FarmerCropEntity, String> {
    List<FarmerCropEntity> findByFarmerIdOrderByCreatedAtDesc(String farmerId);
}
