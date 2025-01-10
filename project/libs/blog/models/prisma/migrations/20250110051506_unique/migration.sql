/*
  Warnings:

  - A unique constraint covering the columns `[post_id,user_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reposted_post_id,user_id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[author_user_id,user_id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "likes_post_id_user_id_key" ON "likes"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_reposted_post_id_user_id_key" ON "posts"("reposted_post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_author_user_id_user_id_key" ON "subscriptions"("author_user_id", "user_id");
