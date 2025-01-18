export const AUTH_NAME = 'authorization';

export function getAuthorizationHeaderValue(request: Request): string {
  return request.headers[AUTH_NAME];
}

export function getAuthorizationHeader(request: Request): { [AUTH_NAME]: string } {
  return { [AUTH_NAME]: getAuthorizationHeaderValue(request) };
}
