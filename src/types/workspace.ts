export type WorkspaceDto = {
    id: number;
    name: string;
}

export type UserWorkspaceInfoDto = {
    id: number;
    UserId: number;
    WorkspaceId: number;
    role: keyof typeof WorkspaceRoles
}

export enum WorkspaceRoles {
    owner="OWNER",
    editor="EDITOR",
    viewer="VIEWER",
    guest="GUEST"
}