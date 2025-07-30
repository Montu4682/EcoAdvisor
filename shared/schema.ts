import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  ecoPoints: integer("eco_points").notNull().default(0),
  level: text("level").notNull().default("Eco Starter"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  itemName: text("item_name").notNull(),
  itemType: text("item_type").notNull(),
  imageUrl: text("image_url"),
  analysisResult: json("analysis_result"),
  ecoAlternatives: json("eco_alternatives"),
  co2Savings: integer("co2_savings").default(0),
  pointsEarned: integer("points_earned").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userActions = pgTable("user_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  actionType: text("action_type").notNull(),
  itemId: varchar("item_id").references(() => items.id),
  pointsEarned: integer("points_earned").default(0),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
});

export const insertItemSchema = createInsertSchema(items).pick({
  itemName: true,
  itemType: true,
  imageUrl: true,
  analysisResult: true,
  ecoAlternatives: true,
  co2Savings: true,
  pointsEarned: true,
});

export const insertActionSchema = createInsertSchema(userActions).pick({
  actionType: true,
  itemId: true,
  pointsEarned: true,
  description: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;
export type InsertAction = z.infer<typeof insertActionSchema>;
export type UserAction = typeof userActions.$inferSelect;

// API Response Types
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
}

export interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: string;
  phone: string;
}
