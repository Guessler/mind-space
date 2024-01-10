// findFn
// findItemsFn
// createFn
// updateFn
// deleteFn

import { $base_http } from "../consts/axios"
import { TaskType } from "../modules/Todo/types"

const BASE_URL = `/todo`

const findItemsFn = async (page: number, count: number): Promise<{count: number, data: TaskType[]}> => {
    const {data} = await $base_http.get(`${BASE_URL}/list?page=${page}&count=${count}`)
    return data
}

const createFn = async (name: string): Promise<TaskType> => {
    const {data} = await $base_http.post(`${BASE_URL}/`, {name})
    return data
}

const findFn = async (id: string): Promise<TaskType> => {
    const {data} = await $base_http.get(`${BASE_URL}/todo/${id}`)
    return data
}



export const todoService = {
    findItemsFn,
    createFn,
    findFn
}