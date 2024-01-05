import { ITodoManager, ITodoService } from "../interfaces/interface";
import { TodoManager } from "../managers/todo";
import { TodoService } from "../services/todo";

export class DI{
    public todoManager(todoService: ITodoService): ITodoManager{
        return new TodoManager(todoService) 
    }
    public todoService(): ITodoService{
        return new TodoService() 
    }
    
}