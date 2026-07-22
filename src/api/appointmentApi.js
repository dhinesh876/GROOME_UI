// src/api/appointmentApi.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/shops"; // <-- same host as your authApi.js; confirm the exact prefix per route below

const Authrefresh = "http://localhost:3000/auth";


const api = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,

  paramsSerializer: {
    indexes: null,
  },
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

        window.location.href = "/GROOME_UI/login";

        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// // Matches: createAppointment
// // Send only what appointmentValidation.js expects — raw client input:
// // { employeeId, services: [serviceIds], date, starttime }
// // (shopid/price/duration/totalDuration/totalPrice are server-calculated, don't send them)
// export const createAppointment = async (shopId, data) => {

//   try {
//     const response = await api.post(`/createappointment/${shopId}`, data);

//     console.log("createappointment Response:", response);
//     console.log("createappointment Response Data:", response.data);

//     return response;
//   } catch (error) {
//     console.error("Error:", error.response?.data || error.message);
//     throw error;
//   }
// }

// export const cancelAppointment = (appointmentId) =>
//   api.patch(`/appointments/${appointmentId}/cancel`);

// Matches: createAppointment(shopId, data)
// data = { customerId, date, employeeId, services: [{serviceItemId}], starttime }
// Route is shop-scoped (/:shopId/appointments) to match the pattern your
// other shop routes already use (slots, employees-with-slots, etc.)
export const createAppointment = async (shopId, data) => {

  try {
    const response = await api.post(`/createappointment/${shopId}`, data);
    console.log("createappointment Response:", response);
    console.log("createappointment Response Data:", response.data);
    return response;
  }
  catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}

// export const getMyAppointments = () => api.get("/appointments/mine");

export const getMyAppointments = async () => {

  try {
    const appoinmetdata = await api.get("/getmyAppointment");

    console.log(appoinmetdata);
    return appoinmetdata;
  }
  catch (err) {
    console.log(err)
  }
}

export const cancelAppointment = async (appointmentId) => {

  try {
    const canceldata = await api.put(`/cancelAppoinment/${appointmentId}`);

    return canceldata;
  } catch (err) {
    console.log(err);
    throw err;
  }
}


export default api;
