import { UserJwtPayload } from "../types/user";
import { UserWorkspaceInfoDto, WorkspaceDto, WorkspaceRoles } from "../types/workspace";

export interface IWorkspaceStore{
    create: (name: string, user: UserJwtPayload) => Promise<WorkspaceDto>;
    invite: (workspaceId: number, userId: number) => Promise<boolean>; 
    changeRole: (workspaceId: number,userId: number, role:  keyof typeof WorkspaceRoles) => Promise<boolean>;
    remove: (workspaceId: number, userId: number) => Promise<boolean>;
    getWorkspaceById: (workspaceId: number) => Promise<WorkspaceDto | undefined>;
    getUserInfoById: (workspaceId: number,userId: number) => Promise<UserWorkspaceInfoDto | undefined>;
}

export interface IWorkspaceManager{
    create: (name: string, user: UserJwtPayload) => Promise<WorkspaceDto>;
    invite: (workspaceId: number, email: string, user: UserJwtPayload) => Promise<boolean>; 
    changeRole: (workspaceId: number, email: string, role:  keyof typeof WorkspaceRoles, user: UserJwtPayload) => Promise<boolean>;
    remove: (workspaceId: number, email: string, user: UserJwtPayload) => Promise<boolean>;
}

