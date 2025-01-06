import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

import { ConfigAlias } from '../const';

export async function getJwtOptions(configService: ConfigService): Promise<JwtModuleOptions> {
  return {
    secret: configService.get<string>(ConfigAlias.JwtAccessTokenSecret),
    signOptions: {
      expiresIn: configService.get<string>(ConfigAlias.JwtAccessTokenExpiresIn),
      algorithm: 'HS256'
    }
  }
}
