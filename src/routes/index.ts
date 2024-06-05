import express from 'express'
const router = express()
import { auth } from './auth'
import { todo } from './todo'
import { IAuthManager } from '../interfaces/auth'
import { workspace } from './workspace'
import { IWorkspaceManager } from '../interfaces/workspace'


export default (authManager: IAuthManager, workspaceManager: IWorkspaceManager) => {
    router.use('/auth', auth(authManager))
    router.use('/todo', todo)
    router.use('/workspace', workspace(workspaceManager))
    return router
}