import { User } from "../types/user";

export interface IAuthManager{
    auth: (token?: string) => Promise<string>;
    login: (email?: string, password?: string) => Promise<string>;
    regiter: (name: string, email: string, password: string) => Promise<boolean>;
}

export interface IAuthStore{
    register: (name: string, email: string, password: string) => Promise<User>;
    getUserByEmail: (email: string) => Promise<User | undefined>;
    
}