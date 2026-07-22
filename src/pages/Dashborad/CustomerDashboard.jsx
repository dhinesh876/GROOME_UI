// // src/pages/dashboard/CustomerDashboard.jsx
// import { useCallback, useEffect, useState } from "react";
// import { browseShops, getShopById } from "../../api/shopApi";
// import BookAppointment from "../Dashborad/BookAppointment";
// import Profile from "../Dashborad/Profile";

// export default function CustomerDashboard({ tab, setTab }) {
//   const [shops, setShops] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedShop, setSelectedShop] = useState(null); // null = grid view, object = detail view
//   const [search, setSearch] = useState("");
//   const [booking, setBooking] = useState(false); // false = shop details, true = show booking flow
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   // const loadShops = async () => {
//   //   setLoading(true);
//   //   setError("");
//   //   try {
//   //     const res = await browseShops({ search });
//   //     setShops(res.data.shops || res.data); // adjust to match your actual response shape
//   //   } catch (err) {
//   //     setError(err.response?.data?.message || "Could not load shops.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const loadShops = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await browseShops(user.userid);
//       setShops(res.data.shops || res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not load shops.");
//     } finally {
//       setLoading(false);
//     }
//   }, [user.userid]);

//   useEffect(() => {
//     loadShops();
//   }, [loadShops]);

//   const openShop = async (shopId) => {
//     try {
//       const res = await getShopById(shopId, user.userid);
//       console.log(res.data.shop);
//       setSelectedShop(res.data.shop || res.data);
//       setBooking(false);
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not load shop details.");
//     }
//   };

//   return (
//     <>
//       <div className="dash-tabs">
//         <button className={`dash-tab ${tab === "home" ? "active" : ""}`} onClick={() => { setTab("home"); setSelectedShop(null); }}>
//           Browse shops
//         </button>
//         <button className={`dash-tab ${tab === "appointments" ? "active" : ""}`} onClick={() => setTab("appointments")}>
//           My appointments
//         </button>
//         <button className={`dash-tab ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>
//           Profile
//         </button>
//       </div>

//       <div className="dash-content">
//         {tab === "profile" && <Profile />}

//         {tab === "home" && !selectedShop && (
//           <>
//             <h1 className="dash-heading">Find a shop</h1>
//             <p className="dash-subheading">Browse nearby salons and services.</p>

//             <div className="dash-field" style={{ maxWidth: 320, marginBottom: 20 }}>
//               <input
//                 placeholder="Search shops..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && loadShops()}
//               />
//             </div>

//             {error && <p className="auth-error">{error}</p>}

//             {loading ? (
//               <p className="empty-state">Loading shops...</p>
//             ) : shops.length === 0 ? (
//               <p className="empty-state">No shops found yet.</p>
//             ) : (
//               <div className="shop-grid">
//                 {shops.map((shop) => (
//                   <div key={shop._id} className="shop-card" onClick={() => openShop(shop._id)}>
//                     <div
//                       className="shop-card-photo"
//                       style={shop.photo ? { backgroundImage: `url(${shop.photo})`, backgroundSize: "cover" } : undefined}
//                     />
//                     <div className="shop-card-body">
//                       <p className="shop-card-name">{shop.shopname}</p>
//                       <p className="shop-card-meta">{shop.address}</p>
//                       <div className="pill-row">
//                         <span className="pill">{shop.genderCategory}</span>
//                         <span className="pill">{shop.openingTime}–{shop.closingTime}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         {tab === "home" && selectedShop && (
//           <div className="detail-card">
//             <button
//               className="detail-back"
//               onClick={() => (booking ? setBooking(false) : setSelectedShop(null))}
//             >
//               ← {booking ? "Back to shop" : "Back to results"}
//             </button>
//             <h1 className="dash-heading">{selectedShop.shopname}</h1>
//             <p className="dash-subheading">{selectedShop.address}</p>

//             {!booking ? (
//               <>
//                 <h3 style={{ marginBottom: 10 }}>Services</h3>
//                 <div className="pill-row" style={{ marginBottom: 24 }}>
//                   {(selectedShop.services || []).map((s) => (
//                     <span className="pill" key={s._id}>
//                       {s.servicename} · ₹{s.price}
//                     </span>
//                   ))}
//                 </div>
//                 <button className="btn-primary" onClick={() => setBooking(true)}>
//                   Book appointment
//                 </button>
//               </>
//             ) : (
//               <BookAppointment shop={selectedShop} onBooked={() => setTab("appointments")} />
//             )}
//           </div>
//         )}

