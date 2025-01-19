export enum ConfigAlias {
  NodeEnv = 'NODE_ENV',
  Host = 'host',
  HostEnv = 'HOST',
  Port = 'port',
  PortEnv = 'PORT',
  User = 'user',
  UserEnv = 'USER',
  Password = 'password',
  PasswordEnv = 'PASSWORD',
  Database = 'database',
  DatabaseEnv = 'DATABASE',
  AuthBase = 'authBase',
  AuthBaseEnv = 'AUTHBASE',
  UploadDirectoryPath = 'uploadDirectoryPath',
  UploadDirectoryEnv = 'UPLOAD_DIRECTORY_PATH',
  ServeRoot = 'serveRoot',
  ServeRootEnv = 'SERVE_ROOT',

  Application = 'application',
  AppPort = `${Application}.${Port}`,
  AppUploadDirectoryPath = `${Application}.${UploadDirectoryPath}`,
  AppServeRoot = `${Application}.${ServeRoot}`,

  MongoDbEnv = 'MONGODB',
  MongoDbHostEnv = `${MongoDbEnv}_${HostEnv}`,
  MongoDbPortEnv = `${MongoDbEnv}_${PortEnv}`,
  MongoDbUserEnv = `${MongoDbEnv}_${UserEnv}`,
  MongoDbPasswordEnv = `${MongoDbEnv}_${PasswordEnv}`,
  MongoDbDatabaseEnv = `${MongoDbEnv}_${DatabaseEnv}`,
  MongoDbAuthBaseEnv = `${MongoDbEnv}_${AuthBaseEnv}`,

  AppMongoDb = `${Application}.mongoDb`,
  AppMongoDbHost = `${AppMongoDb}.${Host}`,
  AppMongoDbPort = `${AppMongoDb}.${Port}`,
  AppMongoDbUser = `${AppMongoDb}.${User}`,
  AppMongoDbPassword = `${AppMongoDb}.${Password}`,
  AppMongoDbDatabase = `${AppMongoDb}.${Database}`,
  AppMongoDbAuthBase = `${AppMongoDb}.${AuthBase}`,

  PostgresEnv = 'POSTGRES',
  PostgresHostEnv = `${PostgresEnv}_${HostEnv}`,
  PostgresPortEnv = `${PostgresEnv}_${PortEnv}`,
  PostgresUserEnv = `${PostgresEnv}_${UserEnv}`,
  PostgresPasswordEnv = `${PostgresEnv}_${PasswordEnv}`,
  PostgresDatabaseEnv = `${PostgresEnv}_${DatabaseEnv}`,
  PostgresDatabaseUrlEnv = 'DATABASE_URL',

  AppPostgres = `${Application}.postgres`,
  AppPostgresHost = `${AppPostgres}.${Host}`,
  AppPostgresPort = `${AppPostgres}.${Port}`,
  AppPostgresUser = `${AppPostgres}.${User}`,
  AppPostgresPassword = `${AppPostgres}.${Password}`,
  AppPostgresDatabase = `${AppPostgres}.${Database}`,
  AppPostgresDatabaseUrl = `${AppPostgres}.databaseUrl`,

  RabbitEnv = 'RABBIT',
  RabbitHostEnv = `${RabbitEnv}_${HostEnv}`,
  RabbitPortEnv = `${RabbitEnv}_${PortEnv}`,
  RabbitUserEnv = `${RabbitEnv}_${UserEnv}`,
  RabbitPasswordEnv = `${RabbitEnv}_${PasswordEnv}`,
  RabbitExchangeEnv = `${RabbitEnv}_EXCHANGE`,
  RabbitQueueEnv = `${RabbitEnv}_QUEUE`,

  AppRabbit = `${Application}.rabbit`,
  AppRabbitHost = `${AppRabbit}.${Host}`,
  AppRabbitPort = `${AppRabbit}.${Port}`,
  AppRabbitUser = `${AppRabbit}.${User}`,
  AppRabbitPassword = `${AppRabbit}.${Password}`,
  AppRabbitExchange = `${AppRabbit}.exchange`,
  AppRabbitQueue = `${AppRabbit}.queue`,

  MailSmtpEnv = 'MAIL_SMTP',
  MailSmtpHostEnv = `${MailSmtpEnv}_${HostEnv}`,
  MailSmtpPortEnv = `${MailSmtpEnv}_${PortEnv}`,
  MailSmtpUserEnv = `${MailSmtpEnv}_${UserEnv}`,
  MailSmtpPasswordEnv = `${MailSmtpEnv}_${PasswordEnv}`,
  MailSmtpFromEnv = `${MailSmtpEnv}_FROM`,

  AppMailSmtp = `${Application}.mailSmtp`,
  AppMailSmtpHost = `${AppMailSmtp}.${Host}`,
  AppMailSmtpPort = `${AppMailSmtp}.${Port}`,
  AppMailSmtpUser = `${AppMailSmtp}.${User}`,
  AppMailSmtpPassword = `${AppMailSmtp}.${Password}`,
  AppMailSmtpFrom = `${AppMailSmtp}.from`,

  JwtEnv = 'JWT',
  JwtAccessTokenSecretEnv = `${JwtEnv}_ACCESS_TOKEN_SECRET`,
  JwtAccessTokenExpiresInEnv = `${JwtEnv}_ACCESS_TOKEN_EXPIRES_IN`,
  JwtRefreshTokenSecretEnv = `${JwtEnv}_REFRESH_TOKEN_SECRET`,
  JwtRefreshTokenExpiresInEnv = `${JwtEnv}_REFRESH_TOKEN_EXPIRES_IN`,

  AppJwt = `${Application}.jwt`,
  AppJwtAccessTokenSecret = `${AppJwt}.accessTokenSecret`,
  AppJwtAccessTokenExpiresIn = `${AppJwt}.accessTokenExpiresIn`,
  AppJwtRefreshTokenSecret = `${AppJwt}.refreshTokenSecret`,
  AppJwtRefreshTokenExpiresIn = `${AppJwt}.refreshTokenExpiresIn`,
  // микросервисы
  ServiceUrlEnv = 'SERVICE_URL',
  ServiceUrl = 'ServiceUrl',

  AccountServiceUrlEnv = `ACCOUNT_${ServiceUrlEnv}`,
  BlogPostServiceUrlEnv = `BLOG_POST_${ServiceUrlEnv}`,
  FileStorageServiceUrlEnv = `FILE_STORAGE_${ServiceUrlEnv}`,

  AppAccountServiceUrl = `${Application}.account${ServiceUrl}`,
  AppBlogPostServiceUrl = `${Application}.blogPost${ServiceUrl}`,
  AppFileStorageServiceUrl = `${Application}.fileStorage${ServiceUrl}`,
  //...
}
