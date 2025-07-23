"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStore = void 0;
const models_1 = require("./db/models");
class AuthStore {
    constructor() { }
    async register(name, email, password) {
        const user = await models_1.UserModel.create({ name, email, password });
        return { id: user.dataValues.id, name, email, password };
    }
    ;
    async getUserByEmail(email) {
        const user = await models_1.UserModel.findOne({ where: { email } });
        return user?.dataValues;
    }
    ;
    async getSession(token) {
        const data = await models_1.SessionModel.findOne({ where: { token } });
        if (!data) {
            return undefined;
        }
        return data.dataValues;
    }
    async createSession(token, UserId) {
        const data = await models_1.SessionModel.create({ token, UserId });
        return data.dataValues;
    }
    async deleteSession(id) {
        return await models_1.SessionModel.destroy({ where: { id } }) === 1;
    }
}
exports.AuthStore = AuthStore;
