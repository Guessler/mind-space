"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const routes_1 = __importDefault(require("./src/routes"));
const auth_1 = require("./src/managers/auth");
const auth_2 = require("./src/store/auth");
const db_1 = __importDefault(require("./src/store/db"));
require("./src/store/db/models");
const workspace_1 = require("./src/store/workspace");
const workspace_2 = require("./src/managers/workspace");
const websockets_1 = require("./src/managers/websockets");
const authStore = new auth_2.AuthStore();
const authManager = new auth_1.AuthManager(authStore);
const workspaceStore = new workspace_1.WorkSpaceStore();
const workspaceManager = new workspace_2.WorkspaceManager(workspaceStore);
const webSocketManager = new websockets_1.WebsocketManager(app);
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation for your API',
        },
    },
    apis: ['./src/routes/*.ts'],
    tags: [
        {
            name: 'Auth',
            description: 'API для работы с AUTH-модулем',
        },
        {
            name: 'Workspace',
            description: 'API для работы с рабочими пространствами',
        },
    ],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', (0, routes_1.default)(authManager, workspaceManager));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
const start = async () => {
    try {
        await db_1.default.sync();
        await webSocketManager.init();
        app.listen(8080, () => console.log('server started'));
    }
    catch (err) {
        console.log(err);
    }
};
start();
