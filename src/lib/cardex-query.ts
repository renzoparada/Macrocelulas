import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export const cardexInclude = {
  currentCell: { include: { macroCell: true, leader: { select: { name: true } } } },
  currentStage: true,
  invitedBy: { select: { id: true, firstName: true, lastNamePaternal: true } },
  invitedPeople: { select: { id: true, firstName: true, lastNamePaternal: true, registeredAt: true } },
  familyMemberships: { include: { relatedPerson: { select: { id: true, firstName: true, lastNamePaternal: true, photoUrl: true } } } },
  acceptedJesus: true,
  firstCellVisit: true,
  preEncounterClasses: { orderBy: { classNumber: "asc" } },
  postEncounterClasses: { orderBy: { classNumber: "asc" } },
  encounterRegs: { include: { encounter: true } },
  baptism: true,
  churchAttendance: true,
  lifeHistory: true,
  personalChallenges: { orderBy: { date: "desc" } },
  personalGoals: { orderBy: { date: "desc" } },
  dreams: { orderBy: { date: "desc" } },
  achievements: { orderBy: { date: "desc" } },
  testimonials: { orderBy: { date: "desc" } },
  discipleshipAsDisciple: { include: { mentor: { select: { firstName: true, lastNamePaternal: true } }, tools: { include: { tool: true } } }, orderBy: { date: "desc" } },
  developmentPlans: { orderBy: { createdAt: "desc" } },
  prayerRequests: { include: { updates: true, resolution: true }, orderBy: { createdAt: "desc" } },
  leadershipDevelopment: true,
  multiplicationsAsDisciple: { include: { leader: { select: { firstName: true, lastNamePaternal: true } } } },
  multiplicationsAsLeader: { include: { disciple: { select: { firstName: true, lastNamePaternal: true } } } },
  eventParticipations: { include: { event: true }, orderBy: { event: { date: "desc" } } },
  retreatParticipations: { include: { retreat: { include: { retreatType: true } } } },
  congressParticipations: { include: { congress: true } },
  fastingRecords: { orderBy: { startDate: "desc" } },
  tasks: { orderBy: { createdAt: "desc" } },
  timeline: { orderBy: { date: "desc" } },
  cellMemberships: { include: { cell: true }, orderBy: { joinedAt: "desc" } },
  cellHistory: { orderBy: { createdAt: "desc" } },
} satisfies Prisma.PersonInclude;

export type CardexPerson = Prisma.PersonGetPayload<{ include: typeof cardexInclude }>;

export async function getCardexPerson(id: string): Promise<CardexPerson | null> {
  return prisma.person.findUnique({ where: { id }, include: cardexInclude });
}
