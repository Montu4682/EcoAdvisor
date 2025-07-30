package com.ecoguardian.servlet;

import com.ecoguardian.model.Action;
import com.ecoguardian.service.StorageService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/actions")
public class ActionsServlet extends BaseServlet {
    
    private StorageService storageService;
    
    @Override
    public void init() throws ServletException {
        super.init();
        this.storageService = StorageService.getInstance();
        logger.info("ActionsServlet initialized");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            // In a real application, get user ID from session
            String userId = "default-user";
            List<Action> actions = storageService.getUserActions(userId);
            
            sendJsonResponse(response, actions);
            
        } catch (Exception e) {
            logger.error("Error retrieving user actions", e);
            sendError(response, 500, "Failed to retrieve user actions");
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