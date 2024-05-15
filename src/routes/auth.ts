import express from 'express'
import { authConroller } from '../controllers/auth'
import { IAuthManager } from '../interfaces/auth'
const router = express()

export const auth = (authManager: IAuthManager) => {
    const controller = new authConroller(authManager)

    router.get('/', controller.auth.bind(controller))
    
    return router
}