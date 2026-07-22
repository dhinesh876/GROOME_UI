// src/api/shopApi.js
//
// Calls for everything the dashboard needs, matching your
// shopController.js and appointmentController.js endpoints.
// Update BASE_URL to your real backend.

import axios from "axios";

const BASE_URL = "http://localhost:3000";
const Authrefresh = "http://localhost:3000/auth";

const api = axios.create({
  baseURL: `${BASE_URL}/shop`,
  withCredentials: true,
});

const authApi = axios.create({
  baseURL: `${Authrefresh}/user`,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= Refresh Variables =================


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// ================= Response Interceptor =================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    console.log("API Error:", error.response?.status);

    // Don't refresh the refresh-token request itself
    if (originalRequest.url?.includes("/regenerate-token")) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        console.log("Refreshing Access Token...");

        const res = await authApi.get("/regenerate-token");

        console.log("Refresh Success", res.data);

        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token received.");
        }

        // Save new token
        localStorage.setItem("accessToken", newAccessToken);

        // Update axios default header
        api.defaults.headers.common.Authorization =
          `Bearer ${newAccessToken}`;

        // Update failed request header
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // Resolve queued requests
        processQueue(null, newAccessToken);

        // Retry failed request
        const retryResponse = await api(originalRequest);

        console.log("Retry Success");

        return retryResponse;

      } catch (err) {

        console.log("Refresh Failed");
        console.log(err.response?.status);
        console.log(err.response?.data);

        processQueue(err, null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        window.location.href = "/GROOME_UI/login";

        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// --- Customer side --------------------------------------------------
export const browseShops = (userid) => api.get(`/browserShops/${userid}`); // search/filter query params
export const getShopById = (shopId, userid) => api.get(`/browserShops/${shopId}/${userid}`);
export const getMyAppointments = () => api.get("/appointments/mine");

// --- Shop owner side --------------------------------------------------
export const getMyShop = () => api.get("/shops/mine");
export const setupShop = (data) => api.post("/shops", data);
export const updateShop = (data) => api.put("/shops/mine", data);
export const getShopAppointments = () => api.get("/appointments/shop");

// --- Managing services / employees after the shop already exists ------
// adjust these paths to match your real shopController routes
export const addService = (data) => api.post("/shops/services", data);       // { servicename, price, duration }
export const updateService = (serviceId, data) => api.put(`/shops/services/${serviceId}`, data);
export const deleteService = (serviceId) => api.delete(`/shops/services/${serviceId}`);

export const addEmployee = (data) => api.post("/shops/employees", data);     // { name, gender, employeeServices }
export const updateEmployee = (employeeId, data) => api.put(`/shops/employees/${employeeId}`, data);
export const deleteEmployee = (employeeId) => api.delete(`/shops/employees/${employeeId}`);

export default api;
