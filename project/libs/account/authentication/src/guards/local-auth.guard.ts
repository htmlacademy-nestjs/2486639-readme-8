import { AuthGuard } from '@nestjs/passport';

const AUTH_GUART_TYPE = 'local';

export class LocalAuthGuard extends AuthGuard(AUTH_GUART_TYPE) { }
