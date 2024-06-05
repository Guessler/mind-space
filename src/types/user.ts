import { JwtPayload } from "jsonwebtoken";

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
}

export type Session = {
    id: number;
    token: string;
    UserId: number
}

export type UserJwtPayload = {
    id: number; name: string; email: string;
}

export type DecodedPayload = JwtPayload & UserJwtPayload