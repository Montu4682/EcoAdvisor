package com.ecoguardian.servlet;

import com.ecoguardian.model.AnalysisResult;
import com.ecoguardian.service.OpenAIService;
import com.ecoguardian.service.StorageService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import org.apache.commons.codec.binary.Base64;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/analyze")
@MultipartConfig(maxFileSize = 52428800, maxRequestSize = 52428800, fileSizeThreshold = 1048576)
public class AIAnalysisServlet extends BaseServlet {
    
    private OpenAIService openAIService;
    private StorageService storageService;
    
    @Override
    public void init() throws ServletException {
        super.init();
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = getInitParameter("openai.api.key", "");
        }
        
        this.openAIService = new OpenAIService(apiKey);
        this.storageService = StorageService.getInstance();
        
        logger.info("AIAnalysisServlet initialized");
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            // Handle multipart form data
            Part filePart = request.getPart("image");
            if (filePart == null) {
                sendError(response, 400, "No image file provided");
                return;
            }
            
            // Validate file size (5MB limit)
            if (filePart.getSize() > 5 * 1024 * 1024) {
                sendError(response, 413, "Image size must be less than 5MB");
                return;
            }
            
            // Validate content type
            String contentType = filePart.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                sendError(response, 400, "Please select a valid image file");
                return;
            }
            
            // Convert image to base64
            String base64Image;
            try (InputStream inputStream = filePart.getInputStream()) {
                byte[] imageBytes = inputStream.readAllBytes();
                base64Image = Base64.encodeBase64String(imageBytes);
            }
            
            // Analyze image with OpenAI
            AnalysisResult analysisResult = openAIService.analyzeImage(base64Image);
            
            // Process user action and update points
            String userId = "default-user"; // In a real app, get from session
            storageService.processUserAction(
                userId,
                analysisResult.getAnalysis().getItemName(),
                analysisResult.getAlternatives().isEmpty() ? "N/A" : analysisResult.getAlternatives().get(0).getName(),
                analysisResult.getRecommendedPoints(),
                analysisResult.getTotalCO2Savings()
            );
            
            // Prepare response
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("analysis", analysisResult);
            responseData.put("item", Map.of(
                "id", System.currentTimeMillis(),
                "name", analysisResult.getAnalysis().getItemName(),
                "image", "data:image/jpeg;base64," + base64Image
            ));
            
            sendJsonResponse(response, responseData);
            
        } catch (Exception e) {
            logger.error("Error analyzing image", e);
            
            String errorMessage = "Failed to analyze image. Please try again.";
            int statusCode = 500;
            
            if (e.getMessage() != null) {
                if (e.getMessage().contains("quota")) {
                    errorMessage = "OpenAI API quota exceeded. Please check your billing settings and try again later.";
                    statusCode = 429;
                } else if (e.getMessage().contains("entity too large")) {
                    errorMessage = "The image file is too large. Please choose a smaller image (under 5MB).";
                    statusCode = 413;
                }
            }
            
            sendError(response, statusCode, errorMessage);
        }
    }
    
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}