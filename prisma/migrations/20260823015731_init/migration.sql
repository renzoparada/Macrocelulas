-- CreateEnum
CREATE TYPE "RoleKey" AS ENUM ('ADMIN', 'LIDER_MACRO', 'LIDER_CELULA', 'CO_LIDER', 'LIDER_FORMACION', 'SUPERVISOR');

-- CreateEnum
CREATE TYPE "CellStatus" AS ENUM ('ACTIVA', 'EN_FORMACION', 'EN_ALERTA', 'INACTIVA', 'MULTIPLICADA');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MASCULINO', 'FEMENINO');

-- CreateEnum
CREATE TYPE "PersonStatus" AS ENUM ('ACTIVO', 'INACTIVO', 'EN_RIESGO', 'RETIRADO');

-- CreateEnum
CREATE TYPE "HowArrived" AS ENUM ('INVITACION_PERSONAL', 'INVITACION_MIEMBRO', 'INVITACION_LIDER', 'IGLESIA', 'EVENTO', 'CONGRESO', 'ENCUENTRO', 'REDES_SOCIALES', 'CAMPANA', 'OTRO');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('CONYUGE', 'HIJO', 'PADRE', 'MADRE', 'HERMANO', 'OTRO');

-- CreateEnum
CREATE TYPE "EncounterType" AS ENUM ('ENCUENTRO', 'RE_ENCUENTRO', 'ENCUENTRO_RESCATE', 'RETIRO_LIDERAZGO', 'RETIRO_FAMILIAR', 'RETIRO_JUVENIL', 'OTRO');

-- CreateEnum
CREATE TYPE "EventParticipantRole" AS ENUM ('PARTICIPANTE', 'INVITADO', 'NUEVO');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('ABIERTO', 'EN_SEGUIMIENTO', 'MEJORANDO', 'RESUELTO', 'CERRADO');

-- CreateEnum
CREATE TYPE "DreamHorizon" AS ENUM ('CORTO_PLAZO', 'MEDIANO_PLAZO', 'LARGO_PLAZO');

-- CreateEnum
CREATE TYPE "MultiplicationStage" AS ENUM ('DISCIPULO', 'LIDER_EN_FORMACION', 'CO_LIDER', 'LIDER', 'NUEVA_CELULA');

-- CreateEnum
CREATE TYPE "PrayerStatus" AS ENUM ('ACTIVO', 'RESUELTO', 'DESACTIVADO');

