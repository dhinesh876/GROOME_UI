// import axios from "axios";

// const BASE_URL = "http://localhost:3000/auth";
// const Authrefresh = "http://localhost:3000/auth";

// const api = axios.create({
//     baseURL: `${BASE_URL}/admin`,
//     withCredentials: true,
// });

// const authApi = axios.create({
//     baseURL: `${Authrefresh}/user`,
//     withCredentials: true,
// });

// // Request interceptor
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("accessToken");

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // ================= Refresh Variables =================


// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//     failedQueue.forEach((promise) => {
//         if (error) {
//             promise.reject(error);
//         } else {
//             promise.resolve(token);
//         }
//     });

//     failedQueue = [];
// };

// // ================= Response Interceptor =================

// api.interceptors.response.use(
//     (response) => response,

//     async (error) => {
//         const originalRequest = error.config;

//         //console.log("API Error:", error.response?.status);

//         // Don't refresh the refresh-token request itself
//         if (originalRequest.url?.includes("/regenerate-token")) {
//             return Promise.reject(error);
//         }

//         if (
//             error.response?.status === 401 &&
//             !originalRequest._retry
//         ) {
//             originalRequest._retry = true;

//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 }).then((token) => {
//                     originalRequest.headers.Authorization = `Bearer ${token}`;
//                     return api(originalRequest);
//                 });
//             }

//             isRefreshing = true;

//             try {
//                 //console.log("Refreshing Access Token...");

//                 const res = await authApi.get("/regenerate-token");

//                 //console.log("Refresh Success", res.data);

//                 const newAccessToken = res.data.accessToken;

//                 if (!newAccessToken) {
//                     throw new Error("No access token received.");
//                 }

//                 // Save new token
//                 localStorage.setItem("accessToken", newAccessToken);

//                 // Update axios default header
//                 api.defaults.headers.common.Authorization =
//                     `Bearer ${newAccessToken}`;

//                 // Update failed request header
//                 originalRequest.headers.Authorization =
//                     `Bearer ${newAccessToken}`;

//                 // Resolve queued requests
//                 processQueue(null, newAccessToken);

//                 // Retry failed request
//                 const retryResponse = await api(originalRequest);

//                 //console.log("Retry Success");

//                 return retryResponse;

//             } catch (err) {

//                 //console.log("Refresh Failed");
//                 //console.log(err.response?.status);
//                 //console.log(err.response?.data);

//                 processQueue(err, null);

//                 // localStorage.removeItem("accessToken");
//                 // localStorage.removeItem("user");

//                 window.location.href = "/GROOME_UI/#/login";

//                 return Promise.reject(err);

//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         return Promise.reject(error);
//     }
// );


// src/api/adminApi.js
import axios from "axios";
import { refreshAccessToken } from "./authrefresh";

const BASE_URL = "https://groome-backend.onrender.com/auth";

const api = axios.create({
    baseURL: `${BASE_URL}/admin`,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes("/regenerate-token")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);


//get dashboard data
export const getDashboard = async () => {
    try {
        const response = await api.get("/dashboard");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}


export const getPendingShops = async () => {
    try {
        const response = await api.get("/pending-shops");
        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const approveShop = async (id) => {
    try {
        const response = await api.put(`/shop/${id}/approve`);

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const rejectShop = async (id) => {
    try {
        const response = await api.put(`/shop/${id}/reject`);
        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const getApprovedShops = async () => {
    try {
        const response = await api.get("/approved-shops");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const suspendShop = async (id) => {
    try {
        const response = await api.put(`/shop/${id}/suspend`);
        //console.log(response, " response ");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const activateShop = async (id) => {
    try {
        const response = await api.put(`/shop/${id}/activate`);
        //console.log(response, " response ");

        return response

    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}


export const getCustomers = async () => {
    try {
        const response = await api.get("/customers");
        //console.log(response);
        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const blockCustomer = async (id) => {
    try {
        const response = await api.put(`/customer/${id}/block`);
        //console.log(response, " response ");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const unblockCustomer = async (id) => {
    try {
        const response = await api.put(`/customer/${id}/unblock`);
        //console.log(response, " response ");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const getShopOwners = async () => {
    try {
        const response = await api.get("/shopowners");
        //console.log(response);
        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const blockShopOwner = async (id) => {
    try {
        const response = await api.put(`/shopowner/${id}/block`);
        //console.log(response, " response ");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const unblockShopOwner = async (id) => {
    try {
        const response = await api.put(`/shopowner/${id}/unblock`);
        //console.log(response, " response ");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}


export const getAppointments = async () => {
    try {
        const response = await api.get("/appointments");
        //console.log(response, " response ");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}


export const getServices = async () => {
    try {
        const response = await api.get("/services");
        //console.log(response, " response ");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const enableService = async (id) => {
    try {
        const response = await api.put(`/service/${id}/enable`);
        //console.log(response, " response ");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const disableService = async (id) => {
    try {
        const response = await api.put(`/service/${id}/disable`);
        //console.log(response, " response ");

        return response
    }
    catch (errr) {
        console.error("Error:", errr.response?.data || errr.message);
        throw errr;
    }
}

export const deleteNotification = () =>
    api.get("/admin/services1");

export const getNotifications = (id) =>
    api.patch(`/admin/service/${id}/enabl11e`);

export const markNotificationRead = (id) =>
    api.patch(`/admin/service/${id}/disab1le`);