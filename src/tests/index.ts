import {config} from 'dotenv'
import {join} from 'path'
config({
    path: join(__dirname, '..', '..', '.env')
})

import { IAuthManager } from "../interfaces/auth"
import { register } from "./auth.register"

import db from '../store/db'
import '../store/db/models'
import { AuthStore } from "../store/auth"
import { AuthManager } from "../managers/auth"

const start = async () => {
    try{

        console.log('test started')

        await db.sync()
        const authStore = new AuthStore()
        const authManager = new AuthManager(authStore)

        try{
            await register(authManager)
        }catch(err){

            const {message} = err as Error

            
            
            console.log('some error from register', message)
        }

    }catch(err){
        
    }
}

start()