// // // src/pages/dashboard/LocationAccess.jsx
// // //
// // // Two-step flow:
// // //   Step 1 — ask permission, "Use my location"
// // //   Step 2 — once granted, show detected city + a way to change/skip it
// // //
// // // Uses the browser's Geolocation API + OpenStreetMap's free Nominatim
// // // reverse-geocoding API (no API key needed) to turn lat/lng into a city name.

// // import { Loader2, LocateFixed, MapPin, Pencil } from "lucide-react";
// // import { useState } from "react";

// // export default function LocationAccess({ city, onCityChange }) {
// //     const [status, setStatus] = useState("idle"); // idle | requesting | denied | error
// //     const [manualCity, setManualCity] = useState("");
// //     const [editing, setEditing] = useState(false);

// //     const detectLocation = () => {
// //         if (!navigator.geolocation) {
// //             setStatus("error");
// //             return;
// //         }

// //         setStatus("requesting");

// //         navigator.geolocation.getCurrentPosition(
// //             async (position) => {
// //                 try {
// //                     const { latitude, longitude } = position.coords;
// //                     const res = await fetch(
// //                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
// //                     );
// //                     const data = await res.json();

// //                     const detectedCity =
// //                         data.address?.city ||
// //                         data.address?.town ||
// //                         data.address?.village ||
// //                         data.address?.county ||
// //                         "";

// //                     if (detectedCity) {
// //                         onCityChange(detectedCity);
// //                         setStatus("idle");
// //                     } else {
// //                         setStatus("error");
// //                     }
// //                 } catch {
// //                     setStatus("error");
// //                 }
// //             },
// //             () => {
// //                 // permission denied, or position unavailable
// //                 setStatus("denied");
// //             }
// //         );
// //     };

// //     const handleManualSubmit = (e) => {
// //         e.preventDefault();
// //         if (!manualCity.trim()) return;
// //         onCityChange(manualCity.trim());
// //         setEditing(false);
// //         setManualCity("");
// //     };

// //     // ---------- Step 2: a city is already set — show it, allow changing ----------
// //     if (city && !editing) {
// //         return (
// //             <div
// //                 style={{
// //                     display: "flex",
// //                     alignItems: "center",
// //                     gap: 10,
// //                     marginBottom: 20,
// //                     padding: "10px 16px",
// //                     border: "1px solid var(--line)",
// //                     borderRadius: 999,
// //                     maxWidth: "fit-content",
// //                     background: "#fff",
// //                 }}
// //             >
// //                 <MapPin size={16} color="var(--indigo, #4f46e5)" />
// //                 <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink, #111827)" }}>
// //                     {city}
// //                 </span>
// //                 <button
// //                     onClick={() => setEditing(true)}
// //                     style={{
// //                         border: "none",
// //                         background: "none",
// //                         cursor: "pointer",
// //                         color: "var(--muted, #6b7280)",
// //                         display: "flex",
// //                         alignItems: "center",
// //                         gap: 4,
// //                         fontSize: 13,
// //                     }}
// //                 >
// //                     <Pencil size={13} /> Change
// //                 </button>
// //             </div>
// //         );
// //     }

// //     // ---------- Step 1: no city yet, or user chose to edit it ----------
// //     return (
// //         <div
// //             style={{
// //                 border: "1px dashed var(--line)",
// //                 borderRadius: 14,
// //                 padding: 20,
// //                 marginBottom: 24,
// //                 background: "#fff",
// //                 maxWidth: 420,
// //             }}
// //         >
// //             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
// //                 <MapPin size={18} color="var(--indigo, #4f46e5)" />
// //                 <strong style={{ fontSize: 15 }}>Find shops near you</strong>
// //             </div>

// //             <p style={{ fontSize: 13, color: "var(--muted, #6b7280)", marginBottom: 14 }}>
// //                 Allow location access so we can show shops in your city — or enter it manually.
// //             </p>

// //             <button
// //                 onClick={detectLocation}
// //                 disabled={status === "requesting"}
// //                 className="btn-primary"
// //                 style={{
// //                     display: "inline-flex",
// //                     alignItems: "center",
// //                     gap: 8,
// //                     marginBottom: 12,
// //                 }}
// //             >
// //                 {status === "requesting" ? (
// //                     <>
// //                         <Loader2 size={16} className="spin" /> Detecting...
// //                     </>
// //                 ) : (
// //                     <>
// //                         <LocateFixed size={16} /> Use my location
// //                     </>
// //                 )}
// //             </button>

// //             {status === "denied" && (
// //                 <p className="auth-error" style={{ marginBottom: 12 }}>
// //                     Location access was denied. You can still enter your city below.
// //                 </p>
// //             )}
// //             {status === "error" && (
// //                 <p className="auth-error" style={{ marginBottom: 12 }}>
// //                     Couldn't detect your location. Please enter your city below.
// //                 </p>
// //             )}

