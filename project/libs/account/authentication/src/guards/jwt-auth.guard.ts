import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AccountConfigAlias } from '@project/account/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AccountConfigAlias.Jwt) { }
