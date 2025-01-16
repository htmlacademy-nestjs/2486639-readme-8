import { ConfigAlias } from '@project/shared/core';

export enum EnvValidationMessage {
  DBHostRequired = `env ${ConfigAlias.MongoDbHostEnv} is required`,
  DBPortRequired = `env ${ConfigAlias.MongoDbPortEnv} is required`,
  DBUserRequired = `env ${ConfigAlias.MongoDbUserEnv} is required`,
  DBPasswordRequired = `env ${ConfigAlias.MongoDbPasswordEnv} is required`,
  DBDatabaseRequired = `env ${ConfigAlias.MongoDbDatabaseEnv} is required`,
  DBBaseAuthRequired = `env ${ConfigAlias.MongoDbAuthBaseEnv} is required`
}
