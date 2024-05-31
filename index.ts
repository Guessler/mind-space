import {config} from 'dotenv'
config()

import Express from 'express'
import cors from 'cors'
const app = Express()

import router from './src/routes'
import { AuthManager } from './src/managers/auth'
import { AuthStore } from './src/store/auth'

import db from './src/store/db'
import './src/store/db/models'
import { WorkSpaceStore } from './src/store/workspace'
import { WorkspaceManager } from './src/managers/workspace'


const authStore = new AuthStore()
const authManager = new AuthManager(authStore)


// const user = {
//     id: 10,
//     name: "Yarik",
//     email: "yarik1@mail.ru"
// }

const workspaceStore = new WorkSpaceStore()
const workspaceManager = new WorkspaceManager(workspaceStore)


app.use(Express.json())
app.use(cors())
app.use('/api', router(authManager))

const start = async () => {
    try{
        await db.sync()
        app.listen(3001, () => console.log('server started')) 

        // await workspaceManager.create("Personal yarik`s workspace", user)
        // await workspaceManager.invite(1, "test12345@mail.ru", user)
    }catch(err){
        console.log(err)
    }
}

start()
