import { randomInt } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { loginOtpCodes } from "@/db/schema";
import { sendOtpEmail } from "@/lib/email";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    let body: { email?: unknown };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Body JSON tidak valid" },
        { status: 400 }
      );
    }

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email tidak valid" },
        { status: 400 }
      );
    }

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const [recentCode] = await db
      .select({ id: loginOtpCodes.id })
      .from(loginOtpCodes)
      .where(
        and(
          eq(loginOtpCodes.email, email),
          isNull(loginOtpCodes.consumedAt),
          gt(loginOtpCodes.createdAt, oneMinuteAgo)
        )
      )
      .limit(1);

    if (recentCode) {
      return NextResponse.json(
        { error: "Tunggu sebentar sebelum meminta kode baru" },
        { status: 429 }
      );
    }

    const code = String(randomInt(100000, 1000000));
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const [otp] = await db
      .insert(loginOtpCodes)
      .values({
        email,
        codeHash,
        expiresAt,
      })
      .returning({ id: loginOtpCodes.id });

    try {
      await sendOtpEmail({ to: email, code });
    } catch (error) {
      await db
        .update(loginOtpCodes)
        .set({ consumedAt: new Date() })
        .where(eq(loginOtpCodes.id, otp.id));

      throw error;
    }

    return NextResponse.json({
      message: "Kode OTP sudah dikirim",
      expiresInMinutes: 10,
    });
  } catch (error) {
    console.error("OTP request error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim kode OTP" },
      { status: 500 }
    );
  }
}
