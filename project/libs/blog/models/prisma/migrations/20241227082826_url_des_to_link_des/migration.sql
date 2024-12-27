/*
  Warnings:

  - You are about to drop the column `urlDescription` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "urlDescription",
ADD COLUMN     "linkDescription" TEXT;
