import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ConfigAlias } from '@project/shared/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard(ConfigAlias.Jwt) { }
