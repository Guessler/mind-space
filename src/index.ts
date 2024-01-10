import { DI } from "./di";

const di = new DI()
const todoService = di.todoService()
const todoManager = di.todoManager(todoService)


todoManager.create('Купить хлеб')
todoManager.list({page: 1, count: 20})

const start = async () => {
    const test = await todoManager.create('123')
    console.log(test)
}

export {start, todoManager}
