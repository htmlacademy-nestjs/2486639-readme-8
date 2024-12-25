import { PrismaClient } from '@prisma/client';

const USER_IDS = ['658170cbb954e9f5b905ccf4', '6581762309c030b503e30512'];

const TAGS = [
  { id: '2067063f-8dc2-42bc-bb5f-84bce5caa9fd', title: 'tag1' },
  { id: '8392ec79-66b5-4fe5-b3b8-170ff8156b1b', title: 'tag2' },
  { id: '3fa161f7-c66c-409e-a5d5-1a159c84ad81', title: 'tag3' },
  { id: '48568f914-0595-4ffe-a1e2-b333b1eb3275', title: 'tag4' }
];

/*
9059dee5-7897-46d3-b8f6-e075a8b568c0
eab06dc6-ba52-4169-a369-f2f825d44ebb
 */
const POSTS = [
  {
    id: '129f97f2-9b77-499a-a740-156c4b881a44',
    type: 'video',
    tags: [TAGS[0], TAGS[1]],
    state
    title
    url
    previewText
    text
    quoteText
    quoteAuthor
    imagePath
    urlDescription
    createdAt
    updatedAt
    userId
  },
  {}
];

/*

function getPosts() {
  return [
    {
      id: FIRST_POST_UUID,
      title: 'Худеющий',
      userId: FIRST_USER_ID,
      content: 'Недавно прочитал страшный роман «Худеющий».',
      description: 'На мой взгляд, это один из самых страшных романов Стивена Кинга.',
      categories: {
        connect: [{ id: FIRST_CATEGORY_UUID }],
      },
    },
    {
      id: SECOND_POST_UUID,
      title: 'Вы не знаете JavaScript',
      userId: FIRST_USER_ID,
      content: 'Полезная книга по JavaScript',
      description: 'Секреты и тайные знания по JavaScript.',
      categories: {
        connect: [
          { id: FIRST_CATEGORY_UUID },
          { id: SECOND_CATEGORY_UUID },
        ]
      },
      comments: [
          {
            message: 'Это действительно отличная книга!',
            userId: FIRST_USER_ID,
          },
          {
            message: 'Надо будет обязательно перечитать. Слишком много информации.',
            userId: SECOND_USER_ID,
          }
      ]
    }
  ]
}
*/

async function seedDb(prismaClient: PrismaClient) {
  for (const tag of TAGS) {
    const { id, title } = tag
    await prismaClient.tag.upsert({
      where: { id },
      update: {},
      create: { id, title }
    });
  }

  /*
  const mockPosts = getPosts();
  for (const post of mockPosts) {
    await prismaClient.post.create({
      data: {
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.description,
        categories: post.categories,
        userId: post.userId,
        comments: post.comments ? {
          create: post.comments
        } : undefined
      }
    })
  }
  */

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
