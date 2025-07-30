package com.ecoguardian.model;

import java.util.List;
import java.util.ArrayList;

public class User {
    private String id;
    private String username;
    private int ecoPoints;
    private String level;
    private List<String> achievements;
    private int totalCO2Saved;
    private int monthlyGoal;
    private int monthlyProgress;
    
    public User() {
        this.achievements = new ArrayList<>();
    }
    
    public User(String id, String username, int ecoPoints, String level) {
        this.id = id;
        this.username = username;
        this.ecoPoints = ecoPoints;
        this.level = level;
        this.achievements = new ArrayList<>();
        this.totalCO2Saved = 0;
        this.monthlyGoal = 500;
        this.monthlyProgress = 0;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public int getEcoPoints() { return ecoPoints; }
    public void setEcoPoints(int ecoPoints) { this.ecoPoints = ecoPoints; }
    
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    
    public List<String> getAchievements() { return achievements; }
    public void setAchievements(List<String> achievements) { this.achievements = achievements; }
    
    public int getTotalCO2Saved() { return totalCO2Saved; }
    public void setTotalCO2Saved(int totalCO2Saved) { this.totalCO2Saved = totalCO2Saved; }
    
    public int getMonthlyGoal() { return monthlyGoal; }
    public void setMonthlyGoal(int monthlyGoal) { this.monthlyGoal = monthlyGoal; }
    
    public int getMonthlyProgress() { return monthlyProgress; }
    public void setMonthlyProgress(int monthlyProgress) { this.monthlyProgress = monthlyProgress; }
    
    // Helper methods
    public void addEcoPoints(int points) {
        this.ecoPoints += points;
        updateLevel();
    }
    
    public void addCO2Savings(int co2Saved) {
        this.totalCO2Saved += co2Saved;
        this.monthlyProgress += co2Saved;
    }
    
    public void addAchievement(String achievement) {
        if (!achievements.contains(achievement)) {
            achievements.add(achievement);
        }
    }
    
    private void updateLevel() {
        if (ecoPoints >= 1000) {
            level = "Eco Warrior";
        } else if (ecoPoints >= 500) {
            level = "Eco Champion";
        } else {
            level = "Eco Starter";
        }
    }
    
    public double getMonthlyProgressPercentage() {
        return monthlyGoal > 0 ? Math.min(100.0, (monthlyProgress * 100.0) / monthlyGoal) : 0.0;
    }
}