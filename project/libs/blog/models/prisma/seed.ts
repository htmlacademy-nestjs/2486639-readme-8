import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { MOCK_COMMENTS, MOCK_POSTS, MOCK_SUBSCRIPTIONS, MOCK_TAGS } from '../../../../mocks/blog';

async function seedDb(prismaClient: PrismaClient) {
  for (const tag of MOCK_TAGS) {
    const { id, title } = tag

    await prismaClient.tag.upsert({
      where: { id },
      update: {},
      create: { id, title }
    });
  }

  for (const post of MOCK_POSTS) {
    const {
      id,
      type,
      tags,
      state,
      title,
      url,
      previewText,
      text,
      quoteText,
      quoteAuthor,
      imagePath,
      linkDescription,
      userId
    } = post;

    await prismaClient.post.upsert({
      where: { id },
      update: {},
      create: {
        id,
        type,
        tags: { connect: tags },
        state,
        title,
        url,
        previewText,
        text,
        quoteText,
        quoteAuthor,
        imagePath,
        linkDescription,
        userId
      }
    });
  }

  for (const comment of MOCK_COMMENTS) {
    const { id, message, postId, userId } = comment;

    await prismaClient.comment.upsert({
      where: { id },
      update: {},
      create: { id, message, postId, userId }
    });
  }

  for (const subscription of MOCK_SUBSCRIPTIONS) {
    const { id } = subscription;
    const authorUserId: string = subscription.authorUserId as string;
    const userId: string = subscription.userId as string;

    await prismaClient.subscription.upsert({
      where: { id },
      update: {},
      create: { id, authorUserId, userId }
    });
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
