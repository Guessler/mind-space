"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketManager = void 0;
const express_ws_1 = __importDefault(require("express-ws"));
const auth_1 = require("../middleware/auth");
const models_1 = require("../store/db/models");
class WebsocketManager {
    constructor(app) {
        this.app = app;
        this.ws = (0, express_ws_1.default)(app);
        this.clients = new Map();
        this.userClients = new Map();
    }
    async init() {
        this.ws.app.ws('/', async (ws, req) => {
            const result = await (0, auth_1.authSocket)(req);
            if (!result) {
                ws.close();
                return;
            }
            ws.userId = Date.now();
            ws.user = req.user;
            this.connectClient(ws);
            this.clients.set(ws.userId, ws);
            this.notifyAll(JSON.stringify({ type: "USER_CONNECTED", payload: { userId: ws.userId } }));
            ws.on('message', async (msg) => {
                const message = this.parseMessage(msg);
                if (message.type === "UNCAUGHT_MESSAGE") {
                    ws.send(message);
                    return;
                }
                if (message.type === "WORKSPACE_CONNECTED") {
                    const id = message.payload.workspaceId;
                    const data = await models_1.WorkspaceModel.findOne({
                        include: [{
                                model: models_1.UserModel,
                            }],
                        where: {
                            id
                        }
                    });
                    const userIds = data?.dataValues.Users.map((obj) => obj.dataValues.id);
                    const clients = [];
                    for (const id of userIds) {
                        const wsClients = this.userClients.get(id);
                        if (!wsClients) {
                            continue;
                        }
                        clients.push(...wsClients);
                    }
                    for (const clientId of clients) {
                        const socket = this.clients.get(clientId);
                        socket.send(JSON.stringify({ type: "USER_WORKSPACE_CONNECT", payload: { workspaceId: id, userId: ws.user.id, username: ws.user.name } }));
                    }
                    return;
                }
                this.notifyAll(JSON.stringify({ type: "USER_MESSAGE", payload: { userId: ws.userId, msg } }));
            });
        });
    }
    ;
    parseMessage(msg) {
        try {
            const parsed = JSON.parse(msg);
            return parsed;
        }
        catch (err) {
            return { type: "UNCAUGHT_MESSAGE" };
        }
    }
    connectClient(ws) {
        const clients = this.userClients.get(ws.user.id);
        if (!clients) {
            this.userClients.set(ws.user.id, [ws.userId]);
            return;
        }
        this.userClients.set(ws.user.id, [...clients, ws.userId]);
    }
    notifyAll(msg) {
        for (const client of this.clients.values()) {
            client.send(msg);
        }
    }
}
exports.WebsocketManager = WebsocketManager;
