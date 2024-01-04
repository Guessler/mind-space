import { ITodoManager, ITodoService } from "../interfaces/interface";
import { TodoType } from "../types/todo";

export class TodoManager implements ITodoManager{

    constructor(private readonly todoService: ITodoService){}

    async create (value: string): Promise<TodoType>{
        return await this.todoService.create(value, new Date())
    }
}