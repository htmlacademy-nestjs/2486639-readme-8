import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const BAD_GUID_ERROR = 'Bad GUID';
const regexpGuid = /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;

@Injectable()
export class GuidValidationPipe implements PipeTransform {
  public transform(value: string, { type }: ArgumentMetadata) {
    if (type !== 'param') {
      throw new Error('This pipe must used only with params!')
    }

    if (!regexpGuid.test(value)) {
      throw new BadRequestException(BAD_GUID_ERROR);
    }

    return value;
  }
}
