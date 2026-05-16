import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { feedback } from "@/db/schema";
import { authOptions } from "@/lib/auth";

const categories = ["general", "bug", "idea", "content"] as const;
const statuses = ["new", "reviewed"] as const;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "30"))
    );
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim();
    const offset = (page - 1) * limit;

    const conditions = [];

    if (status && statuses.includes(status as (typeof statuses)[number])) {
      conditions.push(eq(feedback.status, status));
    }

    if (
      category &&
      categories.includes(category as (typeof categories)[number])
    ) {
      conditions.push(eq(feedback.category, category));
    }

    if (search) {
      conditions.push(
        or(
          ilike(feedback.name, `%${search}%`),
          ilike(feedback.email, `%${search}%`),
          ilike(feedback.message, `%${search}%`)
        )
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(feedback)
      .where(where)
      .orderBy(desc(feedback.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(feedback)
      .where(where);

    const [{ newCount }] = await db
      .select({ newCount: sql<number>`count(*)::int` })
      .from(feedback)
      .where(eq(feedback.status, "new"));

    const [{ reviewedCount }] = await db
      .select({ reviewedCount: sql<number>`count(*)::int` })
      .from(feedback)
      .where(eq(feedback.status, "reviewed"));

    return NextResponse.json({
      feedback: rows,
      stats: {
        total: Number(total),
        new: Number(newCount),
        reviewed: Number(reviewedCount),
      },
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.max(1, Math.ceil(Number(total) / limit)),
      },
    });
  } catch (error) {
    console.error("GET feedback error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil feedback" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Format feedback tidak valid" },
        { status: 400 }
      );
    }

    if (cleanText(body.website, 120)) {
      return NextResponse.json(
        { message: "Feedback berhasil dikirim" },
        { status: 201 }
      );
    }

    const name = cleanText(body.name, 100);
    const rawEmail = cleanText(body.email, 255);
    const message = cleanText(body.message, 2000);
    const category = categories.includes(body.category)
      ? body.category
      : "general";

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Nama minimal 2 karakter" },
        { status: 400 }
      );
    }

    if (rawEmail && !isValidEmail(rawEmail)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Feedback minimal 10 karakter" },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(feedback)
      .values({
        name,
        email: rawEmail || null,
        category,
        message,
        status: "new",
      })
      .returning();

    return NextResponse.json(
      {
        message: "Feedback berhasil dikirim",
        feedback: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST feedback error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengirim feedback" },
      { status: 500 }
    );
  }
}
