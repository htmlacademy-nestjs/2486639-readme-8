import { ValidationError } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';

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

export function makePath(directory: string, filename: string) {
  const path = directory.replace('\\', '/');

  return `/${path}/${filename}`;
}
