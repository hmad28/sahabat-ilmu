import { NextResponse } from "next/server";
import { db } from "@/db";
import { kajian } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET all kajian
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "published";

    let query = db.select().from(kajian).orderBy(desc(kajian.createdAt));

    if (status !== "all") {
      query = query.where(eq(kajian.status, status));
    }

    const allKajian = await query;

    return NextResponse.json(allKajian);
  } catch (error) {
    console.error("Error fetching kajian:", error);
    return NextResponse.json(
      { error: "Failed to fetch kajian" },
      { status: 500 }
    );
  }
}

// POST create kajian
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Handle empty date - convert empty string to null
    const dateValue =
      body.date && body.date.trim() !== "" ? new Date(body.date) : null;

    // Prepare data
    const kajianData = {
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage || null,
      gallery: body.gallery || [],
      ustadz: body.ustadz || null,
      location: body.location || null,
      date: dateValue,
      category: body.category || "kajian",
      status: body.status || "published",
    };

    const [newKajian] = await db.insert(kajian).values(kajianData).returning();

    return NextResponse.json(newKajian);
  } catch (error) {
    console.error("Error creating kajian:", error);
    return NextResponse.json(
      { error: "Failed to create kajian", details: error.message },
      { status: 500 }
    );
  }
}
