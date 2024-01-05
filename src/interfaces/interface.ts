import { ListParams, ListType } from "../types";
import { TodoType } from "../types/todo";

export interface ITodoManager{
    create: (value: string) => Promise<TodoType>;
    list: (values: ListParams) => Promise<ListType<TodoType>>;
    getOne: (id: number) => Promise<TodoType>;
}

export interface ITodoService{
    create: (value: string, date: Date) => Promise<TodoType>;
    list: (values: ListParams) => Promise<ListType<TodoType>>;
    getOne: (id: number) => Promise<TodoType | undefined>;
}