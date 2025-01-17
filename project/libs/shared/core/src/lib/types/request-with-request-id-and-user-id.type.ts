import { RequestWithRequestId } from '../interfaces/request-with-request-id.interface';
import { RequestWithUserId } from '../interfaces/request-with-user-id.interface';

export type RequestWithRequestIdAndUserId = RequestWithUserId & RequestWithRequestId;
