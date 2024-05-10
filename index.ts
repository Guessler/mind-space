import Express from 'express'
import cors from 'cors'
const app = Express()

import router from './src/routes'

app.use(Express.json())
app.use(cors())

app.use('/api', router)

app.listen(3001, () => console.log('server started'))