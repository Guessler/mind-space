import {config} from 'dotenv'
config()

import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'

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

const workspaceStore = new WorkSpaceStore()
const workspaceManager = new WorkspaceManager(workspaceStore)


const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Documentation for your API',
      },
    },
    apis: ['./src/routes/*.ts'], 
    tags: [
        {
          name: 'Auth',
          description: 'API для работы с AUTH-модулем',
        },
        {
          name: 'Workspace',
          description: 'API для работы с рабочими пространствами',
        },
    ],
};
const specs = swaggerJsDoc(options);


app.use(Express.json())
app.use(cors())
app.use('/api', router(authManager, workspaceManager))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


const start = async () => {
    try{
        await db.sync()
        app.listen(3050, () => console.log('server started')) 
    }catch(err){
        console.log(err)
    }
}

start()
