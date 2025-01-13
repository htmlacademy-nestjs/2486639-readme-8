import { TokenPayload } from './token-payload.interface';

export interface RequestWithTokenPayload {
  user?: TokenPayload
}
