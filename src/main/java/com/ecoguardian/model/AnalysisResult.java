package com.ecoguardian.model;

import java.util.List;
import java.util.ArrayList;

public class AnalysisResult {
    private Analysis analysis;
    private List<Alternative> alternatives;
    private int totalCO2Savings;
    private int recommendedPoints;
    
    public AnalysisResult() {
        this.alternatives = new ArrayList<>();
    }
    
    // Getters and Setters
    public Analysis getAnalysis() { return analysis; }
    public void setAnalysis(Analysis analysis) { this.analysis = analysis; }
    
    public List<Alternative> getAlternatives() { return alternatives; }
    public void setAlternatives(List<Alternative> alternatives) { this.alternatives = alternatives; }
    
    public int getTotalCO2Savings() { return totalCO2Savings; }
    public void setTotalCO2Savings(int totalCO2Savings) { this.totalCO2Savings = totalCO2Savings; }
    
    public int getRecommendedPoints() { return recommendedPoints; }
    public void setRecommendedPoints(int recommendedPoints) { this.recommendedPoints = recommendedPoints; }
    
    public static class Analysis {
        private String itemName;
        private String itemType;
        private String environmentalImpact;
        private String wasteCategory;
        private double confidence;
        
        public Analysis() {}
        
        public Analysis(String itemName, String itemType, String environmentalImpact, 
                       String wasteCategory, double confidence) {
            this.itemName = itemName;
            this.itemType = itemType;
            this.environmentalImpact = environmentalImpact;
            this.wasteCategory = wasteCategory;
            this.confidence = confidence;
        }
        
        // Getters and Setters
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        
        public String getItemType() { return itemType; }
        public void setItemType(String itemType) { this.itemType = itemType; }
        
        public String getEnvironmentalImpact() { return environmentalImpact; }
        public void setEnvironmentalImpact(String environmentalImpact) { this.environmentalImpact = environmentalImpact; }
        
        public String getWasteCategory() { return wasteCategory; }
        public void setWasteCategory(String wasteCategory) { this.wasteCategory = wasteCategory; }
        
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
    }
    
    public static class Alternative {
        private String name;
        private String description;
        private int co2Savings;
        private int pointsValue;
        private String availability;
        
        public Alternative() {}
        
        public Alternative(String name, String description, int co2Savings, 
                          int pointsValue, String availability) {
            this.name = name;
            this.description = description;
            this.co2Savings = co2Savings;
            this.pointsValue = pointsValue;
            this.availability = availability;
        }
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public int getCo2Savings() { return co2Savings; }
        public void setCo2Savings(int co2Savings) { this.co2Savings = co2Savings; }
        
        public int getPointsValue() { return pointsValue; }
        public void setPointsValue(int pointsValue) { this.pointsValue = pointsValue; }
        
        public String getAvailability() { return availability; }
        public void setAvailability(String availability) { this.availability = availability; }
    }
}