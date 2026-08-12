package com.farmoai.microservices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class FarmoAiMicroservicesApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmoAiMicroservicesApplication.class, args);
        System.out.println("🚀 FARMO AI JAVA SPRING BOOT MICROSERVICES SUITE RUNNING ON HTTP://LOCALHOST:8080");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }
}
