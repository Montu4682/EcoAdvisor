package com.ecoguardian.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "actions")
public class Action {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotBlank(message = "Item name is required")
    private String itemName;
    
    private String alternativeChosen;
    
    @Min(value = 0, message = "Points earned cannot be negative")
    private int pointsEarned;
    
    @Min(value = 0, message = "CO2 saved cannot be negative")
    private int co2Saved;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public Action() {}
    
    public Action(User user, String itemName, String alternativeChosen, int pointsEarned, int co2Saved) {
        this.user = user;
        this.itemName = itemName;
        this.alternativeChosen = alternativeChosen;
        this.pointsEarned = pointsEarned;
        this.co2Saved = co2Saved;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
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