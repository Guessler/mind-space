import { DI } from "./di";

const di = new DI()
const todoService = di.todoService()
const todoManager = di.todoManager(todoService)

const start = async () => {
    const test = await todoManager.create('123')
    console.log(test)
}

export {start, todoManager}
