import { Request, Response } from "express";
import { authManager } from "../managers/auth";

class AuthController{
    async auth(req: Request, res: Response){
        try{
            const token = req.headers.authorization
            const result = await authManager.auth(token)

            return res.status(401).json({message: "ACCESS_DENIDED", token: result })
        }catch(err){
            if((err as Error).message === "UNATHORIZED"){
                return res.status(401).json({message: (err as Error).message})
            }
            return res.status(400).json(err)
        }
    }
}

export const authConroller = new AuthController()