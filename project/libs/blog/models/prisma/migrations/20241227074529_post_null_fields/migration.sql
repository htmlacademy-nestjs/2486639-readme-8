-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "previewText" DROP NOT NULL,
ALTER COLUMN "text" DROP NOT NULL,
ALTER COLUMN "quoteText" DROP NOT NULL,
ALTER COLUMN "quoteAuthor" DROP NOT NULL,
ALTER COLUMN "imagePath" DROP NOT NULL,
ALTER COLUMN "urlDescription" DROP NOT NULL;