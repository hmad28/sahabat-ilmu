import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  json,
} from "drizzle-orm/pg-core";

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
  status: varchar("status", { length: 20 }).default("published"), // draft, published
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
