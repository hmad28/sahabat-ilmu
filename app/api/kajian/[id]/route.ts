// app/api/kajian/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { kajian } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-logger";
import slugify from "slugify";

// PUT - Update kajian (requires auth + ownership or super admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed: params is now a Promise
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params; // Changed: await params
    const id = parseInt(idParam);
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

    // Track changes
    type TrackField =
      | "title"
      | "excerpt"
      | "status"
      | "ustadz"
      | "location"
      | "date";

    const trackFields: TrackField[] = [
      "title",
      "excerpt",
      "status",
      "ustadz",
      "location",
      "date",
    ];

    const changes: Record<string, any> = {};

    trackFields.forEach((field) => {
      if (existingKajian[field] !== updatedKajian[field]) {
        changes[field] = {
          from: existingKajian[field],
          to: updatedKajian[field],
        };
      }
    });


    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "UPDATE",
      entityType: "kajian",
      entityId: updatedKajian.id,
      description: `Mengupdate kajian: "${updatedKajian.title}"`,
      metadata: {
        changes: Object.keys(changes).length > 0 ? changes : undefined,
      },
    });

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
  { params }: { params: Promise<{ id: string }> } // Changed: params is now a Promise
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params; // Changed: await params
    const id = parseInt(idParam);

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

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "DELETE",
      entityType: "kajian",
      entityId: id,
      description: `Menghapus kajian: "${existingKajian.title}"`,
      metadata: {
        oldValue: {
          title: existingKajian.title,
          status: existingKajian.status,
        },
      },
    });

    return NextResponse.json({ message: "Kajian deleted successfully" });
  } catch (error: any) {
    console.error("DELETE kajian error:", error);
    return NextResponse.json(
      { error: "Failed to delete kajian", details: error.message },
      { status: 500 }
    );
  }
}
