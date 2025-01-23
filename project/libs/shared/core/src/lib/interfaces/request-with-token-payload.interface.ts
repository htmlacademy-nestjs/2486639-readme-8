import { RequestProperty } from '../constants/request-property';
import { TokenPayload } from './token-payload.interface';

export interface RequestWithTokenPayload {
  [RequestProperty.User]?: TokenPayload
}
