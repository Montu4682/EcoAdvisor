package com.ecoguardian.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class NewsItem {
    private String id;
    private String title;
    private String summary;
    private String category;
    private LocalDateTime publishedAt;
    private String source;
    private String url;
    
    public NewsItem() {}
    
    public NewsItem(String id, String title, String summary, String category, 
                   LocalDateTime publishedAt, String source, String url) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.category = category;
        this.publishedAt = publishedAt;
        this.source = source;
        this.url = url;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    // Helper method for formatted date
    public String getFormattedDate() {
        if (publishedAt != null) {
            return publishedAt.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
        }
        return "";
    }
}