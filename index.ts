import Express from 'express'
import {start, todoManager } from "./src";

const app = Express()

app.use(Express.json())

app.post('/todo', async (req,res,next) => {
    try{
        const {name} = req.body
        if(!name){throw new Error('Name is undefined.')}
        const result = await todoManager.create(name)
        return res.json(result)
    }catch(err){
        console.log(err)
        return res.status(400).json(err)
    }
})

// app.get('/todo/list', async (req,res,next) => {
//     try{
//         let {page, count} = req.query

//         const result = await todoManager.list({page: parseInt(page as String), count})
//         return res.json(result)
//     }catch(err){
//         console.log(err)
//         return res.status(400).json(err)
//     }
// })

app.get('/todo/:id', async (req,res,next) => {
    try{
        const {id} = req.params
        const result = await todoManager.getOne(parseInt(id))
        return res.json(result)
    }catch(err){
        console.log(err)
        return res.status(400).json(err)
    }
})


app.listen(3000, () => console.log('server started'))

start()