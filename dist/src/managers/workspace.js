"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceManager = void 0;
const models_1 = require("../store/db/models");
class WorkspaceManager {
    constructor(workSpaceStore) {
        this.workSpaceStore = workSpaceStore;
    }
    async create(name, user) {
        return await this.workSpaceStore.create(name, user);
    }
    async getUserByEmail(email) {
        return await models_1.UserModel.findOne({ where: { email } });
    }
    async invite(workspaceId, email, user) {
        const workspace = await this.workSpaceStore.getWorkspaceById(workspaceId);
        if (!workspace) {
            throw new Error("NOT_FOUND_WORKSPACE");
        }
        // TODO: ДОБАВИТЬ USERSTORE
        const userInvite = await this.getUserByEmail(email);
        if (!userInvite) {
            throw new Error("NOT_FOUND_USER_TO_INVITE");
        }
        const owner = await this.workSpaceStore.getUserInfoById(workspaceId, user.id);
        if (!owner || owner.role !== 'owner') {
            throw new Error('ACCESS_DENIDED');
        }
        if (userInvite.dataValues.id === user.id) {
            throw new Error("CANNOT_INVITE_YOURSELF");
        }
        return await this.workSpaceStore.invite(workspaceId, userInvite.dataValues.id);
    }
    async changeRole(workspaceId, email, role, user) {
        const workspace = await this.workSpaceStore.getWorkspaceById(workspaceId);
        if (!workspace) {
            throw new Error("THIS_WORKSPACE_IS_ALREDY_THERE");
        }
        const userToUpdate = await this.getUserByEmail(email);
        if (userToUpdate?.dataValues.id === user.id) {
            throw new Error("THIS_IS_YOU");
        }
        const owner = await this.workSpaceStore.getUserInfoById(workspaceId, user.id);
        if (!owner || owner.role !== 'owner') {
            throw new Error('ACCESS_DENIDED');
        }
        return await this.workSpaceStore.changeRole(workspaceId, userToUpdate?.dataValues.id, role);
    }
    async remove(workspaceId, email, user) {
        const workspace = await this.workSpaceStore.getWorkspaceById(workspaceId);
        if (!workspace) {
            throw new Error("THIS_WORKSPACE_IS_ALREDY_THERE");
        }
        const userToRemove = await this.getUserByEmail(email);
        if (!userToRemove) {
            throw new Error("THERES_A_USER_WITH_THIS_EMAIL");
        }
        if (userToRemove.dataValues.id === user.id) {
            throw new Error("THIS_IS_YOU");
        }
        return await this.workSpaceStore.remove(workspaceId, userToRemove.dataValues.id);
    }
    async myWorkspaces(page, limit, user) {
        return await this.workSpaceStore.getWorkspacesByUserId(page, limit, user.id);
    }
    async getById(id, user) {
        const data = await this.workSpaceStore.getWorkspaceById(id);
        return data;
    }
}
exports.WorkspaceManager = WorkspaceManager;
