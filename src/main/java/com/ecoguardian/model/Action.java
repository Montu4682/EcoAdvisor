package com.ecoguardian.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Action {
    private String id;
    private String userId;
    private String itemName;
    private String alternativeChosen;
    private int pointsEarned;
    private int co2Saved;
    private LocalDateTime createdAt;
    
    public Action() {}
    
    public Action(String id, String userId, String itemName, String alternativeChosen, 
                 int pointsEarned, int co2Saved, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.itemName = itemName;
        this.alternativeChosen = alternativeChosen;
        this.pointsEarned = pointsEarned;
        this.co2Saved = co2Saved;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    
    public String getAlternativeChosen() { return alternativeChosen; }
    public void setAlternativeChosen(String alternativeChosen) { this.alternativeChosen = alternativeChosen; }
    
    public int getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(int pointsEarned) { this.pointsEarned = pointsEarned; }
    
    public int getCo2Saved() { return co2Saved; }
    public void setCo2Saved(int co2Saved) { this.co2Saved = co2Saved; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    // Helper method for formatted date
    public String getFormattedDate() {
        if (createdAt != null) {
            return createdAt.format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm"));
        }
        return "";
    }
}