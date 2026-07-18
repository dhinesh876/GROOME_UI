// src/api/authApi.js
// One place for every call to the auth backend (authController.js).
// Change BASE_URL to wherever your booking-api server actually runs.

import axios from "axios";

// const BASE_URL = "http://localhost:3000/auth/"; // <-- update to your real backend URL

const BASE_URL = "http://10.26.53.182:3000/auth/";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // needed if you're using cookie-based refresh tokens
});

// Register
// Matches: registerUser  (name, email, number, password, gender)
export const registerUser = async (data) => {

  try {
    const response = await api.post(BASE_URL + "register/user", data);

    console.log("Register New user Response:", response);
    console.log("Register New user Response Data:", response.data);

    return response;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}

// Verify OTP
// Matches: verifyOtp  (email, otp)
export const verifyOtp = async (data) => {

  try {
    const response = await api.post(BASE_URL + "register/verify-otp", data)

    console.log("Verify OTP for New user Response:", response);
    console.log("Verify OTP for New user Response Data:", response.data);

    return response;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}

// Reset OTP
// Matches: Reset  (email, otp)
export const resendOtp = async (data) => {
  try {
    const response = api.post(BASE_URL + "register/reset-otp", data)
    console.log("Reset OTP for New user Response:", response);
    console.log("Reset OTP for New user Response Data:", response.data);

    return response;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}


// Login
// Matches: login (email, password)
export const loginUser = async (data) => {
  try {
    const response = api.post(BASE_URL + "user/login", data);
    console.log("Login Response:", response);
    console.log("Login Response Data:", response.data);

    return response;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}


// Forgot password (step 1: request OTP by email) 
// Matches: forgotPassword (email)
export const forgotPassword = (data) => {

  try {
    const response = axios.post(
      BASE_URL + "user/forgot-pass",
      data
    );
    console.log("forgotPassword Response:", response);
    console.log("forgotPassword Response Data:", response.data);

    return response;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
};

// Forgot password (step 2: verify OTP + set new password)
// Matches: verifyOtp + resetPassword
export const resetPassword = async (data) => {
  try {
    const response = await axios.put(
      BASE_URL + "user/reset-pass",
      data
    );

    console.log("Response:", response);
    console.log("Response Data:", response.data);

    return response;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }

};

// --- Logout --------------------------------------------------------------
export const logoutUser = () => api.post(BASE_URL + "logout");

export default api;
