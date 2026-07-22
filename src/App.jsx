import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
// import VerifyResetOtp from "./pages/VerifyResetOtp";
import ScrollToTop from "./componets/ScrollToTop";
import Dashboard from "./pages/Dashborad/Dashboard";

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        {<Route
          path="/dashboard"
          element={
            localStorage.getItem("accessToken")
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />}

        {/*{<Route
          path="/reset-password"
          element={<ResetPassword />}
        />} */}

        {/* add your protected /dashboard route here once login works */}
      </Routes>
    </HashRouter>
  );
}

