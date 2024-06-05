import express, { Request, Response } from 'express'
import { IWorkspaceManager } from '../interfaces/workspace'
import { WorkSpaceController } from '../controllers/workspace'
import { AuthRequest } from '../types/express'
import { auth } from '../middleware/auth'
const router = express()


export const workspace = (workSpaceManager: IWorkspaceManager) => {

    const controller = new WorkSpaceController(workSpaceManager)

    router.post('/create', auth,(req: Request,res: Response) => controller.create(req as AuthRequest,res))
    router.post('/invite', auth,(req: Request,res: Response) => controller.invite(req as AuthRequest,res))
    
    return router
}