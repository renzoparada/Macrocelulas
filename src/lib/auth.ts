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
      scopedCellIds: string[];
    };
  }
  interface User {
    role?: RoleKey;
    roleLabel?: string;
    macroCellId?: string | null;
    personId?: string | null;
    ledCellIds?: string[];
    scopedCellIds?: string[];
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
          include: {
            role: true,
            ledCells: { select: { id: true } },
            coLedCells: { select: { id: true } },
          },
        });
        if (!user || !user.active) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        const ledCellIds = user.ledCells.map((c) => c.id);
        const coLedCellIds = user.coLedCells.map((c) => c.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.key,
          roleLabel: user.role.name,
          macroCellId: user.macroCellId,
          personId: user.personId,
          ledCellIds,
          scopedCellIds: Array.from(new Set([...ledCellIds, ...coLedCellIds])),
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
        scopedCellIds?: string[];
      };
      if (user) {
        t.role = user.role;
        t.roleLabel = user.roleLabel;
        t.macroCellId = user.macroCellId ?? null;
        t.personId = user.personId ?? null;
        t.ledCellIds = user.ledCellIds ?? [];
        t.scopedCellIds = user.scopedCellIds ?? [];
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
        session.user.scopedCellIds = (token.scopedCellIds as string[]) ?? [];
      }
      return session;
    },
  },
});
