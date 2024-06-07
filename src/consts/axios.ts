import axios from "axios";

export const $base_http = axios.create({
    baseURL: "http://localhost:3030"
})

export const $auth_http = axios.create({
    baseURL: "http://localhost:3030",
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})