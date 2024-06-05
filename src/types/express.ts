import { Request } from "express";
import { UserJwtPayload } from "./user";

export interface AuthRequest extends Request{
    user: UserJwtPayload
}