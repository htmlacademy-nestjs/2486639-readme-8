import { IsNumber, IsOptional, IsString, Max, Min, validateOrReject } from 'class-validator';

import { DEFAULT_MONGODB_PORT, MAX_PORT, MIN_PORT } from '@project/shared/core';

import { EnvValidationMessage } from './mongo-db.messages';

export class MongoDbConfiguration {
  @IsString({ message: EnvValidationMessage.DBHostRequired })
  public host: string;

  @IsNumber({}, { message: EnvValidationMessage.DBPortRequired })
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  @IsOptional()
  public port: number = DEFAULT_MONGODB_PORT;

  @IsString({ message: EnvValidationMessage.DBUserRequired })
  public user: string;

  @IsString({ message: EnvValidationMessage.DBPasswordRequired })
  public password: string;

  @IsString({ message: EnvValidationMessage.DBDatabaseRequired })
  public database: string;

  @IsString({ message: EnvValidationMessage.DBBaseAuthRequired })
  public authBase: string;

  public async validate(): Promise<void> {
    await validateOrReject(this, { dismissDefaultMessages: true });
  }
}
