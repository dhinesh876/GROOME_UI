import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
// import VerifyResetOtp from "./pages/VerifyResetOtp";
import ScrollToTop from "./componets/ScrollToTop";
import AdminAppointments from "./pages/AdminAppointments";
import AdminCustomers from "./pages/AdminCustomers";
import AdminDashboard from "./pages/AdminDashboard";
import AdminNotifications from "./pages/AdminNotifications";
import AdminPendingShops from "./pages/AdminPendingShops";
import AdminServices from "./pages/AdminServices";
import AdminShopOwners from './pages/AdminShopOwners';
import AdminApprovedShops from "./pages/ApprovedShops";
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
          element={<Dashboard />}
        />}

        {<Route
          path="/admindashboard"
          element={<AdminDashboard />}
        />}


        <Route
          path="/admin/pending-shops"
          element={<AdminPendingShops />}
        />

        <Route
          path="/admin/approved-shops"
          element={<AdminApprovedShops />}
        />

        <Route
          path="/admin/customers-shops"
          element={<AdminCustomers />}
        />

        <Route
          path="/admin/shopowner-shops"
          element={<AdminShopOwners />}
        />

        <Route
          path="/admin/appointments-shops"
          element={<AdminAppointments />}
        />

        <Route
          path="/admin/Services-shops"
          element={<AdminServices />}
        />

        <Route
          path="/admin/notification-shops"
          element={<AdminNotifications />}
        />

        {/*{<Route
          path="/reset-password"
          element={<ResetPassword />}
        />} */}

        {/* add your protected /dashboard route here once login works */}
      </Routes>
    </HashRouter >
  );
}

