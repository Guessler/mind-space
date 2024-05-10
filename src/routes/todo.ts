import express from 'express'
const router = express()

router.get('/', (req,res) => console.log('called todo method'))
router.get('/:id', (req,res) => console.log('called todo method'))
router.post('/', (req,res) => console.log('called auth method'))
router.put('/:id', (req,res) => console.log('called auth method'))
router.delete('/:id', (req,res) => console.log('called auth method'))

export const todo = router