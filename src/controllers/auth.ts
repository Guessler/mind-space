import { Request, Response } from "express";
import { IAuthManager } from "../interfaces/auth";

class AuthController{

    constructor(private readonly authManager: IAuthManager){}

    async auth(req: Request, res: Response){
        try{
            const token = req.headers.authorization
            const result = await this.authManager.auth(token)

            return res.status(401).json({message: "ACCESS_DENIDED", token: result })
        }catch(err){
            if((err as Error).message === 'AUTH_FAILED'){
                return res.status(401).json({message: "Аутентификация провалена. Пожалуйста, авторизуйтесь заново."})
            }

            return res.status(400).json({message: (err as Error).message})
        }
    }

    async register(req: Request, res: Response){
        try{

            const {name, email, password} = req.body
            const result = await this.authManager.regiter(name, email, password)

            return res.status(401).json({message: "USER_REGISTERED" })
        }catch(err){
            if((err as Error).message === 'AUTH_FAILED'){
                return res.status(401).json({message: "Аутентификация провалена. Пожалуйста, авторизуйтесь заново."})
            }

            return res.status(400).json({message: (err as Error).message})
        }
    }
} 

export const authConroller = AuthController