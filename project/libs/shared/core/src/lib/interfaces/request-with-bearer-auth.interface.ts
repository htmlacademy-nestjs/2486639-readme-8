import { RequestProperty } from '../constants/request-property';

export interface RequestWithBearerAuth {
  [RequestProperty.BearerAuth]?: string;
}
