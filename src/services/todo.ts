import { ITodoService } from "../interfaces/interface";
import { ListParams, ListType } from "../types";
import { TodoType } from "../types/todo";

export class TodoService implements ITodoService{
    items: Map<number, TodoType>;

    constructor(){
        this.items = new Map()
    }

    async list (values: ListParams):  Promise<ListType<TodoType>>{
        const {page, count} = values
        return {count: this.items.size, data: Array.from(this.items.values()).slice(page - 1, count)}
    }

    async getOne (id: number): Promise<TodoType | undefined>{
        return this.items.get(id)
    }

    async create (value: string, date: Date): Promise<TodoType>{
        const id = this.items.size + 1

        const newItem: TodoType = {id, name: value, createdAt: date}
        this.items.set(id, newItem)

        return newItem
    }
}
