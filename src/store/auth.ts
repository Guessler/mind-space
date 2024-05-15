import { IAuthStore } from "../interfaces/auth"
import { User } from "../types/user";
import jwt from 'jsonwebtoken'

export class AuthLocalStore implements IAuthStore{
    private session: Map<number, string[]>
    private users: Map<string, User>;
    constructor(){
        this.session = new Map()
        this.users = new Map()
    }

    async getUserByUniq (value: string | number): Promise<User>{
        if(typeof value === 'number'){
            const usersArr = Array.from(this.users.values())
            const user = usersArr.find(user => user.id === value)
            if(!user){
                throw new Error('NOT_FOUND')
            }
            return user
        }

        const user = this.users.get(value)
        if(!user){
            throw new Error('NOT_FOUND')
        }
        return user
    };

    async findSessionByToken (token: string): Promise<boolean>{

        const decoded = jwt.decode(token) as jwt.JwtPayload & User
        const id = decoded.id as number

        const user = this.session.get(id)
        if(!user){
            throw new Error('NOT_FOUND')
        }

        if(!user.includes(token)){
            throw new Error('NOT_FOUND')
        }

        return true
    }
}