// //             <form onSubmit={handleManualSubmit} style={{ display: "flex", gap: 8 }}>
// //                 <input
// //                     placeholder="Enter city manually"
// //                     value={manualCity}
// //                     onChange={(e) => setManualCity(e.target.value)}
// //                     style={{ flex: 1 }}
// //                 />
// //                 <button type="submit" className="dash-logout-btn">
// //                     Set
// //                 </button>
// //             </form>
// //         </div>
// //     );
// // }

// import {
//     ChevronDown,
//     Loader2,
//     LocateFixed,
//     MapPin,
//     Search,
//     X,
// } from "lucide-react";
// import { useEffect, useState } from "react";

// import "../../styles/LocationAccess.css";

// // export default function LocationSelector({
// //     city,
// //     onCityChange,
// // }) {

// //     const [open, setOpen] = useState(false);

// //     const [loading, setLoading] = useState(false);

// //     const [search, setSearch] = useState("");

// //     const popularCities = [
// //         "Hosur",
// //         "Bangalore",
// //         "Chennai",
// //         "Coimbatore",
// //         "Salem",
// //         "Madurai",
// //         "Hyderabad",
// //         "Mumbai",
// //         "Delhi",
// //         "Pune",
// //     ];

// //     const detectLocation = () => {

// //         if (!navigator.geolocation) {
// //             alert("Geolocation not supported");
// //             return;
// //         }

// //         setLoading(true);

// //         navigator.geolocation.getCurrentPosition(

// //             async (position) => {

// //                 try {

// //                     const { latitude, longitude } = position.coords;

// //                     const response = await fetch(
// //                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
// //                     );

// //                     const data = await response.json();

// //                     const detectedCity =
// //                         data.address?.city ||
// //                         data.address?.town ||
// //                         data.address?.village ||
// //                         data.address?.county ||
// //                         "";

// //                     if (detectedCity) {

// //                         onCityChange(detectedCity);

// //                         setOpen(false);

// //                     } else {

// //                         alert("Unable to detect city");

// //                     }

// //                 } catch (err) {

// //                     console.log(err);

// //                     alert("Unable to detect location");

// //                 }

// //                 setLoading(false);

// //             },

// //             () => {

// //                 setLoading(false);

// //                 alert("Location Permission Denied");

// //             }

// //         );

// //     };

// //     useEffect(() => {

// //         if (!city) {

// //             detectLocation();

// //         }

// //     }, []);

// //     const chooseCity = (selectedCity) => {

// //         onCityChange(selectedCity);

// //         setSearch("");

// //         setOpen(false);

// //     };

// //     return (
// //         <>

// //             {/* Location Button */}

// //             <div
// //                 className="locUI-pill"
// //                 onClick={() => setOpen(true)}
// //             >

// //                 <div className="locUI-left">

// //                     <MapPin
// //                         size={18}
// //                         className="locUI-icon"
// //                     />

// //                     <div>

// //                         <h4>

// //                             {city || "Choose Location"}

// //                         </h4>

// //                         <span>

// //                             Current Location

// //                         </span>

// //                         <div className="locUI-badge">

// //                             📍 Detected

// //                         </div>

// //                     </div>

// //                 </div>

// //                 <ChevronDown size={18} />

// //             </div>

// //             {/* Modal */}

// //             {open && (

// //                 <div className="locUI-overlay">

// //                     <div className="locUI-modal">

// //                         <div className="locUI-header">

// //                             <h2>

// //                                 Select Location

// //                             </h2>

// //                             <button
// //                                 className="locUI-close"
// //                                 onClick={() => setOpen(false)}
// //                             >

// //                                 <X size={18} />

// //                             </button>

// //                         </div>

// //                         <button
// //                             className="locUI-currentBtn"
// //                             onClick={detectLocation}
// //                         >

// //                             {/* {loading ? (
// //                                 <>
// //                                     <Loader2
// //                                         size={18}
// //                                         className="locUI-spin"
// //                                     />

// //                                     Detecting...

// //                                 </>
// //                             ) : ( */}

// //                             {loading ? (

// //                                 <div
// //                                     style={{
// //                                         display: "flex",
// //                                         flexDirection: "column",
// //                                         alignItems: "center",
// //                                         gap: "15px"
// //                                     }}
// //                                 >

// //                                     <div className="locUI-loaderCircle">

// //                                         <Loader2
// //                                             size={32}
// //                                             className="locUI-spin"
// //                                         />

// //                                     </div>

// //                                     <span>

// //                                         Finding your location...

// //                                     </span>

// //                                 </div>

// //                             ) : (
// //                                 <>
// //                                     <LocateFixed size={18} />

// //                                     Use Current Location
// //                                 </>
// //                             )}

// //                         </button>

// //                         <div className="locUI-divider">

// //                             <span>

// //                                 OR

// //                             </span>

// //                         </div>

// //                         <div className="locUI-search">

// //                             <Search size={18} />

// //                             <input
// //                                 placeholder="Search city..."
// //                                 value={search}
// //                                 onChange={(e) => setSearch(e.target.value)}
// //                             />

// //                             <button
// //                                 className="locUI-setBtn"
// //                                 onClick={() => {

// //                                     if (search.trim()) {

// //                                         chooseCity(search.trim());

// //                                     }

