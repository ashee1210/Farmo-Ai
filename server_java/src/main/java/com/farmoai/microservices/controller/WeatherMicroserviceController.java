package com.farmoai.microservices.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherMicroserviceController {

    @GetMapping
    public ResponseEntity<?> getWeather(@RequestParam(required = false, defaultValue = "Palakkad") String district) {
        int hour = LocalTime.now().getHour();
        int temp = 30;
        String condition = "Sunny";
        String icon = "☀️";
        int humidity = 65;
        int rainChance = 20;

        if (hour >= 6 && hour < 12) {
            temp = 27;
            condition = "Pleasant Morning";
            icon = "🌅";
            humidity = 70;
            rainChance = 15;
        } else if (hour >= 12 && hour < 17) {
            temp = 32;
            condition = "Warm Afternoon Sunny";
            icon = "☀️";
            humidity = 58;
            rainChance = 25;
        } else if (hour >= 17 && hour < 21) {
            temp = 28;
            condition = "Cool Evening Breeze";
            icon = "🌤️";
            humidity = 75;
            rainChance = 40;
        } else {
            temp = 24;
            condition = "Clear Night Cool";
            icon = "🌙";
            humidity = 82;
            rainChance = 10;
        }

        Map<String, Object> weatherData = new HashMap<>();
        weatherData.put("district", district);
        weatherData.put("temp", temp + "°C");
        weatherData.put("tempNum", temp);
        weatherData.put("condition", condition);
        weatherData.put("icon", icon);
        weatherData.put("humidity", humidity + "%");
        weatherData.put("rainChance", rainChance + "%");
        weatherData.put("forecast", district + " " + condition + " (" + temp + "°C)");
        weatherData.put("timeLabel", LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a")));
        weatherData.put("lastUpdated", LocalDateTime.now().toString());

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", weatherData);
        return ResponseEntity.ok(res);
    }
}
