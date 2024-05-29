import { IAuthStore } from "../interfaces/auth"
import { Session, User } from "../types/user";
import { SessionModel, UserModel } from "./db/models";

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
    
    async getSession (token: string): Promise<Session | undefined>{
        const data = await SessionModel.findOne({where: {token}})
        if(!data){
            return undefined
        }

        return data.dataValues
    }
    async createSession (token: string, UserId: number): Promise<Session>{
        const data = await SessionModel.create({token, UserId})
        return data.dataValues
    }
    async deleteSession (id: number): Promise<boolean>{
        return await SessionModel.destroy({where: {id}}) === 1
    }
}