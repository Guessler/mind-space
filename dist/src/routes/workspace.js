"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspace = void 0;
const express_1 = __importDefault(require("express"));
const workspace_1 = require("../controllers/workspace");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.default)();
const workspace = (workSpaceManager) => {
    const controller = new workspace_1.WorkSpaceController(workSpaceManager);
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
    router.post('/create', auth_1.auth, (req, res) => controller.create(req, res));
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
    router.post('/invite', auth_1.auth, (req, res) => controller.invite(req, res));
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
    router.post('/remove', auth_1.auth, (req, res) => controller.remove(req, res));
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
    router.post('/change-role', auth_1.auth, (req, res) => controller.changeRole(req, res));
    router.get('/my-workspaces', auth_1.auth, (req, res) => controller.myWorkspaces(req, res));
    /**
     * @swagger
     * /api/workspace/:id:
     *   get:
     *     summary: Получение воркспейса по айди
     *     tags: [Workspace]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Получение воркспейса
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     */
    router.get('/:id', auth_1.auth, (req, res) => controller.getById(req, res));
    return router;
};
exports.workspace = workspace;
