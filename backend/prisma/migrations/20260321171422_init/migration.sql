-- CreateEnum
CREATE TYPE "HiveStatus" AS ENUM ('active', 'inactive', 'quarantine', 'lost');

-- CreateEnum
CREATE TYPE "QueenOrigin" AS ENUM ('purchased', 'raised', 'swarm', 'unknown');

-- CreateEnum
CREATE TYPE "BroodPattern" AS ENUM ('excellent', 'good', 'fair', 'poor');

-- CreateEnum
CREATE TYPE "Temperament" AS ENUM ('calm', 'normal', 'aggressive');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('healthy', 'weak', 'sick', 'critical');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apiaries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "notes" TEXT,
    "hive_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hives" (
    "id" TEXT NOT NULL,
    "apiary_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "HiveStatus" NOT NULL DEFAULT 'active',
    "queen_origin" "QueenOrigin" NOT NULL DEFAULT 'unknown',
    "population" INTEGER,
    "frames" INTEGER,
    "installed_at" TIMESTAMP(3),
    "notes" TEXT,
    "last_inspection" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspections" (
    "id" TEXT NOT NULL,
    "hive_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "queen_seen" BOOLEAN NOT NULL DEFAULT false,
    "brood_pattern" "BroodPattern",
    "temperament" "Temperament",
    "weight" DOUBLE PRECISION,
    "varroa_count" INTEGER,
    "activity_level" "ActivityLevel",
    "health_status" "HealthStatus" NOT NULL DEFAULT 'healthy',
    "diseases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "treatment_applied" BOOLEAN NOT NULL DEFAULT false,
    "treatment_product" TEXT,
    "treatment_dose" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productions" (
    "id" TEXT NOT NULL,
    "hive_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "honey_kg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wax_kg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "propolis_g" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "hive_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" DATE NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hives_code_key" ON "hives"("code");

-- CreateIndex
CREATE INDEX "hives_apiary_id_idx" ON "hives"("apiary_id");

-- CreateIndex
CREATE INDEX "hives_status_idx" ON "hives"("status");

-- CreateIndex
CREATE INDEX "inspections_hive_id_idx" ON "inspections"("hive_id");

-- CreateIndex
CREATE INDEX "inspections_date_idx" ON "inspections"("date");

-- CreateIndex
CREATE INDEX "inspections_health_status_idx" ON "inspections"("health_status");

-- CreateIndex
CREATE INDEX "productions_hive_id_idx" ON "productions"("hive_id");

-- CreateIndex
CREATE INDEX "productions_date_idx" ON "productions"("date");

-- CreateIndex
CREATE INDEX "tasks_hive_id_idx" ON "tasks"("hive_id");

-- CreateIndex
CREATE INDEX "tasks_due_date_idx" ON "tasks"("due_date");

-- CreateIndex
CREATE INDEX "tasks_completed_idx" ON "tasks"("completed");

-- CreateIndex
CREATE INDEX "tasks_priority_idx" ON "tasks"("priority");

-- AddForeignKey
ALTER TABLE "apiaries" ADD CONSTRAINT "apiaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hives" ADD CONSTRAINT "hives_apiary_id_fkey" FOREIGN KEY ("apiary_id") REFERENCES "apiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_hive_id_fkey" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productions" ADD CONSTRAINT "productions_hive_id_fkey" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_hive_id_fkey" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE SET NULL ON UPDATE CASCADE;
