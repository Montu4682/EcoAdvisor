package com.ecoguardian.controller;

import com.ecoguardian.dto.AnalysisResult;
import com.ecoguardian.entity.Action;
import com.ecoguardian.entity.User;
import com.ecoguardian.service.AIAnalysisService;
import com.ecoguardian.service.DataService;
import com.ecoguardian.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {
    
    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AIAnalysisService aiAnalysisService;
    
    @Autowired
    private DataService dataService;
    
    @GetMapping("/user")
    public ResponseEntity<User> getUser() {
        User user = userService.getOrCreateDefaultUser();
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/actions")
    public ResponseEntity<List<Action>> getUserActions() {
        User user = userService.getOrCreateDefaultUser();
        List<Action> actions = userService.getUserActions(user);
        return ResponseEntity.ok(actions);
    }
    
    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeImage(@RequestParam("image") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "No image file provided"));
            }
            
            // Validate file size (5MB limit)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.status(413)
                    .body(Map.of("message", "Image size must be less than 5MB"));
            }
            
            // Validate content type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please select a valid image file"));
            }
            
            logger.info("Analyzing image: {} ({})", file.getOriginalFilename(), file.getSize());
            
            // Convert to byte array and analyze
            byte[] imageBytes = file.getBytes();
            AnalysisResult analysisResult = aiAnalysisService.analyzeImage(imageBytes);
            
            // Process user action
            User user = userService.getOrCreateDefaultUser();
            String alternativeChosen = analysisResult.getAlternatives().isEmpty() 
                ? "N/A" 
                : analysisResult.getAlternatives().get(0).getName();
                
            userService.processUserAction(
                user,
                analysisResult.getAnalysis().getItemName(),
                alternativeChosen,
                analysisResult.getRecommendedPoints(),
                analysisResult.getTotalCO2Savings()
            );
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("analysis", analysisResult);
            response.put("item", Map.of(
                "id", System.currentTimeMillis(),
                "name", analysisResult.getAnalysis().getItemName(),
                "image", "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageBytes)
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error analyzing image", e);
            
            String errorMessage = "Failed to analyze image. Please try again.";
            int statusCode = 500;
            
            if (e.getMessage() != null) {
                if (e.getMessage().contains("quota") || e.getMessage().contains("rate limit")) {
                    errorMessage = "OpenAI API quota exceeded. Using demo data for analysis.";
                    statusCode = 429;
                } else if (e.getMessage().contains("entity too large")) {
                    errorMessage = "The image file is too large. Please choose a smaller image (under 5MB).";
                    statusCode = 413;
                }
            }
            
            return ResponseEntity.status(statusCode)
                .body(Map.of("message", errorMessage));
        }
    }
    
    @GetMapping("/news")
    public ResponseEntity<?> getNews() {
        try {
            return ResponseEntity.ok(dataService.getNewsItems());
        } catch (Exception e) {
            logger.error("Error retrieving news", e);
            return ResponseEntity.status(500)
                .body(Map.of("message", "Failed to load news"));
        }
    }
    
    @GetMapping("/recycling-centers")
    public ResponseEntity<?> getRecyclingCenters(
            @RequestParam(value = "lat", required = false) Double latitude,
            @RequestParam(value = "lng", required = false) Double longitude) {
        try {
            if (latitude != null && longitude != null) {
                return ResponseEntity.ok(dataService.getRecyclingCentersByLocation(latitude, longitude));
            } else {
                return ResponseEntity.ok(dataService.getRecyclingCenters());
            }
        } catch (Exception e) {
            logger.error("Error retrieving recycling centers", e);
            return ResponseEntity.status(500)
                .body(Map.of("message", "Failed to load recycling centers"));
        }
    }
}