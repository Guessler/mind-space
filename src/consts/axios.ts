import axios from "axios";

export const $base_http = axios.create({
    // baseURL: "http://localhost:8080"
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

export const $auth_http = axios.create({
    // baseURL: "http://localhost:8080",
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

export const $unsplesh_http = axios.create({
    baseURL: "https://api.unsplash.com/photos/?client_id=YOUR_ACCESS_KEY"
})