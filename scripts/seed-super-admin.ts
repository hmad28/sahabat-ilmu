// scripts/seed-super-admin.ts

import "dotenv/config";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seedSuperAdmin() {
  try {
    const email = "admin@sahabatilmu.com";
    const password = "Admin123!"; // CHANGE THIS!
    const name = "Super Admin";

    // Check if super admin already exists
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingAdmin) {
      console.log("✅ Super Admin already exists!");
      console.log("Email:", email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super admin
    const [newAdmin] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
      })
      .returning();

    console.log("✅ Super Admin created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("⚠️  PLEASE CHANGE THE PASSWORD AFTER FIRST LOGIN!");
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
  } finally {
    process.exit(0);
  }
}

seedSuperAdmin();
