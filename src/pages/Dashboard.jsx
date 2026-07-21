// src/pages/dashboard/Dashboard.jsx
//
// Reads the logged-in user's role (saved at login) and renders the
// right dashboard. Both dashboards share the same topbar/tabs shell.

import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
// import CustomerDashboard from "./CustomerDashboard";
// import ShopOwnerDashboard from "./ShopOwnerDashboard";


export default function Dashboard() {
  const navigate = useNavigate();

  // saved as JSON in Login.jsx after a successful login
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "customer"; // "customer" | "shopowner" (match your backend's role values)

  // const [tab, setTab] = useState("home");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dash-shell">
      <div className="dash-topbar">
        <div className="dash-logo">
          the <span>circle</span> co.
        </div>
        <div className="dash-user">
          <span className="dash-role-badge">{role === "shopowner" ? "Shop owner" : "Customer"}</span>
          <button className="dash-logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {/* {role === "shopowner" ? (
        <ShopOwnerDashboard tab={tab} setTab={setTab} />
      ) : (
        <CustomerDashboard tab={tab} setTab={setTab} />
      )} */}
    </div>
  );
}
