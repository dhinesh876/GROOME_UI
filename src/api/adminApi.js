import axios from "axios";

const BASE_URL = "https://groome-backend.onrender.com/auth";
const Authrefresh = "https://groome-backend.onrender.com/auth";

const api = axios.create({
    baseURL: `${BASE_URL}/admin`,
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
                const res = await authApi.get("/regenerate-token");

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

                return retryResponse;

            } catch (err) {

                processQueue(err, null);

                // FIX: these were commented out — meaning a stale, invalid
                // token stayed in localStorage after a failed refresh. The
                // next page load would try to use that same dead token
                // again, hit another 401, attempt another refresh, and
                // fail again — a loop that only looked like "logging out
                // every time" but was really "never actually clearing the
                // bad token in the first place".
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                localStorage.removeItem("city");

                window.location.href = "/GROOME_UI/#/login";

                return Promise.reject(err);

            } finally {
                isRefreshing = false;
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