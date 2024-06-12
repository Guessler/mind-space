import express, { Request, Response } from 'express'
import { IWorkspaceManager } from '../interfaces/workspace'
import { WorkSpaceController } from '../controllers/workspace'
import { AuthRequest } from '../types/express'
import { auth } from '../middleware/auth'
const router = express()


export const workspace = (workSpaceManager: IWorkspaceManager) => {

    const controller = new WorkSpaceController(workSpaceManager)

    /**
    * @swagger
    * /api/workspace/create:
    *   post:
    *     summary: Создание пространства
    *     tags: [Workspace]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               name:
    *                 type: string
    *                 description: Название пространства
    *                 example: Space #1
    *     responses:
    *       200:
    *         description: Успешный ответ
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 message:
    *                   type: string
    */
    router.post('/create', auth,(req: Request,res: Response) => controller.create(req as AuthRequest,res))

    router.post('/invite', auth,(req: Request,res: Response) => controller.invite(req as AuthRequest,res))

    router.post('/remove', auth,(req: Request,res: Response) => controller.remove(req as AuthRequest,res))
    
    router.post('/change-role', auth,(req: Request,res: Response) => controller.changeRole(req as AuthRequest,res))
    
    return router
}