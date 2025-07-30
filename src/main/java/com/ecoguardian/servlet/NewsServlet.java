package com.ecoguardian.servlet;

import com.ecoguardian.model.NewsItem;
import com.ecoguardian.service.StorageService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/news")
public class NewsServlet extends BaseServlet {
    
    private StorageService storageService;
    
    @Override
    public void init() throws ServletException {
        super.init();
        this.storageService = StorageService.getInstance();
        logger.info("NewsServlet initialized");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            List<NewsItem> newsItems = storageService.getNewsItems();
            sendJsonResponse(response, newsItems);
            
        } catch (Exception e) {
            logger.error("Error retrieving news items", e);
            sendError(response, 500, "Failed to retrieve news items");
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