import { $auth_http, $base_http } from "../consts/axios"

const register = async (name: string, email: string, password: string) => {
    const {data} = await $base_http.post('/api/auth/register', {name, email, password})
    return data
}

const login = async ( email: string, password: string) => {
    const {data} = await $base_http.post('/api/auth/login', { email, password})
    return data
}

const auth = async () => {
    const {data} = await $auth_http.get('/api/auth/')
    return data
}


export const authService = {
    register,
    login,
    auth
}