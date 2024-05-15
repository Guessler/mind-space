import express from 'express'
const router = express()
import { auth } from './auth'
import { todo } from './todo'
import { IAuthManager } from '../interfaces/auth'


export default (authManager: IAuthManager) => {
    router.use('/auth', auth(authManager))
    router.use('/todo', todo)
    return router
}