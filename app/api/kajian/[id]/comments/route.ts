import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { kajian, kajianComments } from "@/db/schema";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
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

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Format komentar tidak valid" },
        { status: 400 }
      );
    }

    if (cleanText(body.website, 120)) {
      return NextResponse.json(
        { message: "Komentar berhasil dikirim" },
        { status: 201 }
      );
    }

    const name = cleanText(body.name, 100);
    const content = cleanText(body.content, 1000);

    if (name.length < 2) {
      return NextResponse.json(
        { error: "Nama minimal 2 karakter" },
        { status: 400 }
      );
    }

    if (content.length < 3) {
      return NextResponse.json(
        { error: "Komentar minimal 3 karakter" },
        { status: 400 }
      );
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

    const [created] = await db
      .insert(kajianComments)
      .values({
        kajianId: id,
        name,
        content,
      })
      .returning({
        id: kajianComments.id,
        name: kajianComments.name,
        content: kajianComments.content,
        createdAt: kajianComments.createdAt,
      });

    return NextResponse.json(
      {
        message: "Komentar berhasil dikirim",
        comment: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST kajian comment error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengirim komentar" },
      { status: 500 }
    );
  }
}
