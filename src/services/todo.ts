import { ITodoService } from "../interfaces/interface";
import { TodoType } from "../types/todo";

export class TodoService implements ITodoService{
    items: Map<number, TodoType>;

    constructor(){
        this.items = new Map()
    }

    async create (value: string, date: Date): Promise<TodoType>{
        const id = this.items.size + 1

        const newItem: TodoType = {id, name: value, createdAt: date}
        this.items.set(id, newItem)

        return newItem
    }
}