//         {tab === "appointments" && (
//           <>
//             <h1 className="dash-heading">My appointments</h1>
//             <p className="dash-subheading">Wire this tab up to getMyAppointments() the same way as the shop grid above.</p>
//           </>
//         )}
//       </div>
//     </>
//   );
// }



// src/pages/dashboard/CustomerDashboard.jsx

// import {
//   useCallback,
//   useEffect,
//   useState,
// } from "react";

// import {
//   browseShops,
//   getShopById,
// } from "../../api/shopApi";

// import BookAppointment from "./BookAppointment";

// import Profile from "./Profile";


// export default function CustomerDashboard({
//   tab,
//   setTab,
// }) {
//   const [shops, setShops] = useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   // null = shop list
//   // object = selected shop details
//   const [selectedShop, setSelectedShop] =
//     useState(null);

//   const [search, setSearch] =
//     useState("");

//   // false = shop details
//   // true = booking flow
//   const [booking, setBooking] =
//     useState(false);


//   const user = JSON.parse(
//     localStorage.getItem("user") || "{}"
//   );


//   /*
//   ============================================
//   LOAD SHOPS
//   ============================================
//   */

//   const loadShops = useCallback(
//     async () => {
//       setLoading(true);

//       setError("");


//       try {
//         const response =
//           await browseShops(
//             user.userid,
//             search
//           );


//         setShops(
//           response.data.shops ||
//           response.data
//         );

//       } catch (err) {
//         setError(
//           err.response?.data?.message ||
//           "Could not load shops."
//         );
//       } finally {
//         setLoading(false);
//       }
//     },
//     [
//       user.userid,
//       search,
//     ]
//   );


//   useEffect(() => {
//     loadShops();
//   }, [loadShops]);


//   /*
//   ============================================
//   OPEN SHOP DETAILS
//   ============================================
//   */

//   const openShop = async (
//     shopId
//   ) => {
//     setError("");


//     try {
//       const response =
//         await getShopById(
//           shopId,
//           user.userid
//         );


//       setSelectedShop(
//         response.data.shop ||
//         response.data
//       );


//       setBooking(false);

//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//         "Could not load shop details."
//       );
//     }
//   };


//   /*
//   ============================================
//   BACK TO SHOP LIST
//   ============================================
//   */

//   const handleBackToResults = () => {
//     setSelectedShop(null);

//     setBooking(false);

//     setError("");
//   };


//   /*
//   ============================================
//   RENDER
//   ============================================
//   */

//   return (
//     <>

//       {/* ======================================
//           DASHBOARD TABS
//       ======================================= */}

//       <div className="dash-tabs">

//         <button
//           className={`dash-tab ${tab === "home"
//               ? "active"
//               : ""
//             }`}
//           onClick={() => {
//             setTab("home");

//             setSelectedShop(null);

//             setBooking(false);

//             setError("");
//           }}
//         >
//           Browse shops
//         </button>


//         <button
//           className={`dash-tab ${tab === "appointments"
//               ? "active"
//               : ""
//             }`}
//           onClick={() => {
//             setTab("appointments");

//             setSelectedShop(null);

//             setBooking(false);
//           }}
//         >
//           My appointments
//         </button>


//         <button
//           className={`dash-tab ${tab === "profile"
//               ? "active"
//               : ""
//             }`}
//           onClick={() => {
//             setTab("profile");

//             setSelectedShop(null);

//             setBooking(false);
//           }}
//         >
//           Profile
//         </button>

//       </div>


//       <div className="dash-content">

//         {/* ====================================
//             PROFILE
//         ===================================== */}

//         {tab === "profile" && (
//           <Profile />
//         )}


//         {/* ====================================
//             HOME - SHOP LIST
//         ===================================== */}

//         {tab === "home" &&
//           !selectedShop && (
//             <>

//               <h1 className="dash-heading">
//                 Find a shop
//               </h1>


//               <p className="dash-subheading">
//                 Browse nearby salons and services.
//               </p>


//               <div
//                 className="dash-field"
//                 style={{
//                   maxWidth: 320,
//                   marginBottom: 20,
//                 }}
//               >
//                 <input
//                   placeholder="Search shops..."
//                   value={search}
//                   onChange={(e) =>
//                     setSearch(
//                       e.target.value
//                     )
//                   }
//                   onKeyDown={(e) => {
//                     if (
//                       e.key === "Enter"
//                     ) {
//                       loadShops();
//                     }
//                   }}
//                 />
//               </div>


//               {error && (
//                 <p className="auth-error">
//                   {error}
//                 </p>
//               )}