// //                                 }}
// //                             >
// //                                 Set
// //                             </button>

// //                         </div>

// //                         {/* <div className="locUI-cityList">

// //                             {popularCities
// //                                 .filter((item) =>
// //                                     item
// //                                         .toLowerCase()
// //                                         .includes(search.toLowerCase())
// //                                 )
// //                                 .map((item) => (

// //                                     <div
// //                                         key={item}
// //                                         className="locUI-city"
// //                                         onClick={() => chooseCity(item)}
// //                                     >

// //                                         <MapPin size={15} />

// //                                         {item}

// //                                     </div>

// //                                 ))}

// //                         </div> */}

// //                         <div className="locUI-title">

// //                             Popular Cities

// //                         </div>

// //                         <div className="locUI-popularGrid" style={{ color: "black" }}>

// //                             {popularCities
// //                                 .filter(item =>
// //                                     item.toLowerCase().includes(search.toLowerCase())
// //                                 )
// //                                 .map(item => (

// //                                     <div
// //                                         key={item}
// //                                         className="locUI-chip"
// //                                         onClick={() => chooseCity(item)}
// //                                     >
// //                                         {item}
// //                                     </div>

// //                                 ))}

// //                         </div>

// //                     </div>

// //                 </div>

// //             )}

// //         </>
// //     );

// // }


// // import "../../styles/LocationSelector.css";

// export default function LocationSelector({
//     city,
//     onCityChange,
// }) {

//     const [open, setOpen] = useState(false);

//     const [loading, setLoading] = useState(false);

//     const [search, setSearch] = useState("");

//     // FIX: tracks whether the current city actually came from geolocation
//     // (vs. picked from the popular-cities grid or typed manually) — the
//     // "Detected" badge should only show in the geolocation case.
//     const [wasDetected, setWasDetected] = useState(false);

//     const popularCities = [
//         "Hosur",
//         "Bangalore",
//         "Chennai",
//         "Coimbatore",
//         "Salem",
//         "Madurai",
//         "Hyderabad",
//         "Mumbai",
//         "Delhi",
//         "Pune",
//     ];

//     const detectLocation = () => {

//         if (!navigator.geolocation) {
//             alert("Geolocation not supported");
//             return;
//         }

//         setLoading(true);

//         navigator.geolocation.getCurrentPosition(

//             async (position) => {

//                 try {

//                     const { latitude, longitude } = position.coords;

//                     const response = await fetch(
//                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//                     );

//                     const data = await response.json();

//                     const detectedCity =
//                         data.address?.city ||
//                         data.address?.town ||
//                         data.address?.village ||
//                         data.address?.county ||
//                         "";

//                     if (detectedCity) {

//                         onCityChange(detectedCity);
//                         setWasDetected(true); // FIX: only geolocation sets this true

//                         setOpen(false);

//                     } else {

//                         alert("Unable to detect city");

//                     }

//                 } catch (err) {

//                     console.log(err);

//                     alert("Unable to detect location");

//                 }

//                 setLoading(false);

//             },

//             () => {

//                 setLoading(false);

//                 alert("Location Permission Denied");

//             }

//         );

//     };

//     useEffect(() => {

//         if (!city) {

//             detectLocation();

//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const chooseCity = (selectedCity) => {

//         onCityChange(selectedCity);
//         setWasDetected(false); // FIX: manual pick — not detected

//         setSearch("");
//         setOpen(false);

//     };

//     // FIX: Enter key in the search box now submits, same as clicking "Set"
//     const handleSearchKeyDown = (e) => {
//         if (e.key === "Enter" && search.trim()) {
//             chooseCity(search.trim());
//         }
//     };

//     return (
//         <>

//             {/* Location Button */}

//             <div
//                 className="locUI-pill"
//                 onClick={() => setOpen(true)}
//             >

//                 <div className="locUI-left">

//                     <MapPin
//                         size={18}
//                         className="locUI-icon"
//                     />

//                     <div>

//                         <h4>

//                             {city || "Choose Location"}

//                         </h4>

//                         <span>

//                             Current Location

//                         </span>

//                         {/* FIX: badge only shows, and only says "Detected",
//                             when the city actually came from geolocation */}
//                         {city && (
//                             <div className={`locUI-badge ${wasDetected ? "" : "locUI-badge-manual"}`}>
//                                 {wasDetected ? "📍 Detected" : "📍 Selected"}
//                             </div>
//                         )}

//                     </div>

//                 </div>

//                 <ChevronDown size={18} />

//             </div>

//             {/* Modal */}

//             {open && (

//                 // FIX: clicking the dark backdrop now closes the modal
//                 <div
//                     className="locUI-overlay"
//                     onClick={() => setOpen(false)}
//                 >

//                     {/* FIX: stopPropagation so clicking inside the modal
//                         itself doesn't bubble up and close it */}
//                     <div
//                         className="locUI-modal"
//                         onClick={(e) => e.stopPropagation()}
//                     >

//                         <div className="locUI-header">

//                             <h2>

//                                 Select Location

//                             </h2>

//                             <button
//                                 className="locUI-close"
//                                 onClick={() => setOpen(false)}
//                             >

