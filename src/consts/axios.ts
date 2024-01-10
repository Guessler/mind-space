import axios from "axios";

export const $base_http = axios.create({
    baseURL: "http://localhost:3001"
})