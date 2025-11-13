export type WorkspaceDto = {
    type: WorkspaceType;
    id: number;
    name: string;
}

export enum WorkspaceType {
    KANBAN_BOARD = 'KANBAN_BOARD',
    TODO_LIST = 'TODO_LIST',
    DROW_BOARD = 'DROW_BOARD',
}