//                                 <X size={18} />

//                             </button>

//                         </div>

//                         <button
//                             className="locUI-currentBtn"
//                             onClick={detectLocation}
//                             disabled={loading}
//                         >

//                             {loading ? (

//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         flexDirection: "column",
//                                         alignItems: "center",
//                                         gap: "15px"
//                                     }}
//                                 >

//                                     <div className="locUI-loaderCircle">

//                                         <Loader2
//                                             size={32}
//                                             className="locUI-spin"
//                                         />

//                                     </div>

//                                     <span>

//                                         Finding your location...

//                                     </span>

//                                 </div>

//                             ) : (
//                                 <>
//                                     <LocateFixed size={18} />

//                                     Use Current Location
//                                 </>
//                             )}

//                         </button>

//                         <div className="locUI-divider">

//                             <span>

//                                 OR

//                             </span>

//                         </div>

//                         <div className="locUI-search">

//                             <Search size={18} />

//                             <input
//                                 placeholder="Search city..."
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 onKeyDown={handleSearchKeyDown}
//                             />

//                             <button
//                                 className="locUI-setBtn"
//                                 onClick={() => {

//                                     if (search.trim()) {

//                                         chooseCity(search.trim());

//                                     }

//                                 }}
//                             >
//                                 Set
//                             </button>

//                         </div>

//                         <div className="locUI-title">

//                             Popular Cities

//                         </div>

//                         <div className="locUI-popularGrid" style={{ color: "black" }}>

//                             {popularCities
//                                 .filter(item =>
//                                     item.toLowerCase().includes(search.toLowerCase())
//                                 )
//                                 .map(item => (

//                                     <div
//                                         key={item}
//                                         className="locUI-chip"
//                                         onClick={() => chooseCity(item)}
//                                     >
//                                         {item}
//                                     </div>

//                                 ))}

//                         </div>

//                     </div>

//                 </div>

//             )}

//         </>
//     );

// }


// // src/pages/dashboard/LocationAccess.jsx
// //
// // Two-step flow:
// //   Step 1 — ask permission, "Use my location"
// //   Step 2 — once granted, show detected city + a way to change/skip it
// //
// // Uses the browser's Geolocation API + OpenStreetMap's free Nominatim
// // reverse-geocoding API (no API key needed) to turn lat/lng into a city name.

// import { Loader2, LocateFixed, MapPin, Pencil } from "lucide-react";
// import { useState } from "react";

// export default function LocationAccess({ city, onCityChange }) {
//     const [status, setStatus] = useState("idle"); // idle | requesting | denied | error
//     const [manualCity, setManualCity] = useState("");
//     const [editing, setEditing] = useState(false);

//     const detectLocation = () => {
//         if (!navigator.geolocation) {
//             setStatus("error");
//             return;
//         }

//         setStatus("requesting");

//         navigator.geolocation.getCurrentPosition(
//             async (position) => {
//                 try {
//                     const { latitude, longitude } = position.coords;
//                     const res = await fetch(
//                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//                     );
//                     const data = await res.json();

//                     const detectedCity =
//                         data.address?.city ||
//                         data.address?.town ||
//                         data.address?.village ||
//                         data.address?.county ||
//                         "";

//                     if (detectedCity) {
//                         onCityChange(detectedCity);
//                         setStatus("idle");
//                     } else {
//                         setStatus("error");
//                     }
//                 } catch {
//                     setStatus("error");
//                 }
//             },
//             () => {
//                 // permission denied, or position unavailable
//                 setStatus("denied");
//             }
//         );
//     };

//     const handleManualSubmit = (e) => {
//         e.preventDefault();
//         if (!manualCity.trim()) return;
//         onCityChange(manualCity.trim());
//         setEditing(false);
//         setManualCity("");
//     };

//     // ---------- Step 2: a city is already set — show it, allow changing ----------
//     if (city && !editing) {
//         return (
//             <div
//                 style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                     marginBottom: 20,
//                     padding: "10px 16px",
//                     border: "1px solid var(--line)",
//                     borderRadius: 999,
//                     maxWidth: "fit-content",
//                     background: "#fff",
//                 }}
//             >
//                 <MapPin size={16} color="var(--indigo, #4f46e5)" />
//                 <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink, #111827)" }}>
//                     {city}
//                 </span>
//                 <button
//                     onClick={() => setEditing(true)}
//                     style={{
//                         border: "none",
//                         background: "none",
//                         cursor: "pointer",
//                         color: "var(--muted, #6b7280)",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 4,
//                         fontSize: 13,
//                     }}
//                 >
//                     <Pencil size={13} /> Change
//                 </button>
//             </div>
//         );
//     }

//     // ---------- Step 1: no city yet, or user chose to edit it ----------
//     return (
//         <div
//             style={{
//                 border: "1px dashed var(--line)",
//                 borderRadius: 14,
//                 padding: 20,
//                 marginBottom: 24,
//                 background: "#fff",
//                 maxWidth: 420,
//             }}
//         >
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
//                 <MapPin size={18} color="var(--indigo, #4f46e5)" />
//                 <strong style={{ fontSize: 15 }}>Find shops near you</strong>
//             </div>

