package com.farmoai.microservices.controller;

import com.farmoai.microservices.entity.MarketPriceEntity;
import com.farmoai.microservices.repository.MarketPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/market-prices")
@CrossOrigin(origins = "*")
public class MarketPriceMicroserviceController {

    @Autowired
    private MarketPriceRepository marketPriceRepository;

    @GetMapping
    public ResponseEntity<?> getMarketPrices() {
        List<MarketPriceEntity> prices = marketPriceRepository.findAll();
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", prices);
        return ResponseEntity.ok(res);
    }
}
