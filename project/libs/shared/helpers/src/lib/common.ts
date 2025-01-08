import { ClassTransformOptions, plainToInstance } from 'class-transformer';

export function getPort(evnName: string, defaultPort: number): number {
  return parseInt(process.env[evnName] || `$defaultPort}`, 10)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMetaError(error: any): { message: string, code: string, modelName: string, fieldName: string, target: string } {
  //! временно? пока для обработки ошибок
  const message = error.message ?? '';
  const code = error.code ?? '';
  const modelName = error.meta?.modelName ?? '';
  const fieldName = error.meta?.field_name ?? '';
  const target = error.meta?.target ?? '';

  return {
    message,
    code,
    modelName,
    fieldName,
    target
  };
}
