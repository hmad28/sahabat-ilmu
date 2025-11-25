import { NextResponse } from "next/server";
import { db } from "@/db";
import { kajian, users } from "@/db/schema"; // Import users table
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const [foundKajian] = await db
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
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(kajian)
      .leftJoin(users, eq(kajian.authorId, users.id)) // Sesuaikan dengan nama kolom FK Anda
      .where(eq(kajian.slug, slug))
      .limit(1);

    if (!foundKajian) {
      return NextResponse.json(
        { error: "Kajian tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(foundKajian);
  } catch (error) {
    console.error("Error fetching kajian by slug:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kajian" },
      { status: 500 }
    );
  }
}
