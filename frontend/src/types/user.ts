export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  phone_number: string;
  full_name: string;
}

export interface RegisterResponse {
  access_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  is_verified: boolean;
  password: string;
}

export interface IAuth {
  is_logged_in: boolean;
  access_token: string | null;
  user?: IUser | null;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface IUserRegister {
  username: string;
  password: string;
  email: string;
  phone_number: string;
  full_name: string;
}

export interface IUserUpdate {
  email: string;
  phone_number: string;
  full_name: string;
  bio: string;
  gender: string;
  birth_date: string;
}
