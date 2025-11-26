// app/api/profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { logActivity, formatChanges } from "@/lib/activity-logger";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, currentPassword, newPassword } = body;

    // Validasi input
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Nama tidak boleh kosong" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Nama terlalu panjang (maksimal 100 karakter)" },
        { status: 400 }
      );
    }

    // Ambil data user saat ini
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Tambahkan ini
    let description = "";
    let changes: Record<string, any> = {};

    // Jika ingin mengubah password
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password baru minimal 6 karakter" },
          { status: 400 }
        );
      }

      if (!currentPassword) {
        return NextResponse.json(
          { error: "Password lama harus diisi" },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Password lama tidak sesuai" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db
        .update(users)
        .set({
          name: name.trim(),
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));

      description = `Mengupdate profil dan password`;
      changes = {
        name: { from: user.name, to: name.trim() },
        password: { from: "***", to: "*** (changed)" },
      };
    } else {
      // Hanya update nama
      await db
        .update(users)
        .set({
          name: name.trim(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));

      description = `Mengupdate nama profil`;
      if (user.name !== name.trim()) {
        changes = {
          name: { from: user.name, to: name.trim() },
        };
      }
    }

    // Log activity
    await logActivity({
      userId: session.user.id,
      action: "PROFILE_UPDATE",
      entityType: "profile",
      entityId: session.user.id,
      description,
      metadata: {
        changes: Object.keys(changes).length > 0 ? changes : undefined,
      },
    });

    return NextResponse.json({
      message: newPassword
        ? "Profil dan password berhasil diperbarui"
        : "Profil berhasil diperbarui",
      user: {
        id: user.id,
        name: name.trim(),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui profil" },
      { status: 500 }
    );
  }
}