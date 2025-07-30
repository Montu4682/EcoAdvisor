package com.ecoguardian.service;

import com.ecoguardian.dto.NewsItem;
import com.ecoguardian.dto.RecyclingCenter;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class DataService {
    
    public List<NewsItem> getNewsItems() {
        return Arrays.asList(
            new NewsItem("1", "Global Renewable Energy Adoption Reaches Record High",
                "Renewable energy sources now account for 30% of global electricity generation, with solar and wind leading the transition.",
                "Renewable Energy", LocalDateTime.now().minusDays(1), "GreenTech Daily", "#"),
            
            new NewsItem("2", "Major Corporations Commit to Zero Waste by 2030",
                "Over 100 Fortune 500 companies have pledged to eliminate waste sent to landfills within the next decade.",
                "Waste Reduction", LocalDateTime.now().minusDays(2), "Sustainability Report", "#"),
            
            new NewsItem("3", "New Biodegradable Plastic Alternative Made from Seaweed",
                "Scientists develop revolutionary packaging material that dissolves in water and is completely compostable.",
                "Innovation", LocalDateTime.now().minusDays(3), "Eco Innovation Hub", "#"),
            
            new NewsItem("4", "Urban Composting Programs Reduce City Waste by 40%",
                "Cities implementing community composting see dramatic reduction in organic waste going to landfills.",
                "Waste Management", LocalDateTime.now().minusDays(4), "Urban Sustainability", "#")
        );
    }
    
    public List<RecyclingCenter> getRecyclingCenters() {
        return Arrays.asList(
            new RecyclingCenter("1", "Green Cycle Center",
                "123 Eco Street, Green City, GC 12345", "(555) 123-4567",
                Arrays.asList("Plastic", "Glass", "Metal", "Paper"), 
                "Mon-Sat 8AM-6PM", 2.3, 4.5),
            
            new RecyclingCenter("2", "EcoWaste Solutions",
                "456 Recycle Ave, Sustainable Town, ST 67890", "(555) 987-6543",
                Arrays.asList("Electronics", "Batteries", "Plastic", "Metal"), 
                "Tue-Sun 9AM-5PM", 3.7, 4.2),
            
            new RecyclingCenter("3", "Community Recycling Hub",
                "789 Green Way, Eco Village, EV 13579", "(555) 456-7890",
                Arrays.asList("Textiles", "Paper", "Cardboard", "Glass"), 
                "Mon-Fri 7AM-7PM", 1.8, 4.8)
        );
    }
}