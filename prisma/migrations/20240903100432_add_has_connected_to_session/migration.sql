/*
  Warnings:

  - You are about to drop the column `hasConnected` on the `AssociatedUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssociatedUser" DROP COLUMN "hasConnected";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "hasConnected" BOOLEAN NOT NULL DEFAULT false;
