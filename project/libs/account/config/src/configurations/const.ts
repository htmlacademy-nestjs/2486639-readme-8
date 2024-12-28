export const DEFAULT_PORT = 3000;

export const ENVIRONMENTS = ['development', 'production', 'stage'] as const;

export type Environment = typeof ENVIRONMENTS[number];

export enum ConfigAlias {
  Application = 'application',
  ApplicationPort = `${Application}.port`,
  MongoDb = 'mongoDb',
  MongoDbUsername = `${MongoDb}.username`,
  MongoDbPassword = `${MongoDb}.password`,
  MongoDbHost = `${MongoDb}.host`,
  MongoDbPort = `${MongoDb}.port`,
  MongoDbAuthBase = `${MongoDb}.authBase`,
  MongoDbDatabaseName = `${MongoDb}.databaseName`
}
