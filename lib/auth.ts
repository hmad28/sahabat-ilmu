// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { loginOtpCodes, users } from "@/db/schema";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { logActivity } from "@/lib/activity-logger";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      role: "SUPER_ADMIN" | "AUTHOR";
      hasPassword: boolean;
    };
  }

  interface User {
    id: number;
    email: string;
    name: string;
    role: "SUPER_ADMIN" | "AUTHOR";
    hasPassword?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: "SUPER_ADMIN" | "AUTHOR";
    hasPassword: boolean;
  }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const fallbackNameFromEmail = (email: string) =>
  email.split("@")[0]?.replace(/[._-]+/g, " ").trim() || "Pengguna";

async function findOrCreateUserByEmail(email: string, name?: string | null) {
  const normalizedEmail = normalizeEmail(email);
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser) {
    return existingUser;
  }

  const [newUser] = await db
    .insert(users)
    .values({
      name: name?.trim() || fallbackNameFromEmail(normalizedEmail),
      email: normalizedEmail,
      password: null,
      role: "AUTHOR",
    })
    .returning();

  return newUser;
}

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email dan password harus diisi");
      }

      const email = normalizeEmail(credentials.email);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user?.password) {
        throw new Error("Gunakan Google atau kode email untuk akun ini");
      }

      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error("Email atau password salah");
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasPassword: true,
      };
    },
  }),
  CredentialsProvider({
    id: "email-otp",
    name: "Email OTP",
    credentials: {
      email: { label: "Email", type: "email" },
      code: { label: "Kode OTP", type: "text" },
    },
    async authorize(credentials) {
      const email = normalizeEmail(credentials?.email || "");
      const code = String(credentials?.code || "").trim();

      if (!email || !code) {
        throw new Error("Email dan kode OTP harus diisi");
      }

      if (!/^\d{6}$/.test(code)) {
        throw new Error("Kode OTP harus 6 digit");
      }

      const [otp] = await db
        .select()
        .from(loginOtpCodes)
        .where(
          and(
            eq(loginOtpCodes.email, email),
            isNull(loginOtpCodes.consumedAt),
            gt(loginOtpCodes.expiresAt, new Date())
          )
        )
        .orderBy(desc(loginOtpCodes.createdAt))
        .limit(1);

      if (!otp) {
        throw new Error("Kode OTP tidak valid atau sudah kedaluwarsa");
      }

      if (otp.attempts >= 5) {
        await db
          .update(loginOtpCodes)
          .set({ consumedAt: new Date() })
          .where(eq(loginOtpCodes.id, otp.id));

        throw new Error("Kode OTP sudah terlalu sering dicoba");
      }

      const isCodeValid = await bcrypt.compare(code, otp.codeHash);

      if (!isCodeValid) {
        await db
          .update(loginOtpCodes)
          .set({ attempts: otp.attempts + 1 })
          .where(eq(loginOtpCodes.id, otp.id));

        throw new Error("Kode OTP salah");
      }

      await db
        .update(loginOtpCodes)
        .set({ consumedAt: new Date() })
        .where(eq(loginOtpCodes.id, otp.id));

      const user = await findOrCreateUserByEmail(email);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasPassword: Boolean(user.password),
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const profileEmail =
          user.email || (profile as { email?: string } | undefined)?.email;

        if (!profileEmail) {
          return false;
        }

        const dbUser = await findOrCreateUserByEmail(profileEmail, user.name);

        user.id = dbUser.id;
        user.email = dbUser.email;
        user.name = dbUser.name;
        user.role = dbUser.role;
        user.hasPassword = Boolean(dbUser.password);
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.role = user.role;
        token.hasPassword = Boolean(user.hasPassword);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.hasPassword = Boolean(token.hasPassword);
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      const userId = Number(message.user?.id);

      if (message.user && Number.isFinite(userId)) {
        await logActivity({
          userId,
          action: "LOGIN",
          entityType: "auth",
          description: `${message.user.name} login ke sistem`,
          metadata: {
            email: message.user.email,
          },
        });
      }
    },
    async signOut(message) {
      const userId = Number(message?.token?.id || message?.token?.sub);

      if (Number.isFinite(userId)) {
        await logActivity({
          userId,
          action: "LOGOUT",
          entityType: "auth",
          description: "User logged out",
        });
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
