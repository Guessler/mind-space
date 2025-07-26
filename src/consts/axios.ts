// src/consts/axios.ts или подобный
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("❗ REACT_APP_API_BASE_URL is not defined. Check your .env file.");
}

export const $base_http = axios.create({
  baseURL: API_BASE_URL, // или process.env.REACT_APP_API_BASE_URL напрямую
});

export const $auth_http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const $unsplesh_http = axios.create({
  baseURL: "https://api.unsplash.com/photos/?client_id=YOUR_ACCESS_KEY",
});