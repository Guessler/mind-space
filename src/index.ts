import { DI } from "./di";

const di = new DI()
const todoService = di.todoService()
const todoManager = di.todoManager(todoService)

todoManager.create('123')