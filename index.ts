import Express, { Request } from 'express'
import cors from 'cors'
import {start, todoManager } from "./src";

const app = Express()

app.use(Express.json())
app.use(cors())

interface QueryListParams {
    page: string;
    count: string;
}

app.post('/todo', async (req,res,next) => {
    try{
        const {name} = req.body
        if(!name){throw new Error('Name is undefined.')}
        const result = await todoManager.create(name)
        return res.json(result)
    }catch(err){
        console.log(err)
        return res.status(400).json({err})
    }
})

app.get('/todo/list', async (req: Request<{}, {}, {}, QueryListParams>,res,next) => {
    try{
        let {page, count} = req.query

        const result = await todoManager.list({page: parseInt(page), count: parseInt(count)})
        return res.json(result)
    }catch(err){
        return res.status(400).json({err})
    }
})

app.get('/todo/:id', async (req,res,next) => {
    try{
        const {id} = req.params
        const result = await todoManager.getOne(parseInt(id))
        return res.json(result)
    }catch(err){
        console.log(err)
        return res.status(400).json({err})
    }
})


app.listen(3001, () => console.log('server started'))

start()