// src/api/authApi.js
// One place for every call to the auth backend (authController.js).
// Change BASE_URL to wherever your booking-api server actually runs.

import axios from "axios";

//npm run dev -- --host 0.0.0.0
// const BASE_URL = import.meta.env.VITE_API_URL + "/auth/"; //"http://localhost:3000/auth/"; // <-- update to your real backend URL

// console.log(import.meta.env.VITE_API_URL);
const BASE_URL = "https://groome-backend.onrender.com/auth/" //"https://groome-backend.onrender.com/auth/" //"http://10.26.53.182:3000/auth/";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // needed if you're using cookie-based refresh tokens
});

// Register
// Matches: registerUser  (name, email, number, password, gender)
export const registerUser = async (data) => {

  try {
    const response = await api.post(BASE_URL + "register/user", data);

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
    const response = await api.post(BASE_URL + "register/reset-otp", data)

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
    const response = await api.post(BASE_URL + "user/login", data);


    return response;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}


// Forgot password (step 1: request OTP by email) 
// Matches: forgotPassword (email)
export const forgotPassword = async (data) => {

  try {
    const response = await axios.post(
      BASE_URL + "user/forgot-pass",
      data
    );


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


    return response;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }

};

// --- Logout --------------------------------------------------------------
export const logoutUser = () => api.post(BASE_URL + "logout");

export default api;
