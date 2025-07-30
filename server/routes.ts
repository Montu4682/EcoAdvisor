import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeImage, generateEcoSuggestions, calculateCO2Impact } from "./services/openai";
import { insertItemSchema, insertActionSchema } from "@shared/schema";
import { z } from "zod";

const DEFAULT_USER_ID = "default-user"; // For MVP, using single user

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current user
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(DEFAULT_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Analyze image with AI
  app.post("/api/analyze", async (req, res) => {
    try {
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ message: "Image data is required" });
      }

      // Remove data URL prefix if present
      const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, "");
      
      const analysisResult = await analyzeImage(base64Image);
      
      // Create item record
      const itemData = {
        itemName: analysisResult.analysis.itemName,
        itemType: analysisResult.analysis.itemType,
        imageUrl: null,
        analysisResult: analysisResult.analysis,
        ecoAlternatives: analysisResult.alternatives,
        co2Savings: Math.round(analysisResult.totalCO2Savings || 0),
        pointsEarned: analysisResult.recommendedPoints || 0,
      };

      const item = await storage.createItem(DEFAULT_USER_ID, itemData);
      
      // Create action record
      await storage.createAction(DEFAULT_USER_ID, {
        actionType: "analysis",
        itemId: item.id,
        pointsEarned: analysisResult.recommendedPoints || 0,
        description: `Analyzed ${analysisResult.analysis.itemName}`,
      });

      res.json({
        item,
        analysis: analysisResult
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      const isQuotaError = error.message?.includes('quota') || error.status === 429;
      res.status(isQuotaError ? 429 : 500).json({ 
        message: isQuotaError 
          ? "OpenAI API quota exceeded. Please check your billing settings and try again later."
          : "Failed to analyze image. Please try again." 
      });
    }
  });

  // Select eco alternative and earn points
  app.post("/api/select-alternative", async (req, res) => {
    try {
      const { itemId, alternativeName, pointsToEarn } = req.body;
      
      if (!itemId || !alternativeName) {
        return res.status(400).json({ message: "Item ID and alternative name are required" });
      }

      const item = await storage.getItem(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Award points to user
      const user = await storage.updateUserPoints(DEFAULT_USER_ID, pointsToEarn || 0);
      
      // Create action record
      await storage.createAction(DEFAULT_USER_ID, {
        actionType: "eco_switch",
        itemId: itemId,
        pointsEarned: pointsToEarn || 0,
        description: `Switched to ${alternativeName}`,
      });

      res.json({
        success: true,
        user,
        pointsEarned: pointsToEarn || 0
      });
    } catch (error) {
      console.error("Alternative selection error:", error);
      res.status(500).json({ message: "Failed to select alternative" });
    }
  });

  // Get user's recent actions
  app.get("/api/actions", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const actions = await storage.getRecentActions(DEFAULT_USER_ID, limit);
      res.json(actions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch actions" });
    }
  });

  // Get user's items
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getItemsByUserId(DEFAULT_USER_ID);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  // Get environmental news (mock for MVP)
  app.get("/api/news", async (req, res) => {
    try {
      // Mock news data - in production, integrate with news API
      const mockNews = [
        {
          id: "1",
          title: "Global Renewable Energy Adoption Reaches New Record High in 2024",
          summary: "New report shows renewable energy sources now account for 35% of global electricity generation...",
          category: "Renewable Energy",
          imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          source: "Environmental Times"
        },
        {
          id: "2", 
          title: "Ocean Cleanup Project Removes 100,000 kg of Plastic",
          summary: "Major breakthrough in marine conservation efforts...",
          category: "Ocean Conservation",
          imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          source: "Ocean News"
        },
        {
          id: "3",
          title: "Electric Vehicle Sales Surge 40% This Quarter", 
          summary: "Consumer adoption accelerates amid infrastructure growth...",
          category: "Clean Transportation",
          imageUrl: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=400",
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          source: "Green Tech Today"
        }
      ];
      
      res.json(mockNews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Get nearby recycling centers (mock for MVP)
  app.get("/api/recycling-centers", async (req, res) => {
    try {
      // Mock recycling centers - in production, integrate with Google Maps API
      const mockCenters = [
        {
          id: "1",
          name: "Green Cycle Center",
          address: "123 Eco Street, Green City",
          distance: "0.8 miles",
          type: "Full Service Recycling",
          phone: "(555) 123-4567"
        },
        {
          id: "2",
          name: "EcoMart Recycle Hub", 
          address: "456 Sustainable Ave, Green City",
          distance: "1.2 miles",
          type: "Electronics & Plastic",
          phone: "(555) 234-5678"
        },
        {
          id: "3",
          name: "City Waste Management",
          address: "789 Recycle Blvd, Green City", 
          distance: "2.1 miles",
          type: "Municipal Facility",
          phone: "(555) 345-6789"
        }
      ];
      
      res.json(mockCenters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recycling centers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
