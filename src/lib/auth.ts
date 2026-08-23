import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { RoleKey } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: RoleKey;
      roleLabel: string;
      macroCellId: string | null;
      personId: string | null;
      ledCellIds: string[];
    };
  }
  interface User {
    role?: RoleKey;
    roleLabel?: string;
    macroCellId?: string | null;
    personId?: string | null;
    ledCellIds?: string[];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          include: { role: true, ledCells: { select: { id: true } } },
        });
        if (!user || !user.active) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.key,
          roleLabel: user.role.name,
          macroCellId: user.macroCellId,
          personId: user.personId,
          ledCellIds: user.ledCells.map((c) => c.id),
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const t = token as typeof token & {
        role?: RoleKey;
        roleLabel?: string;
        macroCellId?: string | null;
        personId?: string | null;
        ledCellIds?: string[];
      };
      if (user) {
        t.role = user.role;
        t.roleLabel = user.roleLabel;
        t.macroCellId = user.macroCellId ?? null;
        t.personId = user.personId ?? null;
        t.ledCellIds = user.ledCellIds ?? [];
      }
      return t;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as RoleKey;
        session.user.roleLabel = token.roleLabel as string;
        session.user.macroCellId = (token.macroCellId as string | null) ?? null;
        session.user.personId = (token.personId as string | null) ?? null;
        session.user.ledCellIds = (token.ledCellIds as string[]) ?? [];
      }
      return session;
    },
  },
});