//             <p style={{ fontSize: 13, color: "var(--muted, #6b7280)", marginBottom: 14 }}>
//                 Allow location access so we can show shops in your city — or enter it manually.
//             </p>

//             <button
//                 onClick={detectLocation}
//                 disabled={status === "requesting"}
//                 className="btn-primary"
//                 style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 8,
//                     marginBottom: 12,
//                 }}
//             >
//                 {status === "requesting" ? (
//                     <>
//                         <Loader2 size={16} className="spin" /> Detecting...
//                     </>
//                 ) : (
//                     <>
//                         <LocateFixed size={16} /> Use my location
//                     </>
//                 )}
//             </button>

//             {status === "denied" && (
//                 <p className="auth-error" style={{ marginBottom: 12 }}>
//                     Location access was denied. You can still enter your city below.
//                 </p>
//             )}
//             {status === "error" && (
//                 <p className="auth-error" style={{ marginBottom: 12 }}>
//                     Couldn't detect your location. Please enter your city below.
//                 </p>
//             )}

//             <form onSubmit={handleManualSubmit} style={{ display: "flex", gap: 8 }}>
//                 <input
//                     placeholder="Enter city manually"
//                     value={manualCity}
//                     onChange={(e) => setManualCity(e.target.value)}
//                     style={{ flex: 1 }}
//                 />
//                 <button type="submit" className="dash-logout-btn">
//                     Set
//                 </button>
//             </form>
//         </div>
//     );
// }

