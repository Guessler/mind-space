import { IWorkspaceStore } from "../interfaces/workspace";
import { List } from "../types";
import { UserJwtPayload } from "../types/user";
import { UserWorkspaceInfoDto, WorkspaceDto, WorkspaceType } from "../types/workspace";
import { UserModel, WorkspaceModel, WorkspaceUserModel } from "./db/models";

export class WorkSpaceStore implements IWorkspaceStore {
    async create(type: WorkspaceType, name: string, user: UserJwtPayload): Promise<WorkspaceDto> {
        // Создаем workspace с type
        const workspace = await WorkspaceModel.create({ name, type });
        const workspaceData = workspace.dataValues;
        
        // Создаем связь с пользователем
        await WorkspaceUserModel.create({ 
            UserId: user.id, 
            WorkspaceId: workspaceData.id, 
            role: "owner" 
        });
        
        return workspaceData;
    }

    async getWorkspaceById(workspaceId: number): Promise<WorkspaceDto | undefined> {
        const workspace = await WorkspaceModel.findOne({ 
            where: { id: workspaceId }
        });
        
        if (!workspace) return undefined;
        
        const data = workspace.dataValues;
        return {
            id: data.id,
            name: data.name,
            type: data.type as WorkspaceType
        };
    }

    async invite(workspaceId: number, userId: number): Promise<boolean> {
        await WorkspaceUserModel.create({ WorkspaceId: workspaceId, UserId: userId, role: "viewer" });
        return true;
    }

    async changeRole(workspaceId: number, userId: number, role: "owner" | "editor" | "viewer" | "guest"): Promise<boolean> {
        const [status] = await WorkspaceUserModel.update({ role }, { where: { WorkspaceId: workspaceId, UserId: userId } });
        return status === 1;
    }

    async remove(workspaceId: number, userId: number): Promise<boolean> {
        const status = await WorkspaceUserModel.destroy({ where: { WorkspaceId: workspaceId, UserId: userId } });
        return status === 1;
    }

    async getUserInfoById(workspaceId: number, userId: number): Promise<UserWorkspaceInfoDto | undefined> {
        const data = await WorkspaceUserModel.findOne({ where: { UserId: userId, WorkspaceId: workspaceId } });
        return data?.dataValues;
    }

    async getWorkspacesByUserId(page: number, limit: number, userId: number): Promise<List<WorkspaceDto>> {
        const offset = page * limit - limit;
        const data = await WorkspaceModel.findAndCountAll({
            include: [{
                model: UserModel,
                where: { id: userId }
            }],
            limit,
            offset
        });
        return { count: data.count, rows: data.rows.map(row => row.dataValues) };
    }

    async update(id: number, name: string, type: WorkspaceType): Promise<WorkspaceDto> {
        const [updated] = await WorkspaceModel.update({ name, type }, { where: { id } });
        if (updated === 0) throw new Error("NOT_FOUND_WORKSPACE");
        const workspace = await WorkspaceModel.findByPk(id);
        return workspace!.dataValues;
    }

    async delete(id: number): Promise<void> {
        const deleted = await WorkspaceModel.destroy({ where: { id } });
        if (deleted === 0) throw new Error("NOT_FOUND_WORKSPACE");
    }
}