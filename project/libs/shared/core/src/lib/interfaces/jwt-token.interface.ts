export interface JwtToken {
  id?: string;
  tokenId: string;
  userId: string;
  expiresIn: Date;
  createdAt?: Date;
}
