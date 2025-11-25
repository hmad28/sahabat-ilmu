import { NextResponse } from "next/server";
import { db } from "@/db";
import { kajian } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const [foundKajian] = await db
      .select()
      .from(kajian)
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
