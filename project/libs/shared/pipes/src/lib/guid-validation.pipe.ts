import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { BAD_GUID_ERROR, checkType, GUID_REGEXP } from './common';

@Injectable()
export class GuidValidationPipe implements PipeTransform {
  public transform(value: string, { type }: ArgumentMetadata): string {
    checkType(type);

    if (!GUID_REGEXP.test(value)) {
      throw new BadRequestException(BAD_GUID_ERROR);
    }

    return value;
  }
}
