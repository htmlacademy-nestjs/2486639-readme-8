import { RequestProperty } from '../constants/request-property';
import { RequestWithUserId } from './request-with-user-id.interface';

export interface RequestWithRequestIdAndUserId extends RequestWithUserId {
  [RequestProperty.RequestId]?: string;
}
