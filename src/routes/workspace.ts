import express, { Request, Response } from 'express';
import { IWorkspaceManager } from '../interfaces/workspace';
import { WorkSpaceController } from '../controllers/workspace';
import { AuthRequest } from '../types/express';
import { auth } from '../middleware/auth';

const router = express();

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
 *               $ref: '#/components/schemas/WorkspaceDto'
 */

/**
 * @swagger
 * /api/workspace/invite:
 *   post:
 *     summary: Приглашение пользователя в пространство
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
 *                 type: number
 *                 description: Идентификатор пространства
 *                 example: 1
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя для приглашения
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Успешное приглашение
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: true
 */

/**
 * @swagger
 * /api/workspace/remove:
 *   post:
 *     summary: Удаление пользователя из пространства
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
 *                 type: number
 *                 description: Идентификатор пространства
 *                 example: 1
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя для удаления
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Пользователь успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: true
 */

/**
 * @swagger
 * /api/workspace/change-role:
 *   post:
 *     summary: Изменение роли пользователя
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
 *                 type: number
 *                 description: Идентификатор пространства
 *                 example: 1
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email пользователя
 *                 example: user@example.com
 *               newRole:
 *                 type: string
 *                 enum: [owner, editor, viewer, guest]
 *                 description: Новая роль пользователя
 *                 example: editor
 *     responses:
 *       200:
 *         description: Роль успешно изменена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: true
 */

/**
 * @swagger
 * /api/workspace/my-workspaces:
 *   get:
 *     summary: Получение списка всех workspace пользователя
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Количество элементов на странице
 *     responses:
 *       200:
 *         description: Список workspace
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   example: 5
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WorkspaceDto'
 */

/**
 * @swagger
 * /api/workspace/{id}:
 *   get:
 *     summary: Получение workspace по ID
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Идентификатор workspace
 *     responses:
 *       200:
 *         description: Данные workspace
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceDto'
 *       404:
 *         description: Workspace не найден
 */

/**
 * @swagger
 * /api/workspace/{id}:
 *   put:
 *     summary: Обновление названия workspace
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Идентификатор workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Новое название workspace
 *                 example: Updated Workspace Name
 *     responses:
 *       200:
 *         description: Workspace успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceDto'
 *       400:
 *         description: Ошибка валидации или доступа
 *       404:
 *         description: Workspace не найден
 */

/**
 * @swagger
 * /api/workspace/{id}:
 *   delete:
 *     summary: Удаление workspace
 *     tags: [Workspace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Идентификатор workspace
 *     responses:
 *       204:
 *         description: Workspace успешно удалён
 *       400:
 *         description: Ошибка доступа или валидации
 *       404:
 *         description: Workspace не найден
 */

export const workspace = (workSpaceManager: IWorkspaceManager) => {
    const controller = new WorkSpaceController(workSpaceManager);

    router.post('/create', auth, (req: Request, res: Response) => controller.create(req as AuthRequest, res));
    router.post('/invite', auth, (req: Request, res: Response) => controller.invite(req as AuthRequest, res));
    router.post('/remove', auth, (req: Request, res: Response) => controller.remove(req as AuthRequest, res));
    router.post('/change-role', auth, (req: Request, res: Response) => controller.changeRole(req as AuthRequest, res));
    router.get('/my-workspaces', auth, (req: Request, res: Response) => controller.myWorkspaces(req as AuthRequest, res));
    router.get('/:id', auth, (req: Request, res: Response) => controller.getById(req as AuthRequest, res));
    router.put('/:id', auth, (req: Request, res: Response) => controller.updateWorkspace(req as AuthRequest, res));
    router.delete('/:id', auth, (req: Request, res: Response) => controller.deleteWorkspace(req as AuthRequest, res));

    return router;
};