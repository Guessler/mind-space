import { $auth_http, $base_http } from "../consts/axios"
import { AuthDto } from "../types/auth"

const register = async (name: string, email: string, password: string) => {
    const {data} = await $base_http.post('/api/auth/register', {name, email, password})
    return data
}

const login = async ( email: string, password: string): Promise<string> => {
    const {data} = await $base_http.post('/api/auth/login', { email, password})
    return data
}

const auth = async (): Promise<AuthDto> => {
    const {data} = await $auth_http.get('/api/auth/')
    return data
}


export const authService = {
    register,
    login,
    auth
}