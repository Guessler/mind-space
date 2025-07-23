"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const name = process.env.DB_NAME;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const port = process.env.DB_PORT;
const host = process.env.DB_HOST;
if (!name || !user || !pass || !port || !host) {
    throw new Error('Choose DB_NAME');
}
const db = new sequelize_1.Sequelize(name, user, pass, {
    host: host,
    port: Number(port),
    dialect: 'postgres'
});
exports.default = db;
