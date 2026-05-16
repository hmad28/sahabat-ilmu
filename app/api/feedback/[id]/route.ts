import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { feedback } from "@/db/schema";
import { authOptions } from "@/lib/auth";

const statuses = ["new", "reviewed"] as const;

async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
    return null;
  }

  return session;
}

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSuperAdmin();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseId(idParam);

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const status = body?.status;

    if (!statuses.includes(status)) {
      return NextResponse.json(
        { error: "Status feedback tidak valid" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(feedback)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(feedback.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Feedback tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH feedback error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui feedback" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSuperAdmin();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseId(idParam);

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(feedback)
      .where(eq(feedback.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Feedback tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Feedback dihapus" });
  } catch (error) {
    console.error("DELETE feedback error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus feedback" },
      { status: 500 }
    );
  }
}
