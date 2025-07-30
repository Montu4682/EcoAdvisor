import { type User, type InsertUser, type Item, type InsertItem, type UserAction, type InsertAction } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(id: string, points: number): Promise<User | undefined>;
  updateUserLevel(id: string, level: string): Promise<User | undefined>;
  
  // Item methods
  createItem(userId: string, item: InsertItem): Promise<Item>;
  getItemsByUserId(userId: string): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  
  // Action methods
  createAction(userId: string, action: InsertAction): Promise<UserAction>;
  getActionsByUserId(userId: string): Promise<UserAction[]>;
  getRecentActions(userId: string, limit?: number): Promise<UserAction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private items: Map<string, Item>;
  private actions: Map<string, UserAction>;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.actions = new Map();
    
    // Create default user for demo
    const defaultUser: User = {
      id: "default-user",
      username: "eco_user",
      ecoPoints: 1250,
      level: "Eco Warrior",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      ecoPoints: 0, 
      level: "Eco Starter",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(id: string, points: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ecoPoints: user.ecoPoints + points };
    
    // Update level based on points
    if (updatedUser.ecoPoints >= 2000) {
      updatedUser.level = "Eco Master";
    } else if (updatedUser.ecoPoints >= 1000) {
      updatedUser.level = "Eco Warrior";
    } else if (updatedUser.ecoPoints >= 500) {
      updatedUser.level = "Eco Champion";
    } else {
      updatedUser.level = "Eco Starter";
    }
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserLevel(id: string, level: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, level };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createItem(userId: string, item: InsertItem): Promise<Item> {
    const id = randomUUID();
    const newItem: Item = {
      ...item,
      id,
      userId,
      imageUrl: item.imageUrl || null,
      analysisResult: item.analysisResult || null,
      ecoAlternatives: item.ecoAlternatives || null,
      co2Savings: item.co2Savings || null,
      pointsEarned: item.pointsEarned || null,
      createdAt: new Date(),
    };
    this.items.set(id, newItem);
    return newItem;
  }

  async getItemsByUserId(userId: string): Promise<Item[]> {
    return Array.from(this.items.values()).filter(item => item.userId === userId);
  }

  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async createAction(userId: string, action: InsertAction): Promise<UserAction> {
    const id = randomUUID();
    const newAction: UserAction = {
      ...action,
      id,
      userId,
      description: action.description || null,
      pointsEarned: action.pointsEarned || null,
      itemId: action.itemId || null,
      createdAt: new Date(),
    };
    this.actions.set(id, newAction);
    return newAction;
  }

  async getActionsByUserId(userId: string): Promise<UserAction[]> {
    return Array.from(this.actions.values()).filter(action => action.userId === userId);
  }

  async getRecentActions(userId: string, limit: number = 10): Promise<UserAction[]> {
    const userActions = Array.from(this.actions.values())
      .filter(action => action.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
    
    return userActions;
  }
}

export const storage = new MemStorage();
