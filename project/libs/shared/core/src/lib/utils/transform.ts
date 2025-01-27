import dayjs from 'dayjs';

import { DateFormat } from '../constants/date-format';

export function transformTags({ value }): string[] {
  // когда запрос в blog, то преобразует entity[]
  // а когда запрос из api, то преобразует string[]
  return value.map(
    (item: { title: string } | string) => {
      if (typeof item === 'string') {
        return item;
      }

      return item.title;
    });
}

export function transformDate({ value }): string {
  return dayjs(value).format(DateFormat.ONLY_DATE);
}