-- CreateEnum
CREATE TYPE "PrayerPriority" AS ENUM ('URGENTE', 'IMPORTANTE', 'NORMAL');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('LLAMAR', 'WHATSAPP', 'VISITAR', 'INVITAR', 'SEGUIMIENTO', 'DISCIPULADO', 'INVITAR_ENCUENTRO', 'CONTACTAR_FAMILIAR');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "key" "RoleKey" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "module" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "roleId" TEXT NOT NULL,
    "personId" TEXT,
    "macroCellId" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "macro_cells" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "leaderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "macro_cells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cells" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "macroCellId" TEXT NOT NULL,
    "leaderId" TEXT,
    "coLeaderId" TEXT,
    "foundedAt" TIMESTAMP(3),
    "meetingDay" TEXT,
    "meetingTime" TEXT,
    "address" TEXT,
    "location" TEXT,
    "status" "CellStatus" NOT NULL DEFAULT 'ACTIVA',
    "parentCellId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" TEXT NOT NULL,
    "photoUrl" TEXT,
    "firstName" TEXT NOT NULL,
    "lastNamePaternal" TEXT NOT NULL,
    "lastNameMaternal" TEXT,
    "birthDate" TIMESTAMP(3),
    "sex" "Sex",
    "documentId" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "zone" TEXT,
    "occupation" TEXT,
    "company" TEXT,
    "socialMedia" TEXT,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PersonStatus" NOT NULL DEFAULT 'ACTIVO',
    "currentCellId" TEXT,
    "currentStageId" TEXT,
    "howArrived" "HowArrived",
    "originDetail" TEXT,
    "invitedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "families" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_relationships" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "relatedPersonId" TEXT NOT NULL,
    "relationType" "RelationType" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "family_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cell_memberships" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "cellId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MIEMBRO',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cell_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cell_change_history" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "previousCellId" TEXT,
    "newCellId" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "leftAt" TIMESTAMP(3),
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cell_change_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "cellId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "isGuest" BOOLEAN NOT NULL DEFAULT false,
    "absenceReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_reports" (
    "id" TEXT NOT NULL,
    "cellId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "leaderName" TEXT,
    "place" TEXT,
    "membersCount" INTEGER NOT NULL DEFAULT 0,
    "attendeesCount" INTEGER NOT NULL DEFAULT 0,
    "newCount" INTEGER NOT NULL DEFAULT 0,
    "guestsCount" INTEGER NOT NULL DEFAULT 0,
    "visitorsCount" INTEGER NOT NULL DEFAULT 0,
    "absentCount" INTEGER NOT NULL DEFAULT 0,
    "activity" TEXT,
    "notes" TEXT,
    "photoUrl" TEXT,
    "evidenceUrl" TEXT,
    "attendancePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_stages" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "process_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_process" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "achievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "person_process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_timeline" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "person_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accepted_jesus" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "place" TEXT,
    "accompaniedBy" TEXT,
    "notes" TEXT,
    "testimony" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accepted_jesus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "first_cell_visits" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cellName" TEXT,
    "leaderName" TEXT,
    "broughtBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "first_cell_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "invitedId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "howArrived" "HowArrived",
    "eventSource" TEXT,
    "cellId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_encounter_classes" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "classNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "pre_encounter_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encounters" (
    "id" TEXT NOT NULL,
    "type" "EncounterType" NOT NULL DEFAULT 'ENCUENTRO',
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "place" TEXT,
    "capacity" INTEGER,
    "responsibleName" TEXT,
    "requirements" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "encounters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encounter_registrations" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "cellId" TEXT,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "attended" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "encounter_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_encounter_classes" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "classNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "post_encounter_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "baptisms" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "place" TEXT,
    "responsibleName" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "baptisms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "church_attendance" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "attends" BOOLEAN NOT NULL DEFAULT true,
    "churchName" TEXT,
    "congregation" TEXT,
    "frequency" TEXT,
    "lastAttendance" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "church_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retreat_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "retreat_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retreats" (
    "id" TEXT NOT NULL,
    "retreatTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "place" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retreats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retreat_participants" (
    "id" TEXT NOT NULL,
    "retreatId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "retreat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "congresses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "place" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "congresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "congress_participants" (
    "id" TEXT NOT NULL,
    "congressId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "inscription" BOOLEAN NOT NULL DEFAULT false,
    "confirmation" BOOLEAN NOT NULL DEFAULT false,
    "attendance" BOOLEAN NOT NULL DEFAULT false,
    "participationType" TEXT,
    "notes" TEXT,

    CONSTRAINT "congress_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "objective" TEXT,
    "responsibleName" TEXT,
    "cellId" TEXT,
    "results" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_participants" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" "EventParticipantRole" NOT NULL DEFAULT 'PARTICIPANTE',
    "returned" BOOLEAN NOT NULL DEFAULT false,
    "joinedCell" BOOLEAN NOT NULL DEFAULT false,
    "startedProcess" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "event_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fasting_records" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "type" TEXT,
    "participation" TEXT,
    "notes" TEXT,

    CONSTRAINT "fasting_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spiritual_activities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spiritual_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discipleship_sessions" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discipleId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "situation" TEXT,
    "objective" TEXT,
    "conversation" TEXT,
    "commitments" TEXT,
    "nextStep" TEXT,
    "followUpDate" TIMESTAMP(3),
    "result" TEXT,
    "privateNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discipleship_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discipleship_tools" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discipleship_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discipleship_session_tools" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,

    CONSTRAINT "discipleship_session_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_plans" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EN_PROCESO',
    "startDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "development_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "life_histories" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "history" TEXT,
    "background" TEXT,
    "currentSituation" TEXT,
    "strengths" TEXT,
    "developmentAreas" TEXT,
    "gifts" TEXT,
    "talents" TEXT,
    "skills" TEXT,
    "purpose" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "life_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_challenges" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" TEXT NOT NULL DEFAULT 'MEDIA',
    "responsibleName" TEXT,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'ABIERTO',
    "actions" TEXT,
    "followUp" TEXT,
    "result" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_goals" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetDate" TIMESTAMP(3),
    "priority" TEXT NOT NULL DEFAULT 'MEDIA',
    "responsibleName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EN_PROCESO',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dreams" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "dream" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horizon" "DreamHorizon" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',
    "nextStep" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dreams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "achievement" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,
    "description" TEXT,
    "evidenceUrl" TEXT,
    "registeredByName" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "before" TEXT,
    "process" TEXT,
    "after" TEXT,
    "whatGodDid" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "authorizedToShare" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_development" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "strengths" TEXT,
    "growthAreas" TEXT,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leadership_development_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leadership_multiplication" (
    "id" TEXT NOT NULL,
    "leaderId" TEXT NOT NULL,
    "discipleId" TEXT NOT NULL,
    "newLeaderId" TEXT,
    "newCellId" TEXT,
    "stage" "MultiplicationStage" NOT NULL DEFAULT 'DISCIPULO',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leadership_multiplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_requests" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" "PrayerPriority" NOT NULL DEFAULT 'NORMAL',
    "responsibleName" TEXT,
    "notes" TEXT,
    "status" "PrayerStatus" NOT NULL DEFAULT 'ACTIVO',
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedDate" TIMESTAMP(3),
    "deactivatedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "prayer_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_request_updates" (
    "id" TEXT NOT NULL,
    "prayerRequestId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT NOT NULL,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_request_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_request_resolutions" (
    "id" TEXT NOT NULL,
    "prayerRequestId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testimony" TEXT,
    "notes" TEXT,
    "registeredByName" TEXT,
    "becameTestimonial" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_request_resolutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "createdById" TEXT,
    "type" "TaskType" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDIENTE',
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "recordId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_key_key" ON "roles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_personId_key" ON "users"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "cells_number_key" ON "cells"("number");

-- CreateIndex
CREATE INDEX "people_lastNamePaternal_firstName_idx" ON "people"("lastNamePaternal", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_cellId_personId_date_key" ON "attendance"("cellId", "personId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_reports_cellId_date_key" ON "attendance_reports"("cellId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "process_stages_key_key" ON "process_stages"("key");

-- CreateIndex
CREATE UNIQUE INDEX "accepted_jesus_personId_key" ON "accepted_jesus"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "first_cell_visits_personId_key" ON "first_cell_visits"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "pre_encounter_classes_personId_classNumber_key" ON "pre_encounter_classes"("personId", "classNumber");

-- CreateIndex
CREATE UNIQUE INDEX "encounter_registrations_encounterId_personId_key" ON "encounter_registrations"("encounterId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "post_encounter_classes_personId_classNumber_key" ON "post_encounter_classes"("personId", "classNumber");

-- CreateIndex
CREATE UNIQUE INDEX "baptisms_personId_key" ON "baptisms"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "church_attendance_personId_key" ON "church_attendance"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "retreat_types_name_key" ON "retreat_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "retreat_participants_retreatId_personId_key" ON "retreat_participants"("retreatId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "congress_participants_congressId_personId_key" ON "congress_participants"("congressId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "event_participants_eventId_personId_key" ON "event_participants"("eventId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "discipleship_session_tools_sessionId_toolId_key" ON "discipleship_session_tools"("sessionId", "toolId");

-- CreateIndex
CREATE UNIQUE INDEX "life_histories_personId_key" ON "life_histories"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "leadership_development_personId_key" ON "leadership_development"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_request_resolutions_prayerRequestId_key" ON "prayer_request_resolutions"("prayerRequestId");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_macroCellId_fkey" FOREIGN KEY ("macroCellId") REFERENCES "macro_cells"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "macro_cells" ADD CONSTRAINT "macro_cells_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cells" ADD CONSTRAINT "cells_macroCellId_fkey" FOREIGN KEY ("macroCellId") REFERENCES "macro_cells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cells" ADD CONSTRAINT "cells_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cells" ADD CONSTRAINT "cells_coLeaderId_fkey" FOREIGN KEY ("coLeaderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cells" ADD CONSTRAINT "cells_parentCellId_fkey" FOREIGN KEY ("parentCellId") REFERENCES "cells"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_currentCellId_fkey" FOREIGN KEY ("currentCellId") REFERENCES "cells"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_currentStageId_fkey" FOREIGN KEY ("currentStageId") REFERENCES "process_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_relationships" ADD CONSTRAINT "family_relationships_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_relationships" ADD CONSTRAINT "family_relationships_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_relationships" ADD CONSTRAINT "family_relationships_relatedPersonId_fkey" FOREIGN KEY ("relatedPersonId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cell_memberships" ADD CONSTRAINT "cell_memberships_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cell_memberships" ADD CONSTRAINT "cell_memberships_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cell_change_history" ADD CONSTRAINT "cell_change_history_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_reports" ADD CONSTRAINT "attendance_reports_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "cells"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_process" ADD CONSTRAINT "person_process_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_process" ADD CONSTRAINT "person_process_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "process_stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_timeline" ADD CONSTRAINT "person_timeline_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accepted_jesus" ADD CONSTRAINT "accepted_jesus_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "first_cell_visits" ADD CONSTRAINT "first_cell_visits_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedId_fkey" FOREIGN KEY ("invitedId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "cells"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_encounter_classes" ADD CONSTRAINT "pre_encounter_classes_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encounter_registrations" ADD CONSTRAINT "encounter_registrations_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encounter_registrations" ADD CONSTRAINT "encounter_registrations_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encounter_registrations" ADD CONSTRAINT "encounter_registrations_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "cells"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_encounter_classes" ADD CONSTRAINT "post_encounter_classes_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baptisms" ADD CONSTRAINT "baptisms_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "church_attendance" ADD CONSTRAINT "church_attendance_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retreats" ADD CONSTRAINT "retreats_retreatTypeId_fkey" FOREIGN KEY ("retreatTypeId") REFERENCES "retreat_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retreat_participants" ADD CONSTRAINT "retreat_participants_retreatId_fkey" FOREIGN KEY ("retreatId") REFERENCES "retreats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retreat_participants" ADD CONSTRAINT "retreat_participants_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "congress_participants" ADD CONSTRAINT "congress_participants_congressId_fkey" FOREIGN KEY ("congressId") REFERENCES "congresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "congress_participants" ADD CONSTRAINT "congress_participants_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "cells"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fasting_records" ADD CONSTRAINT "fasting_records_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discipleship_sessions" ADD CONSTRAINT "discipleship_sessions_discipleId_fkey" FOREIGN KEY ("discipleId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discipleship_sessions" ADD CONSTRAINT "discipleship_sessions_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discipleship_session_tools" ADD CONSTRAINT "discipleship_session_tools_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "discipleship_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discipleship_session_tools" ADD CONSTRAINT "discipleship_session_tools_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "discipleship_tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "life_histories" ADD CONSTRAINT "life_histories_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_challenges" ADD CONSTRAINT "personal_challenges_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_goals" ADD CONSTRAINT "personal_goals_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dreams" ADD CONSTRAINT "dreams_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leadership_development" ADD CONSTRAINT "leadership_development_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leadership_multiplication" ADD CONSTRAINT "leadership_multiplication_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leadership_multiplication" ADD CONSTRAINT "leadership_multiplication_discipleId_fkey" FOREIGN KEY ("discipleId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leadership_multiplication" ADD CONSTRAINT "leadership_multiplication_newLeaderId_fkey" FOREIGN KEY ("newLeaderId") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_requests" ADD CONSTRAINT "prayer_requests_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_request_updates" ADD CONSTRAINT "prayer_request_updates_prayerRequestId_fkey" FOREIGN KEY ("prayerRequestId") REFERENCES "prayer_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_request_resolutions" ADD CONSTRAINT "prayer_request_resolutions_prayerRequestId_fkey" FOREIGN KEY ("prayerRequestId") REFERENCES "prayer_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
