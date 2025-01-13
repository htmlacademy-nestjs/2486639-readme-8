export const BearerAuthOption = { type: 'http' } as const;

export enum BearerAuth {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken'
};
