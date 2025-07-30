package com.ecoguardian.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Column(unique = true)
    private String username;
    
    @Min(value = 0, message = "EcoPoints cannot be negative")
    private int ecoPoints = 0;
    
    private String level = "Eco Starter";
    
    @ElementCollection
    @CollectionTable(name = "user_achievements", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "achievement")
    private List<String> achievements = new ArrayList<>();
    
    @Min(value = 0, message = "CO2 saved cannot be negative")
    private int totalCO2Saved = 0;
    
    @Min(value = 0, message = "Monthly goal cannot be negative")
    private int monthlyGoal = 500;
    
    @Min(value = 0, message = "Monthly progress cannot be negative")
    private int monthlyProgress = 0;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Action> actions = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    public User(String username) {
        this.username = username;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    
    public List<Action> getActions() { return actions; }
    public void setActions(List<Action> actions) { this.actions = actions; }
    
    // Business Logic Methods
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