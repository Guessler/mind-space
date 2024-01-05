import { ITodoManager, ITodoService } from "../interfaces/interface";
import { ListParams, ListType } from "../types";
import { TodoType } from "../types/todo";

export class TodoManager implements ITodoManager{

    constructor(private readonly todoService: ITodoService){}
    async list (values: ListParams):  Promise<ListType<TodoType>>{        
        return await this.todoService.list(values)
    }

    async getOne (id: number): Promise<TodoType>{
        const item = await this.todoService.getOne(id)
        if(!item){
            throw new Error('Todo with this ID is not found')
        }

        return item
    }

    async create (value: string): Promise<TodoType>{
        return await this.todoService.create(value, new Date())
    }
}