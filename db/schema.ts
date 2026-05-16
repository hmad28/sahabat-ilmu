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
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum untuk role user
export const roleEnum = pgEnum("role", ["SUPER_ADMIN", "AUTHOR"]);

// Tabel Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  role: roleEnum("role").default("AUTHOR").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabel OTP login email
export const loginOtpCodes = pgTable(
  "login_otp_codes",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    codeHash: varchar("code_hash", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    consumedAt: timestamp("consumed_at"),
    attempts: integer("attempts").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("login_otp_codes_email_created_at_idx").on(
      table.email,
      table.createdAt
    ),
  ]
);

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

// Tabel feedback publik
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  category: varchar("category", { length: 50 }).default("general").notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabel komentar publik pada kajian
export const kajianComments = pgTable("kajian_comments", {
  id: serial("id").primaryKey(),
  kajianId: integer("kajian_id")
    .notNull()
    .references(() => kajian.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabel like publik pada kajian
export const kajianLikes = pgTable(
  "kajian_likes",
  {
    id: serial("id").primaryKey(),
    kajianId: integer("kajian_id")
      .notNull()
      .references(() => kajian.id, { onDelete: "cascade" }),
    clientId: varchar("client_id", { length: 80 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("kajian_likes_kajian_id_client_id_unique").on(
      table.kajianId,
      table.clientId
    ),
  ]
);

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

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;

export type LoginOtpCode = typeof loginOtpCodes.$inferSelect;
export type NewLoginOtpCode = typeof loginOtpCodes.$inferInsert;

export type KajianComment = typeof kajianComments.$inferSelect;
export type NewKajianComment = typeof kajianComments.$inferInsert;
export type KajianLike = typeof kajianLikes.$inferSelect;
export type NewKajianLike = typeof kajianLikes.$inferInsert;

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
