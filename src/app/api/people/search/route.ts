import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json([], { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const people = await prisma.person.findMany({
    where: {
      OR: [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastNamePaternal: { contains: q, mode: "insensitive" } },
        { lastNameMaternal: { contains: q, mode: "insensitive" } },
        { documentId: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, firstName: true, lastNamePaternal: true, lastNameMaternal: true, photoUrl: true },
    take: 10,
  });

  return NextResponse.json(people.map((p) => ({ id: p.id, name: fullName(p), photoUrl: p.photoUrl })));
}
