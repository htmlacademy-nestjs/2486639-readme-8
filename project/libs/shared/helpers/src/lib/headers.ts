export function getAuthorizationHeaderValue(request: Request): string {
  return request.headers['authorization'];
}

export function getAuthorizationHeader(request: Request): { 'Authorization': string } {
  return { 'Authorization': getAuthorizationHeaderValue(request) };
}
