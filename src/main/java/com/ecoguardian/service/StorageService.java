package com.ecoguardian.service;

import com.ecoguardian.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class StorageService {
    private static final Logger logger = LoggerFactory.getLogger(StorageService.class);
    private static StorageService instance;
    
    // In-memory storage
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final Map<String, Action> actions = new ConcurrentHashMap<>();
    private final List<NewsItem> newsItems = new ArrayList<>();
    private final List<RecyclingCenter> recyclingCenters = new ArrayList<>();
    private final AtomicInteger actionIdCounter = new AtomicInteger(1);
    
    private StorageService() {
        initializeDefaultData();
    }
    
    public static synchronized StorageService getInstance() {
        if (instance == null) {
            instance = new StorageService();
        }
        return instance;
    }
    
    private void initializeDefaultData() {
        // Create default user
        User defaultUser = new User("default-user", "eco_user", 250, "Eco Starter");
        defaultUser.addAchievement("First Analysis");
        defaultUser.addAchievement("Eco Starter");
        defaultUser.setTotalCO2Saved(125);
        defaultUser.setMonthlyProgress(125);
        users.put(defaultUser.getId(), defaultUser);
        
        // Initialize news items
        newsItems.add(new NewsItem("1", "Global Renewable Energy Adoption Reaches Record High",
            "Renewable energy sources now account for 30% of global electricity generation, with solar and wind leading the transition.",
            "Renewable Energy", LocalDateTime.now().minusDays(1), "GreenTech Daily", "#"));
        
        newsItems.add(new NewsItem("2", "Major Corporations Commit to Zero Waste by 2030",
            "Over 100 Fortune 500 companies have pledged to eliminate waste sent to landfills within the next decade.",
            "Waste Reduction", LocalDateTime.now().minusDays(2), "Sustainability Report", "#"));
        
        newsItems.add(new NewsItem("3", "New Biodegradable Plastic Alternative Made from Seaweed",
            "Scientists develop revolutionary packaging material that dissolves in water and is completely compostable.",
            "Innovation", LocalDateTime.now().minusDays(3), "Eco Innovation Hub", "#"));
        
        newsItems.add(new NewsItem("4", "Urban Composting Programs Reduce City Waste by 40%",
            "Cities implementing community composting see dramatic reduction in organic waste going to landfills.",
            "Waste Management", LocalDateTime.now().minusDays(4), "Urban Sustainability", "#"));
        
        // Initialize recycling centers  
        recyclingCenters.add(new RecyclingCenter("1", "Green Cycle Center",
            "123 Eco Street, Green City, GC 12345", "(555) 123-4567",
            Arrays.asList("Plastic", "Glass", "Metal", "Paper"), "Mon-Sat 8AM-6PM", 2.3, 4.5));
        
        recyclingCenters.add(new RecyclingCenter("2", "EcoWaste Solutions",
            "456 Recycle Ave, Sustainable Town, ST 67890", "(555) 987-6543",
            Arrays.asList("Electronics", "Batteries", "Plastic", "Metal"), "Tue-Sun 9AM-5PM", 3.7, 4.2));
        
        recyclingCenters.add(new RecyclingCenter("3", "Community Recycling Hub",
            "789 Green Way, Eco Village, EV 13579", "(555) 456-7890",
            Arrays.asList("Textiles", "Paper", "Cardboard", "Glass"), "Mon-Fri 7AM-7PM", 1.8, 4.8));
    }
    
    // User operations
    public User getUser(String userId) {
        return users.get(userId);
    }
    
    public User saveUser(User user) {
        users.put(user.getId(), user);
        return user;
    }
    
    public User getDefaultUser() {
        return users.get("default-user");
    }
    
    // Action operations
    public List<Action> getUserActions(String userId) {
        return actions.values().stream()
            .filter(action -> userId.equals(action.getUserId()))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .toList();
    }
    
    public Action saveAction(Action action) {
        if (action.getId() == null) {
            action.setId(String.valueOf(actionIdCounter.getAndIncrement()));
        }
        if (action.getCreatedAt() == null) {
            action.setCreatedAt(LocalDateTime.now());
        }
        actions.put(action.getId(), action);
        return action;
    }
    
    // News operations
    public List<NewsItem> getNewsItems() {
        return new ArrayList<>(newsItems);
    }
    
    // Recycling center operations
    public List<RecyclingCenter> getRecyclingCenters() {
        return new ArrayList<>(recyclingCenters);
    }
    
    // Helper method to update user with action
    public void processUserAction(String userId, String itemName, String alternativeChosen, 
                                 int pointsEarned, int co2Saved) {
        User user = getUser(userId);
        if (user != null) {
            user.addEcoPoints(pointsEarned);
            user.addCO2Savings(co2Saved);
            
            // Check for achievements
            if (user.getEcoPoints() >= 500 && !user.getAchievements().contains("Eco Champion")) {
                user.addAchievement("Eco Champion");
            }
            if (user.getEcoPoints() >= 1000 && !user.getAchievements().contains("Eco Warrior")) {
                user.addAchievement("Eco Warrior");
            }
            if (user.getTotalCO2Saved() >= 500 && !user.getAchievements().contains("CO2 Saver")) {
                user.addAchievement("CO2 Saver");
            }
            
            saveUser(user);
            
            // Save action
            Action action = new Action();
            action.setUserId(userId);
            action.setItemName(itemName);
            action.setAlternativeChosen(alternativeChosen);
            action.setPointsEarned(pointsEarned);
            action.setCo2Saved(co2Saved);
            saveAction(action);
        }
    }
}