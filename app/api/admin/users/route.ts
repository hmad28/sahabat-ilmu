// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/index";
import { users, kajian } from "@/db/schema";
import { eq, sql, count } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is SUPER_ADMIN
    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 403 }
      );
    }

    // Get all users with their kajian count
    const usersWithStats = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        kajianCount: count(kajian.id),
      })
      .from(users)
      .leftJoin(kajian, eq(users.id, kajian.authorId))
      .groupBy(users.id, users.name, users.email, users.role, users.createdAt)
      .orderBy(users.createdAt);

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
