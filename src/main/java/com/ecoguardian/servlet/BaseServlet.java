package com.ecoguardian.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.PrintWriter;

public abstract class BaseServlet extends HttpServlet {
    protected static final Logger logger = LoggerFactory.getLogger(BaseServlet.class);
    protected final ObjectMapper objectMapper = new ObjectMapper();
    
    protected void sendJsonResponse(HttpServletResponse response, Object data) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        try (PrintWriter out = response.getWriter()) {
            String json = objectMapper.writeValueAsString(data);
            out.write(json);
        }
    }
    
    protected void sendError(HttpServletResponse response, int statusCode, String message) throws IOException {
        response.setStatus(statusCode);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        
        try (PrintWriter out = response.getWriter()) {
            String errorJson = String.format("{\"message\":\"%s\"}", message);
            out.write(errorJson);
        }
    }
    
    protected String getInitParameter(String name, String defaultValue) {
        String value = getServletContext().getInitParameter(name);
        return value != null ? value : defaultValue;
    }
}