//               {loading ? (
//                 <p className="empty-state">
//                   Loading shops...
//                 </p>
//               ) : shops.length === 0 ? (
//                 <p className="empty-state">
//                   No shops found yet.
//                 </p>
//               ) : (
//                 <div className="shop-grid">

//                   {shops.map(
//                     (shop) => (
//                       <div
//                         key={shop._id}
//                         className="shop-card"
//                         onClick={() =>
//                           openShop(
//                             shop._id
//                           )
//                         }
//                       >

//                         <div
//                           className="shop-card-photo"
//                           style={
//                             shop.photo
//                               ? {
//                                 backgroundImage:
//                                   `url(${shop.photo})`,
//                                 backgroundSize:
//                                   "cover",
//                                 backgroundPosition:
//                                   "center",
//                               }
//                               : undefined
//                           }
//                         />


//                         <div className="shop-card-body">

//                           <p className="shop-card-name">
//                             {shop.shopname}
//                           </p>


//                           <p className="shop-card-meta">
//                             {shop.address}
//                           </p>


//                           <div className="pill-row">

//                             <span className="pill">
//                               {
//                                 shop.genderCategory
//                               }
//                             </span>


//                             <span className="pill">
//                               {
//                                 shop.openingTime
//                               }
//                               –
//                               {
//                                 shop.closingTime
//                               }
//                             </span>

//                           </div>

//                         </div>

//                       </div>
//                     )
//                   )}

//                 </div>
//               )}

//             </>
//           )}


//         {/* ====================================
//             SHOP DETAILS / BOOKING
//         ===================================== */}

//         {tab === "home" &&
//           selectedShop && (

//             <div className="detail-card">

//               <button
//                 className="detail-back"
//                 onClick={() => {
//                   if (booking) {
//                     setBooking(false);
//                   } else {
//                     handleBackToResults();
//                   }
//                 }}
//               >
//                 ←{" "}

//                 {booking
//                   ? "Back to shop"
//                   : "Back to results"}

//               </button>


//               <h1 className="dash-heading">
//                 {selectedShop.shopname}
//               </h1>


//               <p className="dash-subheading">
//                 {selectedShop.address}
//               </p>


//               {error && (
//                 <p className="auth-error">
//                   {error}
//                 </p>
//               )}


//               {!booking ? (

//                 <>
//                   {/* SHOP SERVICES */}

//                   <h3
//                     style={{
//                       marginBottom: 10,
//                     }}
//                   >
//                     Services
//                   </h3>


//                   <div
//                     className="pill-row"
//                     style={{
//                       marginBottom: 24,
//                     }}
//                   >
//                     {(
//                       selectedShop.services ||
//                       []
//                     ).map(
//                       (service) => (
//                         <span
//                           className="pill"
//                           key={service._id}
//                         >
//                           {
//                             service.servicename
//                           }

//                           {" · "}

//                           ₹
//                           {
//                             service.price
//                           }
//                         </span>
//                       )
//                     )}
//                   </div>


//                   {/* START BOOKING */}

//                   <button
//                     className="btn-primary"
//                     onClick={() =>
//                       setBooking(true)
//                     }
//                   >
//                     Book appointment
//                   </button>

//                 </>

//               ) : (

//                 <BookAppointment
//                   shop={selectedShop}
//                   onBooked={() => {
//                     setTab(
//                       "appointments"
//                     );

//                     setSelectedShop(null);

//                     setBooking(false);
//                   }}
//                 />

//               )}

//             </div>
//           )}


//         {/* ====================================
//             APPOINTMENTS
//         ===================================== */}

//         {tab === "appointments" && (

//           <>
//             <h1 className="dash-heading">
//               My appointments
//             </h1>


//             <p className="dash-subheading">
//               Your appointments will appear here.
//             </p>
//           </>

//         )}

//       </div>

//     </>
//   );
// }


//22/-07
// src/pages/dashboard/CustomerDashboard.jsx
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import MyAppointments from "./MyAppointment";

import {
  browseShops,
  getShopById,
} from "../../api/shopApi";

import BookAppointment from "./BookAppointment";

import Profile from "./Profile";


