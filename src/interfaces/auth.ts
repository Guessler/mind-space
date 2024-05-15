import { User } from "../types/user";

export interface IAuthManager{
    auth: (token?: string) => Promise<string>;
    login: (email?: string, password?: string) => Promise<string>;
    regiter: (name: string, email: string, password: string) => Promise<boolean>;
}

export interface IAuthStore{
    findSessionByToken:(token: string) => Promise<any>;
    getUserByUniq: (value: string | number) => Promise<User>;
}