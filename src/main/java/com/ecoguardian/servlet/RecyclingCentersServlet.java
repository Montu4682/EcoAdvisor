package com.ecoguardian.servlet;

import com.ecoguardian.model.RecyclingCenter;
import com.ecoguardian.service.StorageService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/recycling-centers")
public class RecyclingCentersServlet extends BaseServlet {
    
    private StorageService storageService;
    
    @Override
    public void init() throws ServletException {
        super.init();
        this.storageService = StorageService.getInstance();
        logger.info("RecyclingCentersServlet initialized");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            List<RecyclingCenter> centers = storageService.getRecyclingCenters();
            sendJsonResponse(response, centers);
            
        } catch (Exception e) {
            logger.error("Error retrieving recycling centers", e);
            sendError(response, 500, "Failed to retrieve recycling centers");
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