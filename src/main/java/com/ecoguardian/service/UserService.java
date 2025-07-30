package com.ecoguardian.service;

import com.ecoguardian.entity.Action;
import com.ecoguardian.entity.User;
import com.ecoguardian.repository.ActionRepository;
import com.ecoguardian.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ActionRepository actionRepository;
    
    public User getOrCreateDefaultUser() {
        return userRepository.findByUsername("eco_user")
            .orElseGet(() -> {
                User user = new User("eco_user");
                user.setEcoPoints(250);
                user.setLevel("Eco Starter");
                user.addAchievement("First Analysis");
                user.addAchievement("Eco Starter");
                user.setTotalCO2Saved(125);
                user.setMonthlyProgress(125);
                
                User saved = userRepository.save(user);
                logger.info("Created default user with ID: {}", saved.getId());
                return saved;
            });
    }
    
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public List<Action> getUserActions(User user) {
        return actionRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public Action saveAction(Action action) {
        return actionRepository.save(action);
    }
    
    public void processUserAction(User user, String itemName, String alternativeChosen, 
                                 int pointsEarned, int co2Saved) {
        
        logger.debug("Processing action for user {}: item={}, points={}, co2={}", 
                    user.getUsername(), itemName, pointsEarned, co2Saved);
        
        // Update user statistics
        user.addEcoPoints(pointsEarned);
        user.addCO2Savings(co2Saved);
        
        // Check for achievements
        checkAndAwardAchievements(user);
        
        // Save user
        userRepository.save(user);
        
        // Save action
        Action action = new Action(user, itemName, alternativeChosen, pointsEarned, co2Saved);
        actionRepository.save(action);
        
        logger.info("Processed action for user {}: +{} points, +{}kg CO2", 
                   user.getUsername(), pointsEarned, co2Saved);
    }
    
    private void checkAndAwardAchievements(User user) {
        if (user.getEcoPoints() >= 500 && !user.getAchievements().contains("Eco Champion")) {
            user.addAchievement("Eco Champion");
            logger.info("User {} achieved: Eco Champion", user.getUsername());
        }
        
        if (user.getEcoPoints() >= 1000 && !user.getAchievements().contains("Eco Warrior")) {
            user.addAchievement("Eco Warrior");
            logger.info("User {} achieved: Eco Warrior", user.getUsername());
        }
        
        if (user.getTotalCO2Saved() >= 500 && !user.getAchievements().contains("CO2 Saver")) {
            user.addAchievement("CO2 Saver");
            logger.info("User {} achieved: CO2 Saver", user.getUsername());
        }
        
        if (user.getTotalCO2Saved() >= 1000 && !user.getAchievements().contains("Climate Hero")) {
            user.addAchievement("Climate Hero");
            logger.info("User {} achieved: Climate Hero", user.getUsername());
        }
        
        long actionCount = actionRepository.countByUser(user);
        if (actionCount >= 10 && !user.getAchievements().contains("Analyzer Expert")) {
            user.addAchievement("Analyzer Expert");
            logger.info("User {} achieved: Analyzer Expert", user.getUsername());
        }
    }
}