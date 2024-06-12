import axios from "axios";

export const $base_http = axios.create({
    baseURL: "http://localhost:3050"
})

export const $auth_http = axios.create({
    baseURL: "http://localhost:3050",
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})