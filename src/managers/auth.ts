import { IAuthManager, IAuthStore } from "../interfaces/auth"

export class AuthManager implements IAuthManager{

    constructor(private readonly authStore: IAuthStore){}

    async auth (token?: string | undefined): Promise<string>{
        throw new Error("NOT_IMPLEMENTED")
        // if(!token){
        //     throw new Error('TOKEN_NOT_FOUND')
        // }

        // try{
        //     const session = await this.authStore.findSessionByToken(token)
        //     return session.token as string
        // }catch(err){
        //     if((err as Error).message === 'NOT_FOUND'){
        //         throw new Error("AUTH_FAILED")
        //     }

        //     console.error(err)
        //     throw new Error('UNEXPECTED')
        // }
    }
    async login (email?: string | undefined, password?: string | undefined): Promise<string>{
        throw new Error("NOT_IMPLEMENTED")
    }
    async regiter (name: string, email: string, password: string): Promise<boolean>{
        throw new Error("NOT_IMPLEMENTED")
    }
}