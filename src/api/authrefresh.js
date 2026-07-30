// src/api/authRefresh.js
//
// ONE shared token-refresh coordinator, used by every other api file
// (shopApi, appointmentApi, slotApi, userApi, adminApi, authApi).
//
// Why this file exists: each api file previously had its OWN separate
// isRefreshing/failedQueue variables and its OWN authApi instance. That
// meant if two different files each hit a 401 around the same time,
// they'd BOTH independently call /regenerate-token — racing each other.
// Since the backend rotates (overwrites) the stored refresh token on
// every successful call, the second racing call fails with
// "refresh token not found in database" even though nothing is
// actually wrong — it just lost the race to the first one.
//
// Centralizing isRefreshing/failedQueue here means there is exactly
// ONE in-flight refresh call at any moment, app-wide, no matter which
// api file triggered it.

import axios from "axios";

const Authrefresh = "http://localhost:3000/auth";

const authApi = axios.create({
    baseURL: `${Authrefresh}/user`,
    withCredentials: true,
});

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

// Call this from EVERY api file's response interceptor instead of each
// file rolling its own refresh logic. Returns the new access token on
// success, or throws on failure (caller should redirect to login).
export const refreshAccessToken = () => {
    if (isRefreshing) {
        // a refresh is already in flight (from this or any other api file) —
        // queue this caller and resolve/reject it once that one finishes,
        // instead of firing a second competing request
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;

    return authApi
        .get("/regenerate-token")
        .then((res) => {
            const newAccessToken = res.data.accessToken;

            if (!newAccessToken) {
                throw new Error("No access token received.");
            }

            localStorage.setItem("accessToken", newAccessToken);
            processQueue(null, newAccessToken);

            return newAccessToken;
        })
        .catch((err) => {
            processQueue(err, null);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            localStorage.removeItem("city");

            window.location.href = "/GROOME_UI/#/login";

            throw err;
        })
        .finally(() => {
            isRefreshing = false;
        });
};