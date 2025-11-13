import { List } from "../types";
import { UserJwtPayload } from "../types/user";
import { UserWorkspaceInfoDto, WorkspaceDto, WorkspaceRoles, WorkspaceType } from "../types/workspace";

export interface IWorkspaceStore {
    create: (type: WorkspaceType, name: string, user: UserJwtPayload) => Promise<WorkspaceDto>;
    invite: (workspaceId: number, userId: number) => Promise<boolean>;
    changeRole: (workspaceId: number, userId: number, role: keyof typeof WorkspaceRoles) => Promise<boolean>;
    remove: (workspaceId: number, userId: number) => Promise<boolean>;
    getWorkspaceById: (workspaceId: number) => Promise<WorkspaceDto | undefined>;
    getUserInfoById: (workspaceId: number, userId: number) => Promise<UserWorkspaceInfoDto | undefined>;
    getWorkspacesByUserId: (page: number, limit: number, userId: number) => Promise<List<WorkspaceDto>>;

    update: (id: number, name: string, type: WorkspaceType) => Promise<WorkspaceDto>;
    delete: (id: number) => Promise<void>;
}

export interface IWorkspaceManager {
    create: (type: WorkspaceType, name: string, user: UserJwtPayload) => Promise<WorkspaceDto>;
    invite: (workspaceId: number, email: string, user: UserJwtPayload) => Promise<boolean>;
    changeRole: (workspaceId: number, email: string, role: keyof typeof WorkspaceRoles, user: UserJwtPayload) => Promise<boolean>;
    remove: (workspaceId: number, email: string, user: UserJwtPayload) => Promise<boolean>;
    myWorkspaces: (page: number, limit: number, user: UserJwtPayload) => Promise<List<WorkspaceDto>>;
    getById: (id: number, user: UserJwtPayload) => Promise<WorkspaceDto | undefined>;

    update: (id: number, name: string, type: WorkspaceType, user: UserJwtPayload) => Promise<WorkspaceDto>;
    delete: (id: number, user: UserJwtPayload) => Promise<void>;
}