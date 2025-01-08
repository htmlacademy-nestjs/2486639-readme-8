import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

const AUTH_GUART_TYPE = 'jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AUTH_GUART_TYPE) { }
