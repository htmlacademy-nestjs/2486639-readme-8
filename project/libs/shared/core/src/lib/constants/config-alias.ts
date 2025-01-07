export enum ConfigAlias {
  NodeEnv = 'NODE_ENV',
  Application = 'application',
  ApplicationPort = `${Application}.port`,
  ApplicationPortEnv = 'PORT',
  MongoDb = 'mongoDb',
  MongoDbUsername = `${MongoDb}.username`,
  MongoDbPassword = `${MongoDb}.password`,
  MongoDbHost = `${MongoDb}.host`,
  MongoDbPort = `${MongoDb}.port`,
  MongoDbAuthBase = `${MongoDb}.authBase`,
  MongoDbDatabaseName = `${MongoDb}.databaseName`,
  Jwt = 'jwt',
  JwtAccessTokenSecret = `${Jwt}.accessTokenSecret`,
  JwtAccessTokenExpiresIn = `${Jwt}.accessTokenExpiresIn`
}
