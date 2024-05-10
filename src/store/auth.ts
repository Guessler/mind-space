class AuthStore{
    async checkToken(token: string): Promise<boolean>{
        if(token === '123'){
            return false
        }
        return true
    }
}

export const authStore = new AuthStore()