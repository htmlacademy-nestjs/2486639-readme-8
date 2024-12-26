import { PrismaClient } from '@prisma/client';

// это отдельный скрипт, он не может импортировать '@project/share/core'
// eslint-disable-next-line
import { PostState, PostType } from '../../../shared/core/src';

const USER_IDS = ['658170cbb954e9f5b905ccf4', '6581762309c030b503e30512'];

const TAGS = [
  { id: '2067063f-8dc2-42bc-bb5f-84bce5caa9fd', title: 'tag1' },
  { id: '8392ec79-66b5-4fe5-b3b8-170ff8156b1b', title: 'tag2' },
  { id: '3fa161f7-c66c-409e-a5d5-1a159c84ad81', title: 'tag3' },
  { id: '48568f914-0595-4ffe-a1e2-b333b1eb3275', title: 'tag4' }
];

const POSTS = [
  {
    id: '129f97f2-9b77-499a-a740-156c4b881a44',
    type: PostType.Video,
    tags: [TAGS[0], TAGS[1]],
    state: PostState.Published,
    title: 'Post1',
    url: '',
    previewText: '',
    text: '',
    quoteText: '',
    quoteAuthor: '',
    imagePath: '',
    urlDescription: '',
    userId: USER_IDS[0]
  },
  {
    id: '9059dee5-7897-46d3-b8f6-e075a8b568c0',
    type: PostType.Video,
    tags: [TAGS[0], TAGS[1]],
    state: PostState.Published,
    title: 'Post1',
    url: '',
    previewText: '',
    text: '',
    quoteText: '',
    quoteAuthor: '',
    imagePath: '',
    urlDescription: '',
    userId: USER_IDS[0]
  },
  {
    id: 'eab06dc6-ba52-4169-a369-f2f825d44ebb',
    type: PostType.Video,
    tags: [TAGS[0], TAGS[1]],
    state: PostState.Published,
    title: 'Post1',
    url: '',
    previewText: '',
    text: '',
    quoteText: '',
    quoteAuthor: '',
    imagePath: '',
    urlDescription: '',
    userId: USER_IDS[0]
  }
];

const COMMENTS = [
  {
    id: '79668254-2673-4f8b-9bda-f3b726a466dd',
    message: 'comment1',
    postId: POSTS[0].id,
    userId: USER_IDS[0]
  },
  {
    id: 'f08feedf-59a8-48a5-9001-4db53173f06c',
    message: 'comment2',
    postId: POSTS[1].id,
    userId: USER_IDS[0]
  },
  {
    id: '660be995-82b7-4eed-be0d-dd317d730c8e',
    message: 'comment3',
    postId: POSTS[1].id,
    userId: USER_IDS[1]
  }
];

const SUBSCRIPTIONS = [{ id: '06024a6d-2fce-414f-8724-22b648c1293a', authorUserId: USER_IDS[0], userId: USER_IDS[1] }];

async function seedDb(prismaClient: PrismaClient) {
  for (const tag of TAGS) {
    const { id, title } = tag

    await prismaClient.tag.upsert({
      where: { id },
      update: {},
      create: { id, title }
    });
  }

  for (const post of POSTS) {
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
      urlDescription,
      userId
    } = post

    await prismaClient.post.upsert({
      where: { id },
      update: {},
      create: {
        id,
        type,
        tags: { connect: [...tags] },
        state,
        title,
        url,
        previewText,
        text,
        quoteText,
        quoteAuthor,
        imagePath,
        urlDescription,
        userId
      }
    });
  }

  for (const comment of COMMENTS) {
    const { id, message, postId, userId } = comment;

    await prismaClient.comment.upsert({
      where: { id },
      update: {},
      create: { id, message, postId, userId }
    });
  }

  for (const subscription of SUBSCRIPTIONS) {
    const { id, authorUserId, userId } = subscription

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
