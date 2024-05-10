import { authStore } from "../store/auth"

class AuthManager{
    async auth(token?: string): Promise<string>{
        if(!token){
            throw new Error('UNATHORIZED')
        }

        const has = await authStore.checkToken(token)
        if(!has){
            throw new Error('TOKEN_INVALID')
        }

        return "123"
    }
}

export const authManager = new AuthManager()