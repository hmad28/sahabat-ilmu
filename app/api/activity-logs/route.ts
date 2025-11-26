// app/api/activity-logs/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { activityLogs, users } from "@/db/schema";
import { desc, eq, and, gte, lte, like, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only SUPER_ADMIN can access logs
    if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    // Build filter conditions
    const conditions = [];

    if (action) {
      conditions.push(eq(activityLogs.action, action));
    }

    if (entityType) {
      conditions.push(eq(activityLogs.entityType, entityType));
    }

    if (userId) {
      conditions.push(eq(activityLogs.userId, parseInt(userId)));
    }

    if (startDate) {
      conditions.push(gte(activityLogs.createdAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(activityLogs.createdAt, new Date(endDate)));
    }

    if (search) {
      conditions.push(like(activityLogs.description, `%${search}%`));
    }

    // Fetch logs with user info
    const logs = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        entityType: activityLogs.entityType,
        entityId: activityLogs.entityId,
        description: activityLogs.description,
        metadata: activityLogs.metadata,
        createdAt: activityLogs.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
        },
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: activityLogs.id })
      .from(activityLogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = totalResult.length;

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch activity logs error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil log" },
      { status: 500 }
    );
  }
}
