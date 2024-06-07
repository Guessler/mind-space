import express from 'express'
import { authConroller } from '../controllers/auth'
import { IAuthManager } from '../interfaces/auth'
const router = express()

export const auth = (authManager: IAuthManager) => {
    const controller = new authConroller(authManager)

    /**
     * @swagger
     * /api/auth/:
     *   get:
     *     summary: Аутентификация пользователя
     *     tags: [Auth]
     *     responses:
     *       200:
     *         description: Успешный ответ
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   description: Токен авторизации 
     */
    router.get('/', controller.auth.bind(controller))

    /**
    * @swagger
    * /api/auth/register:
    *   post:
    *     summary: Регистрация пользователя
    *     tags: [Auth]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               email:
    *                 type: string
    *                 description: Почта пользователя
    *                 example: user@example.com
    *               name:
    *                 type: string
    *                 description: Имя пользователя
    *                 example: John Doe
    *               password:
    *                 type: string
    *                 description: Пароль пользователя
    *                 example: password123
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
    router.post('/register', controller.register.bind(controller))

     /**
    * @swagger
    * /api/auth/login:
    *   post:
    *     summary: Авторизация пользователя
    *     tags: [Auth]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               email:
    *                 type: string
    *                 description: Почта пользователя
    *                 example: user@example.com
    *               password:
    *                 type: string
    *                 description: Пароль пользователя
    *                 example: password123
    *     responses:
    *       200:
    *         description: Успешный ответ
    *         content:
    *           application/json:
    *             schema:
    *               type: string
    */
    router.post('/login', controller.login.bind(controller))
    
    return router
}