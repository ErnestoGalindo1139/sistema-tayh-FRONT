export interface authLogin {
  user: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  body: {
    user: IUser;
    accessToken: string;
    refreshToken: string;
  };
}

export interface AccessTokenResponse {
  statusCaode: number;
  accessToken: string;
  error?: string;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
}
