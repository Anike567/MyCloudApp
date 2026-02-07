import { User } from './../types/user';
export interface LoginResponse {
    token: string;
    message: string;
    user: User;
}

export interface SignupResponse {
    message:string;
    user: User;
}