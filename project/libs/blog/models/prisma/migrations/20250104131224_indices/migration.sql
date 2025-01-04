-- DropIndex
DROP INDEX "posts_title_idx";

-- CreateIndex
CREATE INDEX "posts_type_idx" ON "posts"("type");

-- CreateIndex
CREATE INDEX "posts_publish_date_idx" ON "posts"("publish_date");

-- CreateIndex
CREATE INDEX "posts_state_idx" ON "posts"("state");

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");
