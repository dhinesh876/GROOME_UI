// src/api/userApi.js
import axios from "axios";

const BASE_URL = "https://groome-backend.onrender.com"; // <-- same host as your authApi.js; confirm the exact prefix per route below

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// adjust these two paths to whatever your backend actually exposes
export const getProfile = () => api.get("/users/me");
export const updateProfile = (data) => api.put("/users/me", data);

export default api;