export default function CustomerDashboard({
  tab,
  setTab,
}) {
  const [shops, setShops] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // null = shop list
  // object = a shop is open -> goes straight into BookAppointment
  const [selectedShop, setSelectedShop] =
    useState(null);

  const [search, setSearch] =
    useState("");


  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  /*
  ============================================
  LOAD SHOPS
  ============================================
  */

  const loadShops = useCallback(
    async () => {
      setLoading(true);

      setError("");


      try {
        const response =
          await browseShops(
            user.userid,
            search
          );


        setShops(
          response.data.shops ||
          response.data
        );

      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Could not load shops."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      user.userid,
      search,
    ]
  );


  useEffect(() => {
    loadShops();
  }, [loadShops]);


  /*
  ============================================
  OPEN SHOP -> straight into the booking flow
  (BookAppointment shows the shop name/header
  itself as its Step 1 intro, so there's no
  separate "shop detail" screen anymore)
  ============================================
  */

  const openShop = async (
    shopId
  ) => {
    setError("");


    try {
      const response =
        await getShopById(
          shopId,
          user.userid
        );


      setSelectedShop(
        response.data.shop ||
        response.data
      );

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load shop details."
      );
    }
  };


  /*
  ============================================
  BACK TO SHOP LIST
  (this is what BookAppointment's own
  "Back to results" button calls now —
  one click, straight to the grid)
  ============================================
  */

  const handleBackToResults = () => {
    setSelectedShop(null);

    setError("");
  };


  /*
  ============================================
  RENDER
  ============================================
  */

  return (
    <>

      {/* ======================================
          DASHBOARD TABS
      ======================================= */}

      <div className="dash-tabs">

        <button
          className={`dash-tab ${tab === "home"
            ? "active"
            : ""
            }`}
          onClick={() => {
            setTab("home");

            setSelectedShop(null);

            setError("");
          }}
        >
          Browse shops
        </button>


        <button
          className={`dash-tab ${tab === "appointments"
            ? "active"
            : ""
            }`}
          onClick={() => {
            setTab("appointments");

            setSelectedShop(null);
          }}
        >
          My appointments
        </button>


        <button
          className={`dash-tab ${tab === "profile"
            ? "active"
            : ""
            }`}
          onClick={() => {
            setTab("profile");

            setSelectedShop(null);
          }}
        >
          Profile
        </button>

      </div>


      <div className="dash-content">

        {/* ====================================
            PROFILE
        ===================================== */}

        {tab === "profile" && (
          <Profile />
        )}


        {/* ====================================
            HOME - SHOP LIST
        ===================================== */}

        {tab === "home" &&
          !selectedShop && (
            <>

              <h1 className="dash-heading">
                Find a shop
              </h1>


              <p className="dash-subheading">
                Browse nearby salons and services.
              </p>


              <div
                className="dash-field"
                style={{
                  maxWidth: 320,
                  marginBottom: 20,
                }}
              >
                <input
                  placeholder="Search shops..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      loadShops();
                    }
                  }}
                />
              </div>


              {error && (
                <p className="auth-error">
                  {error}
                </p>
              )}


              {loading ? (
                <p className="empty-state">
                  Loading shops...
                </p>
              ) : shops.length === 0 ? (
                <p className="empty-state">
                  No shops found yet.
                </p>
              ) : (
                <div className="shop-grid">

                  {shops.map(
                    (shop) => (
                      <div
                        key={shop._id}
                        className="shop-card"
                        onClick={() =>
                          openShop(
                            shop._id
                          )
                        }
                      >

                        <div
                          className="shop-card-photo"
                          style={
                            shop.photo
                              ? {
                                backgroundImage:
                                  `url(${shop.photo})`,
                                backgroundSize:
                                  "cover",
                                backgroundPosition:
                                  "center",
                              }
                              : undefined
                          }
                        />


                        <div className="shop-card-body">

                          <p className="shop-card-name">
                            {shop.shopname}
                          </p>


                          <p className="shop-card-meta">
                            {shop.address}
                          </p>


                          <div className="pill-row">

                            <span className="pill">
                              {
                                shop.genderCategory
                              }
                            </span>


                            <span className="pill">
                              {
                                shop.openingTime
                              }
                              –
                              {
                                shop.closingTime
                              }
                            </span>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </>
          )}


        {/* ====================================
            SHOP OPEN -> straight into booking
            (no separate old-design detail screen
            anymore — BookAppointment handles the
            whole thing, one consistent design)
        ===================================== */}

        {tab === "home" &&
          selectedShop && (
            <BookAppointment
              shop={selectedShop}
              onBack={handleBackToResults}
              onBooked={() => {
                setTab("appointments");
                setSelectedShop(null);
              }}
            />
          )}


        {/* ====================================
            APPOINTMENTS
        ===================================== */}

        {tab === "appointments" && (
          <MyAppointments />
        )}

      </div>

    </>
  );
}