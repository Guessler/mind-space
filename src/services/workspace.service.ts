import { $auth_http } from "../consts/axios";
import { List } from "../types";
import { WorkspaceDto, WorkspaceType } from "../types/workspace";

const BASE_URL = `/api/workspace`;

const myWorkspaces = async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}): Promise<List<WorkspaceDto>> => {
    const { data } = await $auth_http.get(`${BASE_URL}/my-workspaces`, {
        params: { page, limit },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return data;
};

const create = async (type: WorkspaceType ,name: string): Promise<WorkspaceDto> => {
    const { data } = await $auth_http.post(`${BASE_URL}/create`, { name, type }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return data;
};

const getById = async (id: string): Promise<WorkspaceDto> => {
    const { data } = await $auth_http.get(`${BASE_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return data;
};

const update = async (id: string, payload: { name: string }): Promise<WorkspaceDto> => {
    const { data } = await $auth_http.put(`${BASE_URL}/${id}`, payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return data;
};

const deleteWorkspace = async (id: string): Promise<void> => {
    await $auth_http.delete(`${BASE_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
};

export const workspaceService = {
    myWorkspaces,
    create,
    getById,
    update,
    delete: deleteWorkspace,
};