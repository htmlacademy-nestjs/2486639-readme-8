export enum ConfigAlias {
  Application = 'application',
  ApplicationPort = `${Application}.port`,
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
