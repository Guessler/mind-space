import { IWorkspaceManager, IWorkspaceStore } from "../interfaces/workspace";
import { UserModel } from "../store/db/models";
import { List } from "../types";
import { UserJwtPayload } from "../types/user";
import { WorkspaceDto, WorkspaceType } from "../types/workspace";

export class WorkspaceManager implements IWorkspaceManager {
    constructor(private readonly workSpaceStore: IWorkspaceStore) { }

    async create(type: WorkspaceType, name: string, user: UserJwtPayload): Promise<WorkspaceDto> {
        return await this.workSpaceStore.create(type, name, user);
    }

    private async getUserByEmail(email: string) {
        return await UserModel.findOne({ where: { email } });
    }

    async invite(workspaceId: number, email: string, user: UserJwtPayload): Promise<boolean> {
        const workspace = await this.workSpaceStore.getWorkspaceById(workspaceId);
        if (!workspace) throw new Error("NOT_FOUND_WORKSPACE");

        const userInvite = await this.getUserByEmail(email);
        if (!userInvite) throw new Error("NOT_FOUND_USER_TO_INVITE");

        const owner = await this.workSpaceStore.getUserInfoById(workspaceId, user.id);
        if (!owner || owner.role !== 'owner') throw new Error('ACCESS_DENIED');

        if (userInvite.dataValues.id === user.id) throw new Error("CANNOT_INVITE_YOURSELF");

        return await this.workSpaceStore.invite(workspaceId, userInvite.dataValues.id);
    }

    async changeRole(workspaceId: number, email: string, role: "owner" | "editor" | "viewer" | "guest", user: UserJwtPayload): Promise<boolean> {
        const workspace = await this.workSpaceStore.getWorkspaceById(workspaceId);
        if (!workspace) throw new Error("NOT_FOUND_WORKSPACE");

        const userToUpdate = await this.getUserByEmail(email);
        if (!userToUpdate) throw new Error("USER_NOT_FOUND");

        if (userToUpdate.dataValues.id === user.id) throw new Error("CANNOT_CHANGE_YOUR_ROLE");

        const owner = await this.workSpaceStore.getUserInfoById(workspaceId, user.id);
        if (!owner || owner.role !== 'owner') throw new Error('ACCESS_DENIED');

        return await this.workSpaceStore.changeRole(workspaceId, userToUpdate.dataValues.id, role);
    }

    async remove(workspaceId: number, email: string, user: UserJwtPayload): Promise<boolean> {
        const workspace = await this.workSpaceStore.getWorkspaceById(workspaceId);
        if (!workspace) throw new Error("NOT_FOUND_WORKSPACE");

        const userToRemove = await this.getUserByEmail(email);
        if (!userToRemove) throw new Error("USER_NOT_FOUND");

        if (userToRemove.dataValues.id === user.id) throw new Error("CANNOT_REMOVE_YOURSELF");

        const owner = await this.workSpaceStore.getUserInfoById(workspaceId, user.id);
        if (!owner || owner.role !== 'owner') throw new Error('ACCESS_DENIED');

        return await this.workSpaceStore.remove(workspaceId, userToRemove.dataValues.id);
    }

    async myWorkspaces(page: number, limit: number, user: UserJwtPayload): Promise<List<WorkspaceDto>> {
        return await this.workSpaceStore.getWorkspacesByUserId(page, limit, user.id);
    }

    async getById(id: number, user: UserJwtPayload): Promise<WorkspaceDto | undefined> {
        const workspace = await this.workSpaceStore.getWorkspaceById(id);
        if (!workspace) return undefined;

        const membership = await this.workSpaceStore.getUserInfoById(id, user.id);
        if (!membership) return undefined;

        return workspace;
    }

    async update(id: number, name: string, type: WorkspaceType, user: UserJwtPayload): Promise<WorkspaceDto> {
        const workspace = await this.workSpaceStore.getWorkspaceById(id);
        if (!workspace) throw new Error("NOT_FOUND_WORKSPACE");

        const membership = await this.workSpaceStore.getUserInfoById(id, user.id);
        if (!membership || !["owner", "editor"].includes(membership.role)) throw new Error("ACCESS_DENIED");

        return await this.workSpaceStore.update(id, name, type);
    }

    async delete(id: number, user: UserJwtPayload): Promise<void> {
        const workspace = await this.workSpaceStore.getWorkspaceById(id);
        if (!workspace) throw new Error("NOT_FOUND_WORKSPACE");

        const membership = await this.workSpaceStore.getUserInfoById(id, user.id);
        if (!membership || membership.role !== "owner") throw new Error("ACCESS_DENIED");

        await this.workSpaceStore.delete(id);
    }
}