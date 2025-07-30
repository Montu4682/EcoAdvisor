package com.ecoguardian.controller;

import com.ecoguardian.entity.User;
import com.ecoguardian.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/")
    public String home(Model model) {
        User user = userService.getOrCreateDefaultUser();
        model.addAttribute("user", user);
        model.addAttribute("pageTitle", "Eco Guardian - AI-Powered Waste Reduction Advisor");
        return "index";
    }
}