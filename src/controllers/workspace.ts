import { Request, Response } from "express";
import { IWorkspaceManager } from "../interfaces/workspace";
import { AuthRequest } from "../types/express";

export class WorkSpaceController{
    constructor(private readonly manager: IWorkspaceManager){}

    async create(req: AuthRequest,res: Response){
        try{
            const {name} = req.body
            const payload = req.user

            return res.json(await this.manager.create(name, payload))
        }catch(err){
            const {message} = err as Error
            return res.status(400).json({message})
        }
    }

    
    async invite(req: AuthRequest,res: Response){
        try{
            const {workspaceId, email} = req.body
            const payload = req.user

            return res.json(await this.manager.invite(workspaceId, email, payload))
        }catch(err){
            const {message} = err as Error
            return res.status(400).json({message})
        }
    }

    // Сделать контроллеры invite, remove, changeRole

}