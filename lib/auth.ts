// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity-logger";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      role: "SUPER_ADMIN" | "AUTHOR";
    };
  }

  interface User {
    id: number;
    email: string;
    name: string;
    role: "SUPER_ADMIN" | "AUTHOR";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: "SUPER_ADMIN" | "AUTHOR";
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
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

        // Cari user berdasarkan email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (!user) {
          throw new Error("Email atau password salah");
        }

        // Verifikasi password
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
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      // Log successful login
      await logActivity({
        userId: token.id,
        action: "LOGIN",
        entityType: "auth",
        description: `${session.user.name} login ke sistem`,
        metadata: {
          email: session.user.email,
        },
      });

      return session;
    },
  },
  events: {
  async signOut(message) {
    const userId = message?.token?.sub;

    if (userId) {
      await logActivity({
        userId: Number(userId),
        action: "LOGOUT",
        description: "User logged out",
        entityType: "auth",
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
