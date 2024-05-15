import Express from 'express'
import cors from 'cors'
const app = Express()

import router from './src/routes'
import { AuthManager } from './src/managers/auth'
import { AuthLocalStore } from './src/store/auth'

app.use(Express.json())
app.use(cors())

const store = new AuthLocalStore()
const manager = new AuthManager(store)

app.use('/api', router(manager))


app.listen(3001, () => console.log('server started')) 