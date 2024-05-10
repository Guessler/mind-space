import express from 'express'
const router = express()
import { auth } from './auth'
import { todo } from './todo'

router.use('/auth', auth)
router.use('/todo', todo)

export default router