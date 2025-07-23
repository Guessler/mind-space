"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({
    path: (0, path_1.join)(__dirname, '..', '..', '.env')
});
const auth_register_1 = require("./auth.register");
const db_1 = __importDefault(require("../store/db"));
require("../store/db/models");
const auth_1 = require("../store/auth");
const auth_2 = require("../managers/auth");
const start = async () => {
    try {
        console.log('test started');
        await db_1.default.sync();
        const authStore = new auth_1.AuthStore();
        const authManager = new auth_2.AuthManager(authStore);
        try {
            await (0, auth_register_1.register)(authManager);
        }
        catch (err) {
            const { message } = err;
            console.log('some error from register', message);
        }
    }
    catch (err) {
    }
};
start();
