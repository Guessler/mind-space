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


const authStore = new AuthStore()
const authManager = new AuthManager(authStore)


app.use(Express.json())
app.use(cors())
app.use('/api', router(authManager))

const start = async () => {
    try{
        await db.sync()
        app.listen(3001, () => console.log('server started')) 
    }catch(err){
        console.log(err)
    }
}

start()
