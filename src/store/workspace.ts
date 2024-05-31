import { IWorkspaceStore } from "../interfaces/workspace";
import { UserJwtPayload } from "../types/user";
import { UserWorkspaceInfoDto, WorkspaceDto } from "../types/workspace";
import { WorkspaceModel, WorkspaceUserModel } from "./db/models";

export class WorkSpaceStore implements IWorkspaceStore{
    async create (name: string, user: UserJwtPayload): Promise<WorkspaceDto>{
        const {dataValues} = await WorkspaceModel.create({name})
        await WorkspaceUserModel.create({UserId:user.id, WorkspaceId: dataValues.id, role: "owner"})

        return dataValues
    }
    async getWorkspaceById (workspaceId: number) : Promise<WorkspaceDto | undefined>{
        const workspace = await WorkspaceModel.findOne({where: {id: workspaceId}})
        return workspace?.dataValues
    }

    async invite (workspaceId: number, userId: number): Promise<boolean>{
        await WorkspaceUserModel.create({WorkspaceId: workspaceId, UserId: userId, role: "viewer"})

        return true
    }
    async changeRole (workspaceId: number, userId: number, role: "owner" | "editor" | "viewer" | "guest"): Promise<boolean>{
        const [status] = await WorkspaceUserModel.update({role},{where: {WorkspaceId: workspaceId, UserId: userId}}) 
        return status === 1
    }
    async remove (workspaceId: number, userId: number): Promise<boolean>{
        const status = await WorkspaceUserModel.destroy({where: {WorkspaceId: workspaceId, UserId: userId}})
        return status === 1
    }

    async getUserInfoById (workspaceId: number,userId: number) : Promise<UserWorkspaceInfoDto | undefined>{
        const data = await WorkspaceUserModel.findOne({where: {UserId: userId, WorkspaceId: workspaceId}})
        console.log(data)
        return data?.dataValues
    }


}