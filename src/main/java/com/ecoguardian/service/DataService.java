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
            
            // Use Google Maps Places API to find recycling centers near the location
            String googleMapsApiKey = System.getenv("GOOGLE_MAPS_API_KEY");
            if (googleMapsApiKey == null || googleMapsApiKey.trim().isEmpty()) {
                logger.warn("Google Maps API key not found, using fallback data");
                return getFallbackRecyclingCenters(latitude, longitude);
            }
            
            String placesUrl = buildGooglePlacesUrl(latitude, longitude, googleMapsApiKey);
            String response = restTemplate.getForObject(placesUrl, String.class);
            
            if (response != null) {
                List<RecyclingCenter> centers = parseGooglePlacesResponse(response, latitude, longitude);
                if (!centers.isEmpty()) {
                    logger.info("Found {} recycling centers from Google Maps API", centers.size());
                    return centers;
                }
            }
        } catch (RestClientException e) {
            logger.warn("Failed to fetch recycling centers from Google Maps API: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Error processing recycling centers data", e);
        }
        
        // Fallback to location-aware mock data if API fails
        logger.info("Using fallback location-aware data for recycling centers");
        return getFallbackRecyclingCenters(latitude, longitude);
    }
    
    private String buildGooglePlacesUrl(double lat, double lon, String apiKey) {
        // Search within 10km radius for recycling facilities
        String baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
        String location = lat + "," + lon;
        int radius = 10000; // 10km in meters
        String type = "point_of_interest";
        String keyword = "recycling center waste management";
        
        return String.format(
            "%s?location=%s&radius=%d&type=%s&keyword=%s&key=%s",
            baseUrl, location, radius, type, keyword, apiKey
        );
    }
    
    private List<RecyclingCenter> parseGooglePlacesResponse(String response, double userLat, double userLon) {
        List<RecyclingCenter> centers = new ArrayList<>();
        
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode results = root.path("results");
            
            int count = 0;
            for (JsonNode place : results) {
                if (count >= 10) break; // Limit to 10 results
                
                String id = place.path("place_id").asText();
                String name = place.path("name").asText("Recycling Center");
                String address = place.path("vicinity").asText("Address not available");
                
                // Extract location for distance calculation
                JsonNode geometry = place.path("geometry");
                JsonNode location = geometry.path("location");
                double placeLat = location.path("lat").asDouble();
                double placeLng = location.path("lng").asDouble();
                
                // Calculate distance
                double distance = calculateDistance(userLat, userLon, placeLat, placeLng);
                
                // Extract rating
                double rating = place.path("rating").asDouble(4.0);
                
                // Get business status and hours
                String hours = "Hours vary - please call ahead";
                boolean isOpen = place.path("opening_hours").path("open_now").asBoolean(false);
                if (isOpen) {
                    hours = "Currently open - call for specific hours";
                }
                
                // Check if place is currently operational
                String businessStatus = place.path("business_status").asText("OPERATIONAL");
                if (!businessStatus.equals("OPERATIONAL")) {
                    continue; // Skip closed businesses
                }
                
                // Default phone and materials
                String phone = "Contact location for details";
                List<String> materials = getDefaultMaterials(name);
                
                centers.add(new RecyclingCenter(
                    id, name, address, phone, materials, hours, distance, rating
                ));
                count++;
            }
        } catch (Exception e) {
            logger.error("Error parsing Google Places API response", e);
        }
        
        return centers;
    }
    
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula for calculating distance between two points
        final int R = 6371; // Radius of the earth in km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; // Distance in km
    }
    
    private List<String> getDefaultMaterials(String placeName) {
        List<String> materials = new ArrayList<>();
        String lowerName = placeName.toLowerCase();
        
        if (lowerName.contains("electronic") || lowerName.contains("e-waste")) {
            materials.addAll(Arrays.asList("Electronics", "Batteries", "Computer Equipment"));
        } else if (lowerName.contains("metal") || lowerName.contains("scrap")) {
            materials.addAll(Arrays.asList("Metal", "Aluminum", "Steel", "Copper"));
        } else if (lowerName.contains("paper") || lowerName.contains("cardboard")) {
            materials.addAll(Arrays.asList("Paper", "Cardboard", "Newspapers", "Magazines"));
        } else if (lowerName.contains("plastic")) {
            materials.addAll(Arrays.asList("Plastic Bottles", "Plastic Containers", "Plastic Bags"));
        } else if (lowerName.contains("glass")) {
            materials.addAll(Arrays.asList("Glass Bottles", "Glass Containers", "Window Glass"));
        } else {
            // General recycling center
            materials.addAll(Arrays.asList("Paper", "Plastic", "Glass", "Metal", "Cardboard"));
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