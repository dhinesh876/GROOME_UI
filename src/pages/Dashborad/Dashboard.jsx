// // src/pages/dashboard/Dashboard.jsx
// //
// // Reads the logged-in user's role (saved at login) and renders the
// // right dashboard. Both dashboards share the same topbar/tabs shell.

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/Dashboard.css";
// import CustomerDashboard from "../Dashborad/CustomerDashboard";
// import LocationSearchBar from "../Dashborad/LocationAccess";
// import ShopOwnerDashboard from "../Dashborad/ShopOwnerDashboard";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   // saved as JSON in Login.jsx after a successful login
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const role = user.role || "customer"; // "customer" | "shopowner" (match your backend's role values)

//   const [tab, setTab] = useState("home");

//   const [search, setSearch] =
//     useState("");

//   // detected/entered via LocationAccess (Step 1 -> Step 2 flow)
//   const [city, setCity] = useState("");

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className="dash-shell">
//       <div className="dash-topbar">

//         <div className="dash-logo">
//           <span>Groome</span>
//         </div>


//         {role === "customer" ? (
//           <LocationSearchBar
//             city={city}
//             onCityChange={setCity}
//             search={search}
//             onSearchChange={setSearch}
//           // onSearchEnter={loadShops}
//           />
//         ) : ("")}

//         <div className="dash-user">
//           <span className="dash-role-badge">{role === "shopowner" ? "Shop owner" : "Customer"}</span>
//           <button className="dash-logout-btn" onClick={handleLogout}>
//             Log out
//           </button>
//         </div>
//       </div>

//       {role === "shopowner" ? (
//         <ShopOwnerDashboard tab={tab} setTab={setTab} />
//       ) : (
//         <CustomerDashboard tab={tab} setTab={setTab} />
//       )}

//     </div>
//   );
// }


// src/pages/dashboard/Dashboard.jsx
//
// Reads the logged-in user's role (saved at login) and renders the
// right dashboard. Both dashboards share the same topbar/tabs shell.

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/Dashboard.css";
// import CustomerDashboard from "../Dashborad/CustomerDashboard";
// import LocationSearchBar from "../Dashborad/LocationAccess";
// import ShopOwnerDashboard from "../Dashborad/ShopOwnerDashboard";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   // saved as JSON in Login.jsx after a successful login
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const role = user.role || "customer"; // "customer" | "shopowner" (match your backend's role values)

//   const [tab, setTab] = useState("home");

//   const [search, setSearch] =
//     useState("");

//   // detected/entered via LocationAccess (Step 1 -> Step 2 flow)
//   // FIX: read any previously-detected/selected city from localStorage on
//   // first load, so it survives page refreshes instead of re-prompting
//   // for location access every single time.
//   const [city, setCity] = useState(
//     () => localStorage.getItem("city") || ""
//   );

//   // FIX: keep localStorage in sync whenever the city changes, the same
//   // way "user" is persisted after login.
//   const handleCityChange = (newCity) => {
//     setCity(newCity);
//     localStorage.setItem("city", newCity);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("user");
//     localStorage.removeItem("city");
//     navigate("/login");
//   };

//   return (
//     <div className="dash-shell">
//       <div className="dash-topbar">

//         <div className="dash-logo">
//           <span>Groome</span>
//         </div>

//         {role === "customer" ? (
//           <LocationSearchBar
//             city={city}
//             onCityChange={handleCityChange}
//             search={search}
//             onSearchChange={setSearch}
//           // onSearchEnter={loadShops}
//           />
//         ) : ("")}

//         <div className="dash-user">
//           <span className="dash-role-badge">{role === "shopowner" ? "Shop owner" : "Customer"}</span>
//           <button className="dash-logout-btn" onClick={handleLogout}>
//             Log out
//           </button>
//         </div>
//       </div>

//       {/* {role === "shopowner" ? (
//         <ShopOwnerDashboard tab={tab} setTab={setTab} />
//       ) : (
//         <CustomerDashboard tab={tab} setTab={setTab} />
//       )} */}


//       {role === "shopowner" ? (

//         <ShopOwnerDashboard
//           tab={tab}
//           setTab={setTab}
//         />

//       ) : (

//         <>

//           {!city && (

//             <LocationSearchBar
//               city={city}
//               onCityChange={handleCityChange}
//               search={search}
//               onSearchChange={setSearch}
//             />

//           )}

//           <CustomerDashboard
//             tab={tab}
//             setTab={setTab}
//             city={city}
//             search={search}
//           />

//         </>

//       )}
//     </div>
//   );
// }


// src/pages/dashboard/Dashboard.jsx
//
// Reads the logged-in user's role (saved at login) and renders the
// right dashboard. Both dashboards share the same topbar/tabs shell.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import CustomerDashboard from "../Dashborad/CustomerDashboard";
import LocationSearchBar from "../Dashborad/LocationAccess";
import ShopOwnerDashboard from "../Dashborad/ShopOwnerDashboard";

export default function Dashboard() {
  const navigate = useNavigate();

  // saved as JSON in Login.jsx after a successful login
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "customer"; // "customer" | "shopowner" (match your backend's role values)

  const [tab, setTab] = useState("home");

  const [search, setSearch] =
    useState("");

  // detected/entered via LocationAccess (Step 1 -> Step 2 flow)
  // FIX: read any previously-detected/selected city from localStorage on
  // first load, so it survives page refreshes instead of re-prompting
  // for location access every single time.
  const [city, setCity] = useState(
    () => localStorage.getItem("city") || ""
  );

  // FIX: keep localStorage in sync whenever the city changes, the same
  // way "user" is persisted after login.
  const handleCityChange = (newCity) => {
    setCity(newCity);
    localStorage.setItem("city", newCity);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("city");
    navigate("/login");
  };

  return (
    <div className="dash-shell">
      <div className="dash-topbar">

        <div className="dash-left">

          <div className="dash-logo">
            <span>Groome</span>
          </div>

          {role === "customer" ? (
            <LocationSearchBar
              city={city}
              onCityChange={handleCityChange}
              search={search}
              onSearchChange={setSearch}
            // onSearchEnter={loadShops}
            />
          ) : ("")}

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
        // <CustomerDashboard tab={tab} setTab={setTab} />
        
        
      )} */}



      {role === "shopowner" ? (

        <ShopOwnerDashboard
          tab={tab}
          setTab={setTab}
        />

      ) : (

        <>

          {!city && (

            <LocationSearchBar
              city={city}
              onCityChange={handleCityChange}
              search={search}
              onSearchChange={setSearch}
            />

          )}

          <CustomerDashboard
            tab={tab}
            setTab={setTab}
            city={city}
            search={search}
          />

        </>

      )}


    </div>
  );
}