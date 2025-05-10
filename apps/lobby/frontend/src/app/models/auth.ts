import { User } from "./user";

export interface LoginDetails {
  email: User["email"];
  password: string;
}

export interface RegisterDetails {
  email: User["email"];
  password: string;
}

export interface LoginResponse {
  user: User;
  spaToken: string;
}
