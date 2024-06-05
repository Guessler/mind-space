import { NextFunction, Request, Response } from "express";
import { SessionModel } from "../store/db/models";
import jwt from 'jsonwebtoken'
import { DecodedPayload, UserJwtPayload } from "../types/user";
import { AuthRequest } from "../types/express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try{
        if(!req.headers.authorization){
            return res.status(401).json({message: "UNAUTHORIZED"})
        }

        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            return res.status(401).json({message: "UNAUTHORIZED"})
        }
        
        const session = await SessionModel.findOne({where: {token}})
        if(!session){
            return res.status(401).json({message: "UNAUTHORIZED"})
        }
        
        try{
            const decoded = jwt.decode(token) as DecodedPayload
            (req as AuthRequest).user = decoded
            next()
        }catch(err){
            if(session){
                await SessionModel.destroy({where: {id: session.dataValues.id}})
            }

            return res.status(401).json({message: "UNAUTHORIZED"})
        }

    }catch(err){
        console.log(err)
        return res.status(401).json({message: "UNAUTHORIZED"})
    }
}