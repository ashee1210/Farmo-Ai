package com.farmoai.microservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_prices")
@Data
public class MarketPriceEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "crop_name", nullable = false)
    private String cropName;

    @Column(nullable = false)
    private String district;

    @Column(name = "min_price")
    private Double minPrice = 0.0;

    @Column(name = "max_price")
    private Double maxPrice = 0.0;

    @Column(name = "modal_price", nullable = false)
    private Double modalPrice = 0.0;

    private String unit = "Quintal";

    private String trend = "stable";

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
