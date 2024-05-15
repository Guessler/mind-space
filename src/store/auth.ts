import { IAuthStore } from "../interfaces/auth"

export class AuthLocalStore implements IAuthStore{
    private session: Map<string, any>
    constructor(){
        this.session = new Map()
    }

    async findSessionByToken (token: string): Promise<any>{
        const hasSession = this.session.has(token)
        if(!hasSession){
            throw new Error('NOT_FOUND')
        }

        return this.session.get(token)
    }
}