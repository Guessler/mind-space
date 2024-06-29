import { $auth_http } from "../consts/axios"
import { List } from "../types"
import { WorkspaceDto } from "../types/workspace"

const BASE_URl = `/api/workspace`

const myWorkspaces = async ({page = 1, limit = 20}): Promise<List<WorkspaceDto>> => {
    const {data} = await $auth_http.get(`${BASE_URl}/my-workspaces?page=${page}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    return data
} 

const create = async (name: string): Promise<WorkspaceDto> => {
    const {data} = await $auth_http.post(`${BASE_URl}/create`, {name}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    return data
}

const getById = async (id: string): Promise<WorkspaceDto> => {
    const {data} = await $auth_http.get(`${BASE_URl}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    return data
}

export const workspaceService = {
    myWorkspaces,
    create,
    getById
}