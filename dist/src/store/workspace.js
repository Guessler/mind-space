"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkSpaceStore = void 0;
const models_1 = require("./db/models");
class WorkSpaceStore {
    async create(name, user) {
        const { dataValues } = await models_1.WorkspaceModel.create({ name });
        await models_1.WorkspaceUserModel.create({ UserId: user.id, WorkspaceId: dataValues.id, role: "owner" });
        return dataValues;
    }
    async getWorkspaceById(workspaceId) {
        const workspace = await models_1.WorkspaceModel.findOne({ where: { id: workspaceId } });
        return workspace?.dataValues;
    }
    async invite(workspaceId, userId) {
        await models_1.WorkspaceUserModel.create({ WorkspaceId: workspaceId, UserId: userId, role: "viewer" });
        return true;
    }
    async changeRole(workspaceId, userId, role) {
        const [status] = await models_1.WorkspaceUserModel.update({ role }, { where: { WorkspaceId: workspaceId, UserId: userId } });
        return status === 1;
    }
    async remove(workspaceId, userId) {
        const status = await models_1.WorkspaceUserModel.destroy({ where: { WorkspaceId: workspaceId, UserId: userId } });
        return status === 1;
    }
    async getUserInfoById(workspaceId, userId) {
        const data = await models_1.WorkspaceUserModel.findOne({ where: { UserId: userId, WorkspaceId: workspaceId } });
        return data?.dataValues;
    }
    async getWorkspacesByUserId(page, limit, userId) {
        const offset = page * limit - limit;
        const data = await models_1.WorkspaceModel.findAndCountAll({
            include: [{
                    model: models_1.UserModel,
                    where: { id: userId }
                }],
            limit,
            offset
        });
        return { count: data.count, rows: data.rows.map(row => row.dataValues) };
    }
}
exports.WorkSpaceStore = WorkSpaceStore;
