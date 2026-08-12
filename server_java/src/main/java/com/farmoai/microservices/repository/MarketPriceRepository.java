package com.farmoai.microservices.repository;

import com.farmoai.microservices.entity.MarketPriceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketPriceRepository extends JpaRepository<MarketPriceEntity, String> {
}
