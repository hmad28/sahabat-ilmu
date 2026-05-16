import { NextRequest, NextResponse } from "next/server";
import { and, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { kajian, kajianLikes } from "@/db/schema";

const LIKE_COOKIE = "sahabat_ilmu_like_id";
const ONE_YEAR = 60 * 60 * 24 * 365;

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function getOrCreateClientId(req: NextRequest) {
  const value = req.cookies.get(LIKE_COOKIE)?.value;

  if (value && /^[a-zA-Z0-9-]{20,80}$/.test(value)) {
    return value;
  }

  return crypto.randomUUID();
}

function setClientCookie(res: NextResponse, clientId: string) {
  res.cookies.set(LIKE_COOKIE, clientId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });

  return res;
}

export async function POST(
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

    const clientId = getOrCreateClientId(req);
    const where = and(
      eq(kajianLikes.kajianId, id),
      eq(kajianLikes.clientId, clientId)
    );

    const [existingLike] = await db
      .select({ id: kajianLikes.id })
      .from(kajianLikes)
      .where(where)
      .limit(1);

    const liked = !existingLike;

    if (existingLike) {
      await db.delete(kajianLikes).where(where);
    } else {
      await db.insert(kajianLikes).values({
        kajianId: id,
        clientId,
      });
    }

    const [{ total }] = await db
      .select({ total: count() })
      .from(kajianLikes)
      .where(eq(kajianLikes.kajianId, id));

    return setClientCookie(
      NextResponse.json({
        liked,
        likeCount: total,
      }),
      clientId
    );
  } catch (error) {
    console.error("POST kajian like error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan like" },
      { status: 500 }
    );
  }
}
