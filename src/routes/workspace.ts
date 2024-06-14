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
     * tags:
     *   name: Workspace
     *   description: API для работы с пространствами
     */

    /**
     * @swagger
     * /api/workspace/create:
     *   post:
     *     summary: Создание пространства
     *     tags: [Workspace]
     *     security:
     *       - bearerAuth: []
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
     *         description: Успешное создание пространства
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    router.post('/create', auth, (req: Request, res: Response) => controller.create(req as AuthRequest, res))

    /**
     * @swagger
     * /api/workspace/invite:
     *   post:
     *     summary: Приглашение пользователей в пространство
     *     tags: [Workspace]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               workspaceId:
     *                 type: string
     *                 description: Идентификатор пространства
     *               userId:
     *                 type: string
     *                 description: Идентификатор пользователя
     *     responses:
     *       200:
     *         description: Успешное выполнение приглашения
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    router.post('/invite', auth, (req: Request, res: Response) => controller.invite(req as AuthRequest, res))

    /**
     * @swagger
     * /api/workspace/remove:
     *   post:
     *     summary: Удаление пространства
     *     tags: [Workspace]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               workspaceId:
     *                 type: string
     *                 description: Идентификатор пространства
     *     responses:
     *       200:
     *         description: Успешное удаление пространства
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    router.post('/remove', auth, (req: Request, res: Response) => controller.remove(req as AuthRequest, res))

    /**
     * @swagger
     * /api/workspace/change-role:
     *   post:
     *     summary: Изменение роли пользователя в пространстве
     *     tags: [Workspace]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               workspaceId:
     *                 type: string
     *                 description: Идентификатор пространства
     *               userId:
     *                 type: string
     *                 description: Идентификатор пользователя
     *               role:
     *                 type: string
     *                 description: Роль пользователя (например, "admin", "member")
     *     responses:
     *       200:
     *         description: Успешное изменение роли пользователя
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    router.post('/change-role', auth, (req: Request, res: Response) => controller.changeRole(req as AuthRequest, res))

    router.get('/my-workspaces', auth, (req: Request, res: Response) => controller.myWorkspaces(req as AuthRequest, res))

    return router
}
