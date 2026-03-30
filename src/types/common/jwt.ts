export interface JwtPayload {
  userId: number;
  email?: string | null;
  phone?: string | null;
  iat?: number;
  exp?: number;
}