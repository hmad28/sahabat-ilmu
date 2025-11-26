import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { kajian, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { logActivity } from "@/lib/activity-logger";
import slugify from "slugify";

// GET - Fetch all kajian (with author info)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Simple approach: fetch all then filter in code if needed
    const query = db
      .select({
        id: kajian.id,
        title: kajian.title,
        slug: kajian.slug,
        excerpt: kajian.excerpt,
        content: kajian.content,
        coverImage: kajian.coverImage,
        gallery: kajian.gallery,
        ustadz: kajian.ustadz,
        location: kajian.location,
        date: kajian.date,
        category: kajian.category,
        status: kajian.status,
        createdAt: kajian.createdAt,
        authorId: kajian.authorId,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(kajian)
      .leftJoin(users, eq(kajian.authorId, users.id))
      .orderBy(desc(kajian.createdAt));

    let result = await query;

    // Filter by status after query if needed
    if (status && status !== "all") {
      result = result.filter((k) => k.status === status);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET kajian error:", error);
    return NextResponse.json(
      { error: "Failed to fetch kajian", details: error.message },
      { status: 500 }
    );
  }
}

// POST remains the same...

// POST - Create new kajian (requires auth)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
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

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Insert with authorId from session
    const [newKajian] = await db
      .insert(kajian)
      .values({
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
        authorId: session.user.id,
      })
      .returning();

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "CREATE",
      entityType: "kajian",
      entityId: newKajian.id,
      description: `Membuat kajian baru: "${newKajian.title}"`,
      metadata: {
        newValue: {
          title: newKajian.title,
          status: newKajian.status,
          category: newKajian.category,
        },
      },
    });

    return NextResponse.json(newKajian, { status: 201 });
  } catch (error: any) {
    console.error("POST kajian error:", error);
    return NextResponse.json(
      { error: "Failed to create kajian", details: error.message },
      { status: 500 }
    );
  }
}
