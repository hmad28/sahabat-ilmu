// src/db/schema.ts

import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  json,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum untuk role user
export const roleEnum = pgEnum("role", ["SUPER_ADMIN", "AUTHOR"]);

// Tabel Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").default("AUTHOR").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabel Kajian (Updated dengan authorId)
export const kajian = pgTable("kajian", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  gallery: json("gallery").$type<string[]>().default([]),
  ustadz: varchar("ustadz", { length: 100 }),
  location: varchar("location", { length: 100 }),
  date: timestamp("date"),
  category: varchar("category", { length: 50 }).default("kajian"),
  status: varchar("status", { length: 20 }).default("published"),
  authorId: serial("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabel Activity Logs
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 50 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: integer("entity_id"),
  description: text("description").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  kajians: many(kajian),
}));

export const kajianRelations = relations(kajian, ({ one }) => ({
  author: one(users, {
    fields: [kajian.authorId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Kajian = typeof kajian.$inferSelect;
export type NewKajian = typeof kajian.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
