// src/app/api/kajian/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { kajian } from "@/db/schema";
import { eq } from "drizzle-orm";

// PUT - Update kajian (requires auth + ownership or super admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const body = await req.json();

    // Check if kajian exists
    const [existingKajian] = await db
      .select()
      .from(kajian)
      .where(eq(kajian.id, id))
      .limit(1);

    if (!existingKajian) {
      return NextResponse.json({ error: "Kajian not found" }, { status: 404 });
    }

    // Check permission: Super Admin can edit all, Author can only edit their own
    const isSuperAdmin = session.user.role === "SUPER_ADMIN";
    const isOwner = existingKajian.authorId === session.user.id;

    if (!isSuperAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own kajian" },
        { status: 403 }
      );
    }

    const {
      title,
      excerpt,
      content,
      coverImage,
      gallery,
      ustadz,
      location,
      date,
      category,
      status,
    } = body;

    // Generate slug if title changed
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Update kajian
    const [updatedKajian] = await db
      .update(kajian)
      .set({
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        gallery: gallery || [],
        ustadz: ustadz || null,
        location: location || null,
        date: date ? new Date(date) : null,
        category: category || "kajian",
        status: status || "published",
        updatedAt: new Date(),
      })
      .where(eq(kajian.id, id))
      .returning();

    return NextResponse.json(updatedKajian);
  } catch (error: any) {
    console.error("PUT kajian error:", error);
    return NextResponse.json(
      { error: "Failed to update kajian", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete kajian (requires auth + ownership or super admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);

    // Check if kajian exists
    const [existingKajian] = await db
      .select()
      .from(kajian)
      .where(eq(kajian.id, id))
      .limit(1);

    if (!existingKajian) {
      return NextResponse.json({ error: "Kajian not found" }, { status: 404 });
    }

    // Check permission: Super Admin can delete all, Author can only delete their own
    const isSuperAdmin = session.user.role === "SUPER_ADMIN";
    const isOwner = existingKajian.authorId === session.user.id;

    if (!isSuperAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own kajian" },
        { status: 403 }
      );
    }

    // Delete kajian
    await db.delete(kajian).where(eq(kajian.id, id));

    return NextResponse.json({ message: "Kajian deleted successfully" });
  } catch (error: any) {
    console.error("DELETE kajian error:", error);
    return NextResponse.json(
      { error: "Failed to delete kajian", details: error.message },
      { status: 500 }
    );
  }
}
