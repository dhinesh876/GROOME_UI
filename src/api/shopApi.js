// src/api/shopApi.js
//
// Calls for everything the dashboard needs, matching your
// shopController.js and appointmentController.js endpoints.
// Update BASE_URL to your real backend.

import axios from "axios";

const BASE_URL = "https://groome-backend.onrender.com";
const Authrefresh = "https://groome-backend.onrender.com/auth";

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

        // localStorage.removeItem("accessToken");
        // localStorage.removeItem("user");

        window.location.href = "/GROOME_UI/#/login";

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


// --- Shop owner side --------------------------------------------------
export const getMyShop = async () => {
  try {
    const response = await api.get("/getMyShop");
    return response
  }
  catch (errr) {
    console.error("Error:", errr.response?.data || errr.message);
    throw errr;
  }
};

export const setupShop = async (data) => {
  try {
    const response = await api.post("/setup", data)

    console.log(response);
  }
  catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
};

export const updateShop = (data) => api.put("/shops/mine", data);
export const getShopAppointments = async (shopid) => {

  try {

    const response = await api.get(`/getmyshopAppointment/${shopid}`);
    return response;
  }
  catch (err) {
    console.error("Error:", err.response?.data || err.message);

  }
}

export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    console.log("status", status)
    const response = await api.put(`/updateAppointmentstatus/${appointmentId}`, { status });
    return response;
  }
  catch (err) {
    console.error("Error:", err.response?.data || err.message);

  }
}
// --- Managing services / employees after the shop already exists ------
// adjust these paths to match your real shopController routes

function toTitleCase(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const addService = async (data, shopId) => {
  try {

    const shopservices = {
      ...data,
      servicename: toTitleCase(data.servicename),
    };
    const res = await api.post(`/${shopId}/addservice`, { shopservices });       // { servicename, price, duration }
    return res;
  }
  catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

export const deleteService = async (shopId, servicenames_id) => {
  try {
    const res = await api.delete(`/${shopId}/removeservices`, {
      data: {
        servicenames_id: servicenames_id,
      },
    });
    return res;
  }
  catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }

}

export const updateService = (shopId, data) => api.put(`/${shopId}/addservice`, data);


export const addEmployee = async (shopId, data) => {
  try {
    console.log(data);
    const res = await api.post(`/${shopId}/addemployee`, data);     // { name, gender, employeeServices };
    console.log(res);

    return res;
  }
  catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}


export const updateEmployee = async (shopId, employeeId, data) => {
  try {
    console.log(shopId, employeeId, data);
    const res = await api.put(`/${shopId}/employee/${employeeId}`, data);
    console.log(res);

    return res;
  }
  catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }

}

export const deleteEmployee = async (shopId, employeeId) => {
  try {
    console.log(shopId, employeeId);
    const res = await api.delete(`/${shopId}/removesemployee`, { data: { employee_id: employeeId } });   // ← wrap in { data }, this is required for DELETE
    console.log(res);
    return res;
  }
  catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}


export const getExistingServices = async () => {
  try {
    const res = await api.get("/shop/services");
    console.log(res);
    return res;
  }
  catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
};
export default api;
