export interface IUser {
  id: number;
  name: string;
  email: string;
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
