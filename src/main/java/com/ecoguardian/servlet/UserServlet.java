package com.ecoguardian.servlet;

import com.ecoguardian.model.User;
import com.ecoguardian.service.StorageService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/user")
public class UserServlet extends BaseServlet {
    
    private StorageService storageService;
    
    @Override
    public void init() throws ServletException {
        super.init();
        this.storageService = StorageService.getInstance();
        logger.info("UserServlet initialized");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            // In a real application, get user ID from session
            String userId = "default-user";
            User user = storageService.getUser(userId);
            
            if (user == null) {
                sendError(response, 404, "User not found");
                return;
            }
            
            sendJsonResponse(response, user);
            
        } catch (Exception e) {
            logger.error("Error retrieving user data", e);
            sendError(response, 500, "Failed to retrieve user data");
        }
    }
    
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}