"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSocket = exports.auth = void 0;
const models_1 = require("../store/db/models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "UNAUTHORIZED" });
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "UNAUTHORIZED" });
        }
        const session = await models_1.SessionModel.findOne({ where: { token } });
        if (!session) {
            return res.status(401).json({ message: "UNAUTHORIZED" });
        }
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            req.user = decoded;
            next();
        }
        catch (err) {
            if (session) {
                await models_1.SessionModel.destroy({ where: { id: session.dataValues.id } });
            }
            return res.status(401).json({ message: "UNAUTHORIZED" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ message: "UNAUTHORIZED" });
    }
};
exports.auth = auth;
const authSocket = async (req) => {
    if (!req.query.token) {
        return false;
    }
    const token = req.query.token;
    if (!token) {
        return false;
    }
    const session = await models_1.SessionModel.findOne({ where: { token } });
    if (!session) {
        return false;
    }
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        req.user = decoded;
        return true;
    }
    catch (err) {
        return false;
    }
};
exports.authSocket = authSocket;
