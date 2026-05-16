import { NextRequest, NextResponse } from "next/server";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { kajian, kajianComments, kajianLikes } from "@/db/schema";

const LIKE_COOKIE = "sahabat_ilmu_like_id";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function getClientId(req: NextRequest) {
  const value = req.cookies.get(LIKE_COOKIE)?.value;

  if (!value || !/^[a-zA-Z0-9-]{20,80}$/.test(value)) {
    return null;
  }

  return value;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const [existingKajian] = await db
      .select({ id: kajian.id })
      .from(kajian)
      .where(eq(kajian.id, id))
      .limit(1);

    if (!existingKajian) {
      return NextResponse.json(
        { error: "Kajian tidak ditemukan" },
        { status: 404 }
      );
    }

    const clientId = getClientId(req);

    const [likeResult, comments, likedRows] = await Promise.all([
      db
        .select({ total: count() })
        .from(kajianLikes)
        .where(eq(kajianLikes.kajianId, id)),
      db
        .select({
          id: kajianComments.id,
          name: kajianComments.name,
          content: kajianComments.content,
          createdAt: kajianComments.createdAt,
        })
        .from(kajianComments)
        .where(eq(kajianComments.kajianId, id))
        .orderBy(desc(kajianComments.createdAt))
        .limit(50),
      clientId
        ? db
            .select({ id: kajianLikes.id })
            .from(kajianLikes)
            .where(
              and(
                eq(kajianLikes.kajianId, id),
                eq(kajianLikes.clientId, clientId)
              )
            )
            .limit(1)
        : Promise.resolve([]),
    ]);

    return NextResponse.json({
      likeCount: likeResult[0]?.total || 0,
      liked: likedRows.length > 0,
      comments,
    });
  } catch (error) {
    console.error("GET kajian engagement error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil komentar" },
      { status: 500 }
    );
  }
}
