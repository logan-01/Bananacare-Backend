/*
  Warnings:

  - A unique constraint covering the columns `[firebaseUID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "firebaseUID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUID_key" ON "public"."User"("firebaseUID");
