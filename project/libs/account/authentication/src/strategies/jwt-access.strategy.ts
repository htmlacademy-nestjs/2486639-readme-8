import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TokenPayload } from '@project/shared/core';
import { AccountConfigAlias } from '@project/account/config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(AccountConfigAlias.JwtAccessTokenSecret)
    });
  }

  public async validate(payload: TokenPayload) {
    return payload;
  }
}
