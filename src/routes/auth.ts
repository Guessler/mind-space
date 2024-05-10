import express from 'express'
import { authConroller } from '../controllers/auth'
const router = express()

router.get('/', authConroller.auth)
router.post('/login', (req,res) => console.log('called auth method'))
router.post('/register', (req,res) => console.log('called auth method'))

export const auth = router