import { NextResponse } from "next/server";
import { db } from "@/db";
import { kajian } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
// import { and } from "drizzle-orm/expressions";

// GET all kajian
// GET all kajian
// GET all kajian
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "published";

    const baseQuery = db.select().from(kajian).orderBy(desc(kajian.createdAt));

    // Jangan mutate — build query baru
    const finalQuery =
      status === "all" ? baseQuery : baseQuery.where(eq(kajian.status, status));

    const allKajian = await finalQuery;

    return NextResponse.json(allKajian);
  } catch (error) {
    console.error("Error creating kajian:", error);

    const errMsg = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: "Failed to create kajian", details: errMsg },
      { status: 500 }
    );
  }

}


// POST create kajian
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

    const errMsg = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to create kajian", details: errMsg },
      { status: 500 }
    );
  }
}

