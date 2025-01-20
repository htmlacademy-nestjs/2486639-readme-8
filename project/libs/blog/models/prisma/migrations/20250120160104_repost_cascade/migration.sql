-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_reposted_post_id_fkey";

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_reposted_post_id_fkey" FOREIGN KEY ("reposted_post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
