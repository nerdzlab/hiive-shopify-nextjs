/*
  Warnings:

  - Added the required column `hasConnected` to the `AssociatedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssociatedUser" ADD COLUMN     "hasConnected" BOOLEAN NOT NULL;
