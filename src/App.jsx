import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
// import VerifyResetOtp from "./pages/VerifyResetOtp";
// import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        {/* {<Route
          path="/verify-reset-otp"
          element={<VerifyResetOtp />}
        />}

        {<Route
          path="/reset-password"
          element={<ResetPassword />}
        />} */}

        {/* add your protected /dashboard route here once login works */}
      </Routes>
    </BrowserRouter>
  );
}
