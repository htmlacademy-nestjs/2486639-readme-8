import { RequestProperty } from '../constants/request-property';

export interface RequestWithUserId {
  [RequestProperty.UserId]?: string;
}
