
import { IWorkspaceManager, IWorkspaceStore } from "../interfaces/workspace";
import { UserModel } from "../store/db/models";
import { UserJwtPayload } from "../types/user";
import { WorkspaceDto } from "../types/workspace";

export class WorkspaceManager implements IWorkspaceManager{

    constructor(private readonly workSpaceStore: IWorkspaceStore){}

    async create (name: string, user: UserJwtPayload): Promise<WorkspaceDto>{

        return await this.workSpaceStore.create(name, user)
    }

    private async getUserByEmail(email: string){
        return await UserModel.findOne({where: {email}})
    }

    async invite (workspaceId: number, email: string, user: UserJwtPayload) :Promise<boolean>{

        const workspace = await this.workSpaceStore.getWorkspaceById(workspaceId)
        if(!workspace){
            throw new Error("NOT_FOUND_WORKSPACE")
        }

        // TODO: ДОБАВИТЬ USERSTORE
        const userInvite = await this.getUserByEmail(email)
        if(!userInvite){
            throw new Error("NOT_FOUND_USER_TO_INVITE")
        }

        const owner = await this.workSpaceStore.getUserInfoById(workspaceId, user.id)
        if(!owner || owner.role !== 'owner'){
            throw new Error('ACCESS_DENIDED')
        }

        
        if(userInvite.dataValues.id === user.id){
            throw new Error("CANNOT_INVITE_YOURSELF")
        }

        return await this.workSpaceStore.invite(workspaceId, userInvite.dataValues.id)
    }
    async changeRole (workspaceId: number, email: string, role: "owner" | "editor" | "viewer" | "guest", user: UserJwtPayload): Promise<boolean>{
        throw new Error("not")
    }
    async remove (workspaceId: number, email: string, user: UserJwtPayload): Promise<boolean>{

        const workspace = await this.workSpaceStore.getWorkspaceById(workspaceId)
        if(!workspace){
            throw new Error("THIS_WORKSPACE_IS_ALREDY_THERE")
        }
        
        const userToRemove = await this.getUserByEmail(email)
        if(!userToRemove){
            throw new Error("THERES_A_USER_WITH_THIS_EMAIL")
        }

        if(userToRemove.dataValues.id === user.id){
            throw new Error("THIS_IS_YOU")
        }
        
        return await this.workSpaceStore.remove(workspaceId, userToRemove.dataValues.id);
    }
    
}