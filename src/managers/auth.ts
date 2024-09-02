import { IAuthManager, IAuthStore } from "../interfaces/auth"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { DecodedPayload } from "../types/user"

export class AuthManager implements IAuthManager{

    private readonly key: string
    private readonly hashSteps: number

    constructor(private readonly authStore: IAuthStore){
        if(!process.env.SECRET_KEY_JWT){
            throw new Error('CHOOSE SECRET_KEY_JWT in .env')
        }

        this.hashSteps = 5
        this.key = process.env.SECRET_KEY_JWT
    }

    private generateToken(id: number, name: string, email: string){
        return jwt.sign({id, name, email}, this.key, {expiresIn: '1d'})
    }

    async auth (token?: string): Promise<string>{

        if(!token){
            throw new Error("UNATHORIZED")
        }

        const session = await this.authStore.getSession(token)
        if(!session){
            throw new Error("SESSION_NOT_FOUND")
        }

        try{
            const decoded = jwt.decode(session.token) as DecodedPayload
            if(decoded.id !== session.UserId){
                await this.authStore.deleteSession(session.id)
                throw new Error("UNATHORIZED")
            }

            await this.authStore.deleteSession(session.id)
            const newGeneratedToken = this.generateToken(decoded.id, decoded.name, decoded.email)
            await this.authStore.createSession(newGeneratedToken, session.UserId)

            return newGeneratedToken
        }catch(err){
            await this.authStore.deleteSession(session.id)
            throw new Error("UNATHORIZED")
        }
    }
    async login (email?: string | undefined, password?: string | undefined): Promise<string>{

        if(!email){
            throw new Error("CHOOSE_EMAIL")
        }

        if(!password){
            throw new Error("CHOOSE_PASSWORD")
        }

        if(!this.isValidPassword(password)){
            throw new Error("INCORRECT_PASSWORD")
        }

        const currentUser = await this.authStore.getUserByEmail(email)
        if(!currentUser){
            throw new Error("USER_WITH_THIS_EMAIL_NOT_FOUND")
        }

        const isValidPassword = bcrypt.compareSync(password, currentUser.password)
        if(!isValidPassword){
            throw new Error("INVALID_PASSWORD")
        }

        const {id,name} = currentUser

        const token = this.generateToken(id,name, email)

        await this.authStore.createSession(token, id)

        return token
    }

    private isValidPassword(password: string): boolean{
        const lowerCasePattern = /[a-z]/;
        const upperCasePattern = /[A-Z]/;
        const numberCasePattern = /[0-9]/;
        const specialCharacterPattern = /[^a-zA-Z0-9]/;  

        return password.length >= 6 &&
            numberCasePattern.test(password) &&
            upperCasePattern.test(password) &&
            lowerCasePattern.test(password) &&
            specialCharacterPattern.test(password)
    }
    public IsValidEmail(email:string): boolean {
        const emailPattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        return emailPattern.test(email);
    }

    async regiter (name: string, email: string, password: string): Promise<boolean>{
            if(!this.IsValidEmail(email)){
                throw new Error("INCORRECT_EMAIL")
            }
            if(!this.isValidPassword(password)){
                throw new Error("INCORRECT_PASSWORD")
            }

            const currentUser = await this.authStore.getUserByEmail(email)
            if(currentUser){
                throw new Error("USER_WITH_THIS_EMAIL_IS_EXISTS")
            }
    
            const hashPassword = bcrypt.hashSync(password,this.hashSteps)
            await this.authStore.register(name, email,hashPassword)
    
            return true
        
    }
}