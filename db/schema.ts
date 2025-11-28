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

// ========================================
// TABEL UNTUK JADWAL SHOLAT
// ========================================
export const prayerTimes = pgTable("prayer_times", {
  id: serial("id").primaryKey(),
  province: varchar("province", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  date: timestamp("date").notNull(),
  fajr: varchar("fajr", { length: 5 }).notNull(), // "04:30"
  sunrise: varchar("sunrise", { length: 5 }).notNull(),
  dhuhr: varchar("dhuhr", { length: 5 }).notNull(),
  asr: varchar("asr", { length: 5 }).notNull(),
  maghrib: varchar("maghrib", { length: 5 }).notNull(),
  isha: varchar("isha", { length: 5 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ========================================
// TABEL UNTUK JADWAL KAJIAN (SCRAPING)
// ========================================
export const kajianSchedule = pgTable("kajian_schedule", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  ustadz: varchar("ustadz", { length: 100 }),
  location: varchar("location", { length: 255 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 100 }),
  date: timestamp("date").notNull(),
  time: varchar("time", { length: 50 }), // "08:00 - 10:00"
  description: text("description"),
  sourceUrl: text("source_url"), // Link ke jadwalkajian.com
  scrapedAt: timestamp("scraped_at").defaultNow().notNull(),
  isActive: varchar("is_active", { length: 10 }).default("true"), // untuk soft delete
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ========================================
// TABEL UNTUK CACHE AL-QUR'AN (OPTIONAL)
// ========================================
// Ini optional, bisa langsung pakai API aja
// Tapi kalau mau cache untuk performa lebih baik:
export const quranCache = pgTable("quran_cache", {
  id: serial("id").primaryKey(),
  surahNumber: integer("surah_number").notNull(),
  surahName: varchar("surah_name", { length: 50 }).notNull(),
  surahNameArabic: varchar("surah_name_arabic", { length: 50 }).notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  arabicText: text("arabic_text").notNull(),
  translationId: text("translation_id").notNull(),
  transliterationId: text("transliteration_id"),
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ========================================
// TABEL UNTUK USER BOOKMARKS/FAVORITES (BONUS)
// ========================================
export const userBookmarks = pgTable("user_bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  surahNumber: integer("surah_number").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  note: text("note"), // catatan pribadi user
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

// Relations untuk bookmark
export const userBookmarksRelations = relations(userBookmarks, ({ one }) => ({
  user: one(users, {
    fields: [userBookmarks.userId],
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

// ========================================
// TYPES
// ========================================
export type PrayerTime = typeof prayerTimes.$inferSelect;
export type NewPrayerTime = typeof prayerTimes.$inferInsert;

export type KajianSchedule = typeof kajianSchedule.$inferSelect;
export type NewKajianSchedule = typeof kajianSchedule.$inferInsert;

export type QuranCache = typeof quranCache.$inferSelect;
export type NewQuranCache = typeof quranCache.$inferInsert;

export type UserBookmark = typeof userBookmarks.$inferSelect;
export type NewUserBookmark = typeof userBookmarks.$inferInsert;