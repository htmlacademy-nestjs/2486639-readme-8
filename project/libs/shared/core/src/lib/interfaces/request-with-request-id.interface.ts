import { RequestProperty } from '../constants/request-property';

export interface RequestWithRequestId {
  [RequestProperty.RequestId]?: string;
}
