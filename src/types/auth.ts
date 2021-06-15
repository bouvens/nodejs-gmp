export interface ITokenPayload {
  sub: string;
}

export interface ITokenPair {
  refresh: string;
  access: string;
}

export interface IRefreshToken {
  user: string;
  token: string;
  ip: string;
}