import {
    ChevronDown,
    Loader2,
    LocateFixed,
    MapPin,
    Search,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";

import "../../styles/LocationAccess.css";

// export default function LocationSelector({
//     city,
//     onCityChange,
// }) {

//     const [open, setOpen] = useState(false);

//     const [loading, setLoading] = useState(false);

//     const [search, setSearch] = useState("");

//     const popularCities = [
//         "Hosur",
//         "Bangalore",
//         "Chennai",
//         "Coimbatore",
//         "Salem",
//         "Madurai",
//         "Hyderabad",
//         "Mumbai",
//         "Delhi",
//         "Pune",
//     ];

//     const detectLocation = () => {

//         if (!navigator.geolocation) {
//             alert("Geolocation not supported");
//             return;
//         }

//         setLoading(true);

//         navigator.geolocation.getCurrentPosition(

//             async (position) => {

//                 try {

//                     const { latitude, longitude } = position.coords;

//                     const response = await fetch(
//                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//                     );

//                     const data = await response.json();

//                     const detectedCity =
//                         data.address?.city ||
//                         data.address?.town ||
//                         data.address?.village ||
//                         data.address?.county ||
//                         "";

//                     if (detectedCity) {

//                         onCityChange(detectedCity);

//                         setOpen(false);

//                     } else {

//                         alert("Unable to detect city");

//                     }

//                 } catch (err) {

//                     console.log(err);

//                     alert("Unable to detect location");

//                 }

//                 setLoading(false);

//             },

//             () => {

//                 setLoading(false);

//                 alert("Location Permission Denied");

//             }

//         );

//     };

//     useEffect(() => {

//         if (!city) {

//             detectLocation();

//         }

//     }, []);

//     const chooseCity = (selectedCity) => {

//         onCityChange(selectedCity);

//         setSearch("");

//         setOpen(false);

//     };

//     return (
//         <>

//             {/* Location Button */}

//             <div
//                 className="locUI-pill"
//                 onClick={() => setOpen(true)}
//             >

//                 <div className="locUI-left">

//                     <MapPin
//                         size={18}
//                         className="locUI-icon"
//                     />

//                     <div>

//                         <h4>

//                             {city || "Choose Location"}

//                         </h4>

//                         <span>

//                             Current Location

//                         </span>

//                         <div className="locUI-badge">

//                             📍 Detected

//                         </div>

//                     </div>

//                 </div>

//                 <ChevronDown size={18} />

//             </div>

//             {/* Modal */}

//             {open && (

//                 <div className="locUI-overlay">

//                     <div className="locUI-modal">

//                         <div className="locUI-header">

//                             <h2>

//                                 Select Location

//                             </h2>

//                             <button
//                                 className="locUI-close"
//                                 onClick={() => setOpen(false)}
//                             >

//                                 <X size={18} />

//                             </button>

//                         </div>

//                         <button
//                             className="locUI-currentBtn"
//                             onClick={detectLocation}
//                         >

//                             {/* {loading ? (
//                                 <>
//                                     <Loader2
//                                         size={18}
//                                         className="locUI-spin"
//                                     />

//                                     Detecting...

//                                 </>
//                             ) : ( */}

//                             {loading ? (

//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         flexDirection: "column",
//                                         alignItems: "center",
//                                         gap: "15px"
//                                     }}
//                                 >

//                                     <div className="locUI-loaderCircle">

//                                         <Loader2
//                                             size={32}
//                                             className="locUI-spin"
//                                         />

//                                     </div>

//                                     <span>

//                                         Finding your location...

//                                     </span>

//                                 </div>

//                             ) : (
//                                 <>
//                                     <LocateFixed size={18} />

//                                     Use Current Location
//                                 </>
//                             )}

//                         </button>

//                         <div className="locUI-divider">

//                             <span>

//                                 OR

//                             </span>

//                         </div>

//                         <div className="locUI-search">

//                             <Search size={18} />

//                             <input
//                                 placeholder="Search city..."
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                             />

//                             <button
//                                 className="locUI-setBtn"
//                                 onClick={() => {

//                                     if (search.trim()) {

//                                         chooseCity(search.trim());

//                                     }

//                                 }}
//                             >
//                                 Set
//                             </button>

//                         </div>

//                         {/* <div className="locUI-cityList">

//                             {popularCities
//                                 .filter((item) =>
//                                     item
//                                         .toLowerCase()
//                                         .includes(search.toLowerCase())
//                                 )
//                                 .map((item) => (

//                                     <div
//                                         key={item}
//                                         className="locUI-city"
//                                         onClick={() => chooseCity(item)}
//                                     >

//                                         <MapPin size={15} />

//                                         {item}

//                                     </div>

//                                 ))}

//                         </div> */}

//                         <div className="locUI-title">

//                             Popular Cities

//                         </div>

//                         <div className="locUI-popularGrid" style={{ color: "black" }}>

//                             {popularCities
//                                 .filter(item =>
//                                     item.toLowerCase().includes(search.toLowerCase())
//                                 )
//                                 .map(item => (

//                                     <div
//                                         key={item}
//                                         className="locUI-chip"
//                                         onClick={() => chooseCity(item)}
//                                     >
//                                         {item}
//                                     </div>

//                                 ))}

//                         </div>

//                     </div>

//                 </div>

//             )}

//         </>
//     );

// }


// import "../../styles/LocationSelector.css";

// export default function LocationSelector({
//     city,
//     onCityChange,
// }) {

//     const [open, setOpen] = useState(false);

//     const [suggestions, setSuggestions] = useState([]);
//     const [loading, setLoading] = useState(false);

//     let [search, setSearch] = useState("");

//     // FIX: tracks whether the current city actually came from geolocation
//     // (vs. picked from the popular-cities grid or typed manually) — the
//     // "Detected" badge should only show in the geolocation case.
//     const [wasDetected, setWasDetected] = useState(false);

//     const popularCities = [
//         "Hosur",
//         "Bangalore",
//         "Chennai",
//         "Coimbatore",
//         "Salem",
//         "Madurai",
//         "Hyderabad",
//         "Mumbai",
//         "Delhi",
//         "Pune",
//     ];

//     const searchCity = async (keyword) => {
//         try {
//             // if (keyword !== "") {
//             setSuggestions([])
//             const response = await fetch(
//                 `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//                     keyword.toLowerCase()
//                 )}&countrycodes=in&addressdetails=1&limit=5`,
//                 {
//                     headers: {
//                         "Accept-Language": "en"
//                     }
//                 }
//             );

//             const data = await response.json();

//             setSuggestions(data);
//             // }

//             // else {
//             //     setSuggestions([])
//             // }


//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const detectLocation = () => {

//         if (!navigator.geolocation) {
//             alert("Geolocation not supported");
//             return;
//         }

//         setLoading(true);

//         navigator.geolocation.getCurrentPosition(

//             async (position) => {

//                 try {

//                     const { latitude, longitude } = position.coords;

//                     const response = await fetch(
//                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//                     );

//                     const data = await response.json();

//                     const detectedCity =
//                         data.address?.city ||
//                         data.address?.town ||
//                         data.address?.village ||
//                         data.address?.county ||
//                         "";

//                     if (detectedCity) {

//                         onCityChange(detectedCity);
//                         setWasDetected(true); // FIX: only geolocation sets this true

//                         setOpen(false);

//                     } else {

//                         alert("Unable to detect city");

//                     }

//                 } catch (err) {

//                     console.log(err);

//                     alert("Unable to detect location");

//                 }

//                 setLoading(false);

//             },

//             () => {

//                 setLoading(false);

//                 alert("Location Permission Denied");

//             }

//         );

//     };

//     useEffect(() => {

//         if (!city) {

//             detectLocation();

//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const chooseCity = (selectedCity) => {

//         onCityChange(selectedCity);
//         setWasDetected(false); // FIX: manual pick — not detected

//         setSearch("");
//         setOpen(false);

//     };

//     // FIX: Enter key in the search box now submits, same as clicking "Set"
//     const handleSearchKeyDown = (e) => {
//         if (e.key === "Enter" && search.trim()) {
//             chooseCity(search.trim());
//         }
//     };

//     return (
//         <>

//             {/* Location Button */}

//             <div
//                 className="locUI-pill"
//                 onClick={() => setOpen(true)}
//             >

//                 <div className="locUI-left">

//                     <MapPin
//                         size={18}
//                         className="locUI-icon"
//                     />

//                     <div>

//                         <h4>

//                             {city || "Choose Location"}

//                         </h4>

//                         <span>

//                             Current Location

//                         </span>

//                         {/* FIX: badge only shows, and only says "Detected",
//                             when the city actually came from geolocation */}
//                         {city && (
//                             <div className={`locUI-badge ${wasDetected ? "" : "locUI-badge-manual"}`}>
//                                 {wasDetected ? "📍 Detected" : "📍 Selected"}
//                             </div>
//                         )}

//                     </div>

//                 </div>

//                 <ChevronDown size={18} />

//             </div>

//             {/* Modal */}

//             {open && (

//                 // FIX: clicking the dark backdrop now closes the modal
//                 <div
//                     className="locUI-overlay"
//                     onClick={() => setOpen(false)}
//                 >

//                     {/* FIX: stopPropagation so clicking inside the modal
//                         itself doesn't bubble up and close it */}
//                     <div
//                         className="locUI-modal"
//                         onClick={(e) => e.stopPropagation()}
//                     >

//                         <div className="locUI-header">

//                             <h2>

//                                 Select Location

//                             </h2>

//                             <button
//                                 className="locUI-close"
//                                 onClick={() => setOpen(false)}
//                             >

//                                 <X size={18} />

//                             </button>

//                         </div>

//                         <button
//                             className="locUI-currentBtn"
//                             onClick={detectLocation}
//                             disabled={loading}
//                         >

//                             {loading ? (

//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         flexDirection: "column",
//                                         alignItems: "center",
//                                         gap: "15px"
//                                     }}
//                                 >

//                                     <div className="locUI-loaderCircle">

//                                         <Loader2
//                                             size={32}
//                                             className="locUI-spin"
//                                         />

//                                     </div>

//                                     <span>

//                                         Finding your location...

//                                     </span>

//                                 </div>

//                             ) : (
//                                 <>
//                                     <LocateFixed size={18} />

//                                     Use Current Location
//                                 </>
//                             )}

//                         </button>

//                         <div className="locUI-divider">

//                             <span>

//                                 OR

//                             </span>

//                         </div>

//                         <div className="locUI-search">

//                             <Search size={18} />

//                             {/* <input
//                                 placeholder="Search city..."
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 onKeyDown={handleSearchKeyDown}
//                             /> */}

//                             <input
//                                 placeholder="Search city..."
//                                 value={search}
//                                 onChange={(e) => {
//                                     const value = e.target.value;
//                                     setSearch(value);

//                                     if (value.trim().length >= 2) {
//                                         searchCity(value);
//                                     } else {
//                                         setSuggestions([]);
//                                     }
//                                 }}
//                                 onKeyDown={handleSearchKeyDown}
//                             />



//                             <button
//                                 className="locUI-setBtn"
//                                 onClick={() => {

//                                     if (search.trim()) {

//                                         chooseCity(search.trim());

//                                     }

//                                 }}
//                             >
//                                 Set
//                             </button>

//                         </div>

//                         {suggestions.length > 0 && (
//                             <div className="locUI-suggestionList">
//                                 {suggestions.map((item) => {
//                                     const city =
//                                         item.address.city ||
//                                         item.address.town ||
//                                         item.address.village ||
//                                         item.address.municipality ||
//                                         item.address.county
//                                     "";

//                                     const state = item.address.state ||
//                                         "";

//                                     return (
//                                         <div
//                                             key={item.place_id}
//                                             className="locUI-suggestion"
//                                             onClick={() => {
//                                                 chooseCity(city);
//                                                 setSuggestions([]);
//                                             }}
//                                         >
//                                             <MapPin size={16} />

//                                             <div className="locUI-suggestionText" style={{ color: "black" }}>
//                                                 <strong>{city}</strong>
//                                                 <small>{state}</small>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}

//                         <div className="locUI-title">

//                             Popular Cities

//                         </div>

//                         <div className="locUI-popularGrid" style={{ color: "black" }}>

//                             {popularCities
//                                 .filter(item =>
//                                     item.toLowerCase().includes(search.toLowerCase())
//                                 )
//                                 .map(item => (

//                                     <div
//                                         key={item}
//                                         className="locUI-chip"
//                                         onClick={() => chooseCity(item)}
//                                     >
//                                         {item}
//                                     </div>

//                                 ))}

//                         </div>

//                     </div>

//                 </div>

//             )}

//         </>
//     );

// }




import { createPortal } from "react-dom";
import { searchCity as searchCityApi } from "../../api/shopApi";

// import "../../styles/LocationSelector.css";

export default function LocationSelector({
    city,
    onCityChange,
}) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // tracks whether the current city came from geolocation (green
    // "Detected" badge) vs picked manually (gray "Selected" badge)
    const [wasDetected, setWasDetected] = useState(false);

    const popularCities = [
        "Hosur",
        "Bangalore",
        "Chennai",
        "Coimbatore",
        "Salem",
        "Madurai",
        "Hyderabad",
        "Mumbai",
        "Delhi",
        "Pune",
    ];

    // ---------- Geolocation ----------

    const detectLocation = () => {

        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                try {

                    const { latitude, longitude } = position.coords;

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await response.json();

                    const detectedCity =
                        data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.county ||
                        "";

                    if (detectedCity) {

                        onCityChange(detectedCity);
                        setWasDetected(true);

                        setOpen(false);

                    } else {

                        alert("Unable to detect city");

                    }

                } catch (err) {

                    console.log(err);

                    alert("Unable to detect location");

                }

                setLoading(false);

            },

            () => {

                setLoading(false);

                alert("Location Permission Denied");

            }

        );

    };

    useEffect(() => {

        if (!city) {

            detectLocation();

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---------- City search — via OUR OWN backend, debounced ----------
    // FIX: no longer calls nominatim.openstreetmap.org directly from the
    // browser (that caused CORS errors, 429 rate-limits, AND irrelevant
    // fuzzy matches like "Ani" for the query "ku"). Our backend already
    // filters properly and sorts by relevance.

    const searchCity = async (keyword) => {
        try {
            const response = await searchCityApi(keyword);
            setSuggestions(response.data); // [{ city, state }, ...]

        } catch (err) {
            console.log(err);
            setSuggestions([]);
        }
    };

    // FIX: debounced — waits 500ms after typing stops, and requires at
    // least 3 characters (2 was too short, causing noisy fuzzy matches)
    useEffect(() => {
        if (search.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(() => {
            searchCity(search);
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // ---------- Choosing a city ----------

    const chooseCity = (selectedCity) => {

        onCityChange(selectedCity);
        setWasDetected(false);

        setSearch("");
        setSuggestions([]);
        setOpen(false);

    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter" && search.trim()) {
            chooseCity(search.trim());
        }
    };

    return (
        <>

            {/* Location Button */}

            <div
                className="locUI-pill"
                onClick={() => setOpen(true)}
            >

                <div className="locUI-left">

                    <MapPin
                        size={18}
                        className="locUI-icon"
                    />

                    <div>

                        <h4>

                            {city || "Choose Location"}

                        </h4>

                        <span>

                            Current Location

                        </span>

                        {city && (
                            <div className={`locUI-badge ${wasDetected ? "" : "locUI-badge-manual"}`}>
                                {wasDetected ? "📍 Detected" : "📍 Selected"}
                            </div>
                        )}

                    </div>

                </div>

                <ChevronDown size={18} />

            </div>

            {/* Modal — rendered via a portal straight into document.body,
                so it always centers on the true viewport regardless of
                any ancestor element using `transform` (which otherwise
                breaks position:fixed and was clipping this at the top) */}

            {open && createPortal(

                <div
                    className="locUI-overlay"
                    onClick={() => setOpen(false)}
                >

                    <div
                        className="locUI-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="locUI-header">

                            <h2>

                                Select Location

                            </h2>

                            <button
                                className="locUI-close"
                                onClick={() => setOpen(false)}
                            >

                                <X size={18} />

                            </button>

                        </div>

                        <button
                            className="locUI-currentBtn"
                            onClick={detectLocation}
                            disabled={loading}
                        >

                            {loading ? (

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "15px"
                                    }}
                                >

                                    <div className="locUI-loaderCircle">

                                        <Loader2
                                            size={32}
                                            className="locUI-spin"
                                        />

                                    </div>

                                    <span>

                                        Finding your location...

                                    </span>

                                </div>

                            ) : (
                                <>
                                    <LocateFixed size={18} />

                                    Use Current Location
                                </>
                            )}

                        </button>

                        <div className="locUI-divider">

                            <span>

                                OR

                            </span>

                        </div>

                        <div className="locUI-search">

                            <Search size={18} />

                            <input
                                placeholder="Search city..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />

                            <button
                                className="locUI-setBtn"
                                onClick={() => {

                                    if (search.trim()) {

                                        chooseCity(search.trim());

                                    }

                                }}
                            >
                                Set
                            </button>

                        </div>

                        {/* FIX: uses the now-defined .locUI-suggestionList /
                            .locUI-suggestion CSS — this was rendering
                            unstyled before, which is why it looked like it
                            was floating/jumping oddly */}
                        {suggestions.length > 0 && (
                            <div className="locUI-suggestionList">
                                {suggestions.map((item, index) => (
                                    <div
                                        key={`${item.city}-${item.state}-${index}`}
                                        className="locUI-suggestion"
                                        onClick={() => chooseCity(item.city)}
                                    >
                                        <MapPin size={16} />
                                        <div className="locUI-suggestionText">
                                            <div className="locUI-suggestionCity">{item.city}</div>
                                            <div className="locUI-suggestionState">{item.state}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Popular cities — hidden while actively searching,
                            so the two lists don't visually compete */}
                        {search.trim().length < 3 && (
                            <>
                                <div className="locUI-title">

                                    Popular Cities

                                </div>

                                <div className="locUI-popularGrid">

                                    {popularCities.map(item => (

                                        <div
                                            key={item}
                                            className="locUI-chip"
                                            onClick={() => chooseCity(item)}
                                        >
                                            {item}
                                        </div>

                                    ))}

                                </div>
                            </>
                        )}

                    </div>

                </div>,

                document.body
            )}

        </>
    );

}