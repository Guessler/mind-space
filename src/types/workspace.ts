export type WorkspaceDto = {
    type: WorkspaceType;
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


export enum WorkspaceType {
    KANBAN_BOARD = 'KANBAN_BOARD',
    TODO_LIST = 'TODO_LIST',
    DROW_BOARD = 'DROW_BOARD',
}