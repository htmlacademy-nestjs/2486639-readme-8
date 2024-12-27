/*
  Warnings:

  - You are about to drop the column `is_repost` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "is_repost",
ADD COLUMN     "reposted_post_id" TEXT;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_reposted_post_id_fkey" FOREIGN KEY ("reposted_post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
