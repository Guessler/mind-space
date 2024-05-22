import { IAuthStore } from "../interfaces/auth"
import { User } from "../types/user";
import jwt from 'jsonwebtoken'
import { UserModel } from "./db/models";

export class AuthStore implements IAuthStore{
    constructor(){}
    async register (name: string, email: string, password: string): Promise<User>{
        const user = await UserModel.create({name, email, password})
        return {id: user.dataValues.id, name, email, password}
    };
    async getUserByEmail (email: string): Promise<User | undefined>{
        const user = await UserModel.findOne({where: {email}})
        return user?.dataValues
    };
    
}