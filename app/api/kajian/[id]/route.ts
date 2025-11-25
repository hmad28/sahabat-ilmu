import { NextResponse } from "next/server";
import { db } from "@/db";
import { kajian } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET single kajian by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const kajianId = parseInt(id);

    const [foundKajian] = await db
      .select()
      .from(kajian)
      .where(eq(kajian.id, kajianId))
      .limit(1);

    if (!foundKajian) {
      return NextResponse.json({ error: "Kajian not found" }, { status: 404 });
    }

    return NextResponse.json(foundKajian);
  } catch (error) {
    console.error("Error fetching kajian:", error);
    return NextResponse.json(
      { error: "Failed to fetch kajian" },
      { status: 500 }
    );
  }
}

// PUT update kajian
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const kajianId = parseInt(id);
    const body = await request.json();

    // Generate slug if title changed
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Handle date
    const dateValue =
      body.date && body.date.trim() !== "" ? new Date(body.date) : null;

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
      updatedAt: new Date(),
    };

    const [updatedKajian] = await db
      .update(kajian)
      .set(kajianData)
      .where(eq(kajian.id, kajianId))
      .returning();

    if (!updatedKajian) {
      return NextResponse.json({ error: "Kajian not found" }, { status: 404 });
    }

    return NextResponse.json(updatedKajian);
  } catch (error) {
    console.error("Error updating kajian:", error);
    return NextResponse.json(
      { error: "Failed to update kajian" },
      { status: 500 }
    );
  }
}

// DELETE kajian
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const kajianId = parseInt(id);

    const [deletedKajian] = await db
      .delete(kajian)
      .where(eq(kajian.id, kajianId))
      .returning();

    if (!deletedKajian) {
      return NextResponse.json({ error: "Kajian not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedKajian });
  } catch (error) {
    console.error("Error deleting kajian:", error);
    return NextResponse.json(
      { error: "Failed to delete kajian" },
      { status: 500 }
    );
  }
}
