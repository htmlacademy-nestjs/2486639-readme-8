import { Prisma } from '@prisma/client';

export function getSearchTitleSql(searchTitle: string, limit: number) {
  return Prisma.sql`SELECT
  ID,
  SUM((POSITION(WORDS.WORD IN LOWER(TITLE)) > 0)::INT)::INT AS HIT_SUM
FROM
  POSTS,
  (
    SELECT
      UNNEST(
        STRING_TO_ARRAY(
          TRIM(
            REGEXP_REPLACE(
              LOWER(${searchTitle}),
              '\\s+',
              ' ',
              'g'
            )
          ),
          ' '
        )
      ) AS WORD
  ) WORDS
WHERE
  TITLE IS NOT NULL
GROUP BY
  ID
HAVING
  SUM((POSITION(WORDS.WORD IN LOWER(TITLE)) > 0)::INT) > 0
ORDER BY
  HIT_SUM DESC,
  PUBLISH_DATE DESC
LIMIT ${limit}`;
}
