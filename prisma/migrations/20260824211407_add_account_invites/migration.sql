-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDIENTE', 'USADA', 'EXPIRADA', 'REVOCADA');

-- CreateTable
CREATE TABLE "account_invites" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "roleKey" "RoleKey" NOT NULL,
    "cellId" TEXT,
    "macroCellId" TEXT,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDIENTE',
    "createdById" TEXT NOT NULL,
    "usedByUserId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_invites_token_key" ON "account_invites"("token");
