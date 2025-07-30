package com.ecoguardian.dto;

import java.util.List;
import java.util.ArrayList;

public class RecyclingCenter {
    private String id;
    private String name;
    private String address;
    private String phone;
    private List<String> acceptedMaterials;
    private String hours;
    private double distance;
    private double rating;
    
    public RecyclingCenter() {
        this.acceptedMaterials = new ArrayList<>();
    }
    
    public RecyclingCenter(String id, String name, String address, String phone, 
                          List<String> acceptedMaterials, String hours, double distance, double rating) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.acceptedMaterials = acceptedMaterials != null ? acceptedMaterials : new ArrayList<>();
        this.hours = hours;
        this.distance = distance;
        this.rating = rating;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public List<String> getAcceptedMaterials() { return acceptedMaterials; }
    public void setAcceptedMaterials(List<String> acceptedMaterials) { this.acceptedMaterials = acceptedMaterials; }
    
    public String getHours() { return hours; }
    public void setHours(String hours) { this.hours = hours; }
    
    public double getDistance() { return distance; }
    public void setDistance(double distance) { this.distance = distance; }
    
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    
    // Helper methods
    public void addAcceptedMaterial(String material) {
        if (!acceptedMaterials.contains(material)) {
            acceptedMaterials.add(material);
        }
    }
    
    public String getAcceptedMaterialsString() {
        return String.join(", ", acceptedMaterials);
    }
    
    public String getFormattedDistance() {
        return String.format("%.1f miles", distance);
    }
}