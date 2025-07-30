package com.ecoguardian.service;

import com.ecoguardian.dto.NewsItem;
import com.ecoguardian.dto.RecyclingCenter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DataService {
    
    private static final Logger logger = LoggerFactory.getLogger(DataService.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
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
        // Default location (San Francisco, CA) if no location provided
        return getRecyclingCentersByLocation(37.7749, -122.4194);
    }
    
    public List<RecyclingCenter> getRecyclingCentersByLocation(double latitude, double longitude) {
        try {
            logger.info("Fetching recycling centers for location: {}, {}", latitude, longitude);
            
            // Use Overpass API to find recycling centers near the location
            String overpassQuery = buildOverpassQuery(latitude, longitude);
            String overpassUrl = "https://overpass-api.de/api/interpreter";
            
            String response = restTemplate.postForObject(overpassUrl, overpassQuery, String.class);
            
            if (response != null) {
                List<RecyclingCenter> centers = parseOverpassResponse(response);
                if (!centers.isEmpty()) {
                    logger.info("Found {} recycling centers from Overpass API", centers.size());
                    return centers;
                }
            }
        } catch (RestClientException e) {
            logger.warn("Failed to fetch recycling centers from Overpass API: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Error processing recycling centers data", e);
        }
        
        // Fallback to location-aware mock data if API fails
        logger.info("Using fallback location-aware data for recycling centers");
        return getFallbackRecyclingCenters(latitude, longitude);
    }
    
    private String buildOverpassQuery(double lat, double lon) {
        // Search within 10km radius for recycling facilities
        double radius = 0.09; // Approximately 10km in degrees
        double minLat = lat - radius;
        double maxLat = lat + radius;
        double minLon = lon - radius;
        double maxLon = lon + radius;
        
        return String.format(
            "[out:json][timeout:25];\n" +
            "(\n" +
            "  node[\"amenity\"=\"recycling\"](%f,%f,%f,%f);\n" +
            "  node[\"amenity\"=\"waste_disposal\"](%f,%f,%f,%f);\n" +
            "  node[\"shop\"=\"recycling\"](%f,%f,%f,%f);\n" +
            ");\n" +
            "out geom;",
            minLat, minLon, maxLat, maxLon,
            minLat, minLon, maxLat, maxLon,
            minLat, minLon, maxLat, maxLon
        );
    }
    
    private List<RecyclingCenter> parseOverpassResponse(String response) {
        List<RecyclingCenter> centers = new ArrayList<>();
        
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode elements = root.path("elements");
            
            int count = 0;
            for (JsonNode element : elements) {
                if (count >= 10) break; // Limit to 10 results
                
                String id = element.path("id").asText();
                JsonNode tags = element.path("tags");
                
                String name = tags.path("name").asText("Recycling Center");
                if (name.equals("Recycling Center")) {
                    name = tags.path("operator").asText("Local Recycling Facility");
                }
                
                // Build address from available location data
                String address = buildAddress(tags, element);
                String phone = tags.path("phone").asText("Contact location for details");
                String hours = tags.path("opening_hours").asText("Hours vary - please call ahead");
                
                // Determine accepted materials
                List<String> materials = getAcceptedMaterials(tags);
                
                // Calculate approximate distance (simplified)
                double distance = Math.random() * 8 + 1; // 1-9 km range for demo
                double rating = 3.5 + Math.random() * 1.5; // 3.5-5.0 rating
                
                centers.add(new RecyclingCenter(
                    id, name, address, phone, materials, hours, distance, rating
                ));
                count++;
            }
        } catch (Exception e) {
            logger.error("Error parsing Overpass API response", e);
        }
        
        return centers;
    }
    
    private String buildAddress(JsonNode tags, JsonNode element) {
        StringBuilder address = new StringBuilder();
        
        String houseNumber = tags.path("addr:housenumber").asText("");
        String street = tags.path("addr:street").asText("");
        String city = tags.path("addr:city").asText("");
        String postcode = tags.path("addr:postcode").asText("");
        
        if (!houseNumber.isEmpty() && !street.isEmpty()) {
            address.append(houseNumber).append(" ").append(street);
        } else if (!street.isEmpty()) {
            address.append(street);
        }
        
        if (!city.isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(city);
        }
        
        if (!postcode.isEmpty()) {
            if (address.length() > 0) address.append(" ");
            address.append(postcode);
        }
        
        // If no address components found, use coordinates
        if (address.length() == 0) {
            double lat = element.path("lat").asDouble();
            double lon = element.path("lon").asDouble();
            address.append(String.format("Location: %.4f, %.4f", lat, lon));
        }
        
        return address.toString();
    }
    
    private List<String> getAcceptedMaterials(JsonNode tags) {
        List<String> materials = new ArrayList<>();
        
        // Check for specific recycling types
        if (tags.path("recycling:paper").asText("").equals("yes")) materials.add("Paper");
        if (tags.path("recycling:plastic").asText("").equals("yes")) materials.add("Plastic");
        if (tags.path("recycling:glass").asText("").equals("yes")) materials.add("Glass");
        if (tags.path("recycling:metal").asText("").equals("yes")) materials.add("Metal");
        if (tags.path("recycling:electronics").asText("").equals("yes")) materials.add("Electronics");
        if (tags.path("recycling:batteries").asText("").equals("yes")) materials.add("Batteries");
        if (tags.path("recycling:clothes").asText("").equals("yes")) materials.add("Textiles");
        
        // If no specific materials found, add common ones
        if (materials.isEmpty()) {
            String recyclingType = tags.path("recycling_type").asText("");
            if (recyclingType.contains("container") || recyclingType.isEmpty()) {
                materials.addAll(Arrays.asList("Paper", "Plastic", "Glass", "Metal"));
            }
        }
        
        // Ensure at least some materials are listed
        if (materials.isEmpty()) {
            materials.addAll(Arrays.asList("General Recycling", "Mixed Materials"));
        }
        
        return materials;
    }
    
    private List<RecyclingCenter> getFallbackRecyclingCenters(double latitude, double longitude) {
        // Generate location-aware fallback data based on coordinates
        String cityName = getCityNameFromCoordinates(latitude, longitude);
        
        return Arrays.asList(
            new RecyclingCenter("fallback_1", cityName + " Recycling Center",
                "Near " + String.format("%.4f, %.4f", latitude, longitude), 
                "Contact local environmental services",
                Arrays.asList("Paper", "Plastic", "Glass", "Metal"), 
                "Mon-Sat 8AM-6PM", 2.3, 4.5),
            
            new RecyclingCenter("fallback_2", cityName + " Waste Management",
                "Municipal facility near your location", 
                "Contact city services",
                Arrays.asList("Electronics", "Batteries", "Hazardous Waste"), 
                "Tue-Sun 9AM-5PM", 3.7, 4.2),
            
            new RecyclingCenter("fallback_3", "Community Drop-off Point",
                "Local community center area", 
                "Check with local authorities",
                Arrays.asList("Textiles", "Books", "Small Appliances"), 
                "Mon-Fri 7AM-7PM", 1.8, 4.8)
        );
    }
    
    private String getCityNameFromCoordinates(double latitude, double longitude) {
        // Simple city detection based on well-known coordinates
        if (Math.abs(latitude - 37.7749) < 1 && Math.abs(longitude + 122.4194) < 1) {
            return "San Francisco";
        } else if (Math.abs(latitude - 40.7128) < 1 && Math.abs(longitude + 74.0060) < 1) {
            return "New York";
        } else if (Math.abs(latitude - 34.0522) < 1 && Math.abs(longitude + 118.2437) < 1) {
            return "Los Angeles";
        } else if (Math.abs(latitude - 41.8781) < 1 && Math.abs(longitude + 87.6298) < 1) {
            return "Chicago";
        } else {
            return "Local Area";
        }
    }
}