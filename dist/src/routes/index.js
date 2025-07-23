"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const auth_1 = require("./auth");
const todo_1 = require("./todo");
const workspace_1 = require("./workspace");
exports.default = (authManager, workspaceManager) => {
    router.use('/auth', (0, auth_1.auth)(authManager));
    router.use('/todo', todo_1.todo);
    router.use('/workspace', (0, workspace_1.workspace)(workspaceManager));
    return router;
};
