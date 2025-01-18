import { RequestWithBearerAuth } from '../interfaces/request-with-bearer-auth.interface';
import { RequestWithRequestId } from '../interfaces/request-with-request-id.interface';

export type RequestWithRequestIdAndBearerAuth = RequestWithRequestId & RequestWithBearerAuth;
