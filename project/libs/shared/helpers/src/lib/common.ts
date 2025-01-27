import { ValidationError } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { join } from 'path/posix';

export function getPort(evnName: string, defaultPort: number): number {
  return parseInt(process.env[evnName] || `${defaultPort}`, 10)
}

export function fillDto<T, V>(
  DtoClass: new () => T,
  plainObject: V,
  options?: ClassTransformOptions
): T;

export function fillDto<T, V extends []>(
  DtoClass: new () => T,
  plainObject: V,
  options?: ClassTransformOptions
): T[];

export function fillDto<T, V>(
  DtoClass: new () => T,
  plainObject: V,
  options?: ClassTransformOptions
): T | T[] {
  return plainToInstance(DtoClass, plainObject, {
    excludeExtraneousValues: true,
    ...options
  });
}

export function getMongoConnectionString({ host, port, user, password, database, authBase }): string {
  return `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=${authBase}`;
}

export function getRabbitMQConnectionString({ host, port, user, password }): string {
  return `amqp://${user}:${password}@${host}:${port}`;
}

export function getValidationErrorString(errors: ValidationError[]): string {
  const errorList = errors.map((item: ValidationError) => (Object.values(item.constraints).join(', ')));

  return errorList.join(', ');
}

export function getQueryString(query: object): string {
  const queryParams: string[] = [];

  for (const [key, value] of Object.entries(query)) {
    queryParams.push(`${key}=${value}`);
  }

  return queryParams.join('&');
}

export function makeUrl(mainUrl: string, mainRoute = '', route = '', query: object = null) {
  const queryString = (query && Object.keys(query).length) ? `?${getQueryString(query)}` : '';

  return join(mainUrl, mainRoute, route) + queryString;
}
