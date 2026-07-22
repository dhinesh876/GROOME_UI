// // src/pages/dashboard/BookAppointment.jsx
// //
// // Used inside CustomerDashboard's shop detail view.
// // Flow: pick services -> pick a date -> "Find times" -> pick an
// // employee + slot from what the backend says is free -> confirm.

// import { useState } from "react";
// import { createAppointment } from "../../api/appointmentApi";
// import { getAvailableSlots } from "../../api/slotApi";

// export default function BookAppointment({ shop, onBooked }) {
//   const [selectedServiceIds, setSelectedServiceIds] = useState([]);
//   const [date, setDate] = useState("");
//   const [employeesWithSlots, setEmployeesWithSlots] = useState(null); // null = not searched yet
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [selectedSlot, setSelectedSlot] = useState("");
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [booking, setBooking] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const toggleService = (serviceId) => {
//     setSelectedServiceIds((prev) =>
//       prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
//     );
//     // changing services invalidates any slot search already done
//     setEmployeesWithSlots(null);
//     setSelectedEmployeeId("");
//     setSelectedSlot("");
//   };

//   const handleFindTimes = async () => {
//     setError("");
//     setLoadingSlots(true);
//     setEmployeesWithSlots(null);
//     setSelectedEmployeeId("");
//     setSelectedSlot("");
//     try {
//       const res = await getAvailableSlots(shop._id, date);
//       setEmployeesWithSlots(res.data.employees || res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not load available times.");
//     } finally {
//       setLoadingSlots(false);
//     }
//   };

//   const handleConfirm = async () => {
//     setBooking(true);
//     setError("");
//     try {
//       await createAppointment({
//         employeeId: selectedEmployeeId,
//         services: selectedServiceIds,
//         date,
//         starttime: selectedSlot,
//       });
//       setSuccess("Appointment booked.");
//       onBooked?.();
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not book this slot — it may already be taken.");
//     } finally {
//       setBooking(false);
//     }
//   };

//   if (success) {
//     return <p className="auth-success">{success}</p>;
//   }

//   return (
//     <div style={{ marginTop: 8 }}>
//       <h3 style={{ marginBottom: 10 }}>Select services</h3>
//       <div className="pill-row" style={{ marginBottom: 20 }}>
//         {(shop.services || []).map((s) => {
//           const active = selectedServiceIds.includes(s._id);
//           return (
//             <span
//               key={s._id}
//               className="pill"
//               onClick={() => toggleService(s._id)}
//               style={{
//                 cursor: "pointer",
//                 background: active ? "var(--burgundy)" : "var(--ivory)",
//                 color: active ? "#fff" : "var(--ink)",
//                 borderColor: active ? "var(--burgundy)" : "var(--line)",
//               }}
//             >
//               {s.servicename} · ₹{s.price}
//             </span>
//           );
//         })}
//       </div>

//       <div className="dash-field" style={{ maxWidth: 220 }}>
//         <label>Date</label>
//         <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//       </div>

//       {error && <p className="auth-error">{error}</p>}

//       <button
//         className="btn-primary"
//         onClick={handleFindTimes}
//         disabled={selectedServiceIds.length === 0 || !date || loadingSlots}
//         style={{ marginBottom: 20 }}
//       >
//         {loadingSlots ? "Searching..." : "Find available times"}
//       </button>

//       {employeesWithSlots && (
//         <div>
//           {employeesWithSlots.length === 0 ? (
//             <p className="empty-state">No availability that day — try another date.</p>
//           ) : (
//             employeesWithSlots.map((emp) => (
//               <div key={emp._id} style={{ marginBottom: 18 }}>
//                 <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{emp.name}</p>
//                 <div className="pill-row">
//                   {(emp.slots || []).map((slot) => {
//                     const active = selectedEmployeeId === emp._id && selectedSlot === slot;
//                     return (
//                       <span
//                         key={slot}
//                         className="pill"
//                         onClick={() => {
//                           setSelectedEmployeeId(emp._id);
//                           setSelectedSlot(slot);
//                         }}
//                         style={{
//                           cursor: "pointer",
//                           background: active ? "var(--gold)" : "var(--ivory)",
//                           borderColor: active ? "var(--gold)" : "var(--line)",
//                         }}
//                       >
//                         {slot}
//                       </span>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))
//           )}

//           {selectedSlot && (
//             <button className="btn-primary" onClick={handleConfirm} disabled={booking}>
//               {booking ? "Booking..." : `Confirm ${selectedSlot}`}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


// src/pages/dashboard/BookAppointment.jsx

// src/pages/dashboard/BookAppointment.jsx

// import { useState } from "react";

// import {
//   getAvailableSlots,
//   getEmployeesWithSlots,
// } from "../../api/slotApi";


// import { createAppointment } from "../../api/appointmentApi";

// export default function BookAppointment({
//   shop,
//   onBooked,
// }) {
//   const user = JSON.parse(
//     localStorage.getItem("user") || "{}"
//   );
//   /*
//   ============================================
//   STEP 1
//   SELECT SERVICES
//   ============================================
//   */

//   const [
//     selectedServiceIds,
//     setSelectedServiceIds,
//   ] = useState([]);


//   /*
//   ============================================
//   STEP 2
//   SELECT DATE
//   ============================================
//   */

//   const [
//     date,
//     setDate,
//   ] = useState("");


//   /*
//   ============================================
//   STEP 3
//   ELIGIBLE EMPLOYEES
//   ============================================
//   */

//   const [
//     employees,
//     setEmployees,
//   ] = useState(null);


//   /*
//   ============================================
//   STEP 4
//   SELECTED EMPLOYEE
//   ============================================
//   */

//   const [
//     selectedEmployeeId,
//     setSelectedEmployeeId,
//   ] = useState("");


//   /*
//   ============================================
//   STEP 5
//   AVAILABLE SLOTS
//   ============================================
//   */

//   const [
//     availableSlots,
//     setAvailableSlots,
//   ] = useState(null);


//   /*
//   ============================================
//   STEP 6
//   SELECTED SLOT
//   ============================================
//   */

//   const [
//     selectedSlot,
//     setSelectedSlot,
//   ] = useState(null);


//   /*
//   ============================================
//   LOADING STATES
//   ============================================
//   */

//   const [
//     loadingEmployees,
//     setLoadingEmployees,
//   ] = useState(false);


//   const [
//     loadingSlots,
//     setLoadingSlots,
//   ] = useState(false);


//   const [
//     booking,
//     setBooking,
//   ] = useState(false);


//   /*
//   ============================================
//   ERROR
//   ============================================
//   */

//   const [
//     error,
//     setError,
//   ] = useState("");


//   /*
//   ============================================
//   STEP 1
//   SELECT / UNSELECT SERVICE
//   ============================================
//   */

//   const toggleService = (
//     serviceId
//   ) => {
//     setSelectedServiceIds(
//       (previousIds) => {
//         if (
//           previousIds.includes(
//             serviceId
//           )
//         ) {
//           return previousIds.filter(
//             (id) =>
//               id !== serviceId
//           );
//         }

//         return [
//           ...previousIds,
//           serviceId,
//         ];
//       }
//     );


//     // Reset all later steps
//     // when services change

//     setEmployees(null);

//     setSelectedEmployeeId("");

//     setAvailableSlots(null);

//     setSelectedSlot(null);

//     setError("");
//   };


//   /*
//   ============================================
//   STEP 2
//   SELECT DATE
//   ============================================
//   */

//   const handleDateChange = (
//     value
//   ) => {
//     setDate(value);


//     // Reset all later steps
//     // when date changes

//     setEmployees(null);

//     setSelectedEmployeeId("");

//     setAvailableSlots(null);

//     setSelectedSlot(null);

//     setError("");
//   };


//   /*
//   ============================================
//   STEP 3
//   GET ELIGIBLE EMPLOYEES
//   ============================================
//   */

//   const handleFindEmployees =
//     async () => {
//       setError("");

//       setLoadingEmployees(true);

//       setEmployees(null);

//       setSelectedEmployeeId("");

//       setAvailableSlots(null);

//       setSelectedSlot(null);


//       try {
//         const response =
//           await getEmployeesWithSlots(
//             shop._id,
//             date,
//             selectedServiceIds
//           );


//         setEmployees(
//           response.data.employees ||
//           response.data
//         );

//       } catch (err) {
//         setError(
//           err.response?.data?.message ||
//           "Could not load eligible employees."
//         );

//       } finally {
//         setLoadingEmployees(false);
//       }
//     };


//   /*
//   ============================================
//   STEP 4 + STEP 5
//   SELECT EMPLOYEE
//   THEN GET AVAILABLE SLOTS
//   ============================================
//   */

//   const handleSelectEmployee = async (employeeId) => {
//     setSelectedEmployeeId(employeeId);

//     setAvailableSlots(null);
//     setSelectedSlot(null);
//     setError("");
//     setLoadingSlots(true);

//     try {
//       const response = await getAvailableSlots(
//         shop._id,
//         date,
//         selectedServiceIds,
//         employeeId
//       );

//       setAvailableSlots(
//         response.data.slots || response.data
//       );
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//         "Could not load available slots."
//       );
//     } finally {
//       setLoadingSlots(false);
//     }
//   };


//   /*
//   ============================================
//   STEP 6
//   SELECT SLOT
//   ============================================
//   */

//   const handleSelectSlot = (
//     slot
//   ) => {
//     if (
//       slot.status !==
//       "available"
//     ) {
//       return;
//     }


//     setSelectedSlot(slot);

//     setError("");
//   };


//   /*
//   ============================================
//   STEP 7
//   BOOK APPOINTMENT
//   ============================================
//   */

//   const handleConfirm = async () => {
//     if (!selectedSlot) {
//       setError("Please select an available slot.");
//       return;
//     }

//     if (!selectedEmployeeId) {
//       setError("Please select an employee.");
//       return;
//     }

//     setBooking(true);
//     setError("");

//     try {

//       await createAppointment(
//         shop._id,
//         {
//           customerId: user.userid,

//           date,

//           employeeId: selectedEmployeeId,

//           services: selectedServiceIds.map((id) => ({
//             serviceItemId: id,
//           })),

//           starttime: selectedSlot.start,
//         }
//       );

//       onBooked?.();

//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//         "Could not book this appointment."
//       );

//     } finally {
//       setBooking(false);
//     }
//   };


//   return (

//     <div
//       style={{
//         marginTop: 8,
//       }}
//     >

//       {/* ======================================
//           STEP 1: SELECT SERVICES
//       ======================================= */}

//       <h3
//         style={{
//           marginBottom: 10,
//           color: "black"
//         }}
//       >
//         Select services
//       </h3>


//       <div
//         className="pill-row"
//         style={{
//           marginBottom: 24,
//         }}
//       >
//         {(shop.services || []).map(
//           (service) => {
//             const active =
//               selectedServiceIds.includes(
//                 service._id
//               );


//             return (
//               <span
//                 key={service._id}
//                 className="pill"

//                 onClick={() =>
//                   toggleService(
//                     service._id
//                   )
//                 }

//                 style={{
//                   cursor: "pointer",

//                   background: active
//                     ? "var(--burgundy)"
//                     : "var(--ivory)",

//                   color: active
//                     ? "#fff"
//                     : "var(--ink)",

//                   borderColor: active
//                     ? "var(--burgundy)"
//                     : "var(--line)",
//                 }}
//               >
//                 {service.servicename}

//                 {" · "}

//                 ₹{service.price}
//               </span>
//             );
//           }
//         )}
//       </div>


//       {/* ======================================
//           STEP 2: SELECT DATE
//       ======================================= */}

//       <h3
//         style={{
//           marginBottom: 10,
//           color: "black"

//         }}
//       >
//         Select date
//       </h3>


//       <div
//         className="dash-field"
//         style={{
//           maxWidth: 220,
//           marginBottom: 20,
//         }}
//       >
//         <label>
//           Date
//         </label>


//         <input
//           type="date"
//           value={date}

//           onChange={(e) =>
//             handleDateChange(
//               e.target.value
//             )
//           }
//         />
//       </div>


//       {/* ======================================
//           STEP 3: FIND ELIGIBLE EMPLOYEES
//       ======================================= */}

//       <button
//         className="btn-primary"

//         onClick={
//           handleFindEmployees
//         }

//         disabled={
//           selectedServiceIds.length ===
//           0 ||
//           !date ||
//           loadingEmployees
//         }

//         style={{
//           marginBottom: 20,
//         }}
//       >
//         {loadingEmployees
//           ? "Searching..."
//           : "Find eligible employees"}
//       </button>


//       {/* ERROR */}

//       {error && (
//         <p className="auth-error">
//           {error}
//         </p>
//       )}


//       {/* ======================================
//           STEP 3: SHOW ELIGIBLE EMPLOYEES
//       ======================================= */}

//       {employees && (
//         <div>

//           {employees.length === 0 ? (

//             <p className="empty-state">
//               No employee can perform all
//               selected services.
//             </p>

//           ) : (

//             <>
//               <h3
//                 style={{
//                   marginBottom: 10,
//                   color: "black"

//                 }}
//               >
//                 Eligible employees
//               </h3>


//               <div
//                 className="pill-row"
//                 style={{
//                   marginBottom: 24,
//                 }}
//               >
//                 {/* {employees.map(
//                   (employee) => {
//                     const active =
//                       selectedEmployeeId ===
//                       employee._id;


//                     return (
//                       <span
//                         key={employee._id}

//                         className="pill"

//                         onClick={() =>
//                           handleSelectEmployee(
//                             employee._id
//                           )
//                         }

//                         style={{
//                           cursor:
//                             "pointer",

//                           background:
//                             active
//                               ? "var(--burgundy)"
//                               : "var(--ivory)",

//                           color:
//                             active
//                               ? "#fff"
//                               : "var(--ink)",

//                           borderColor:
//                             active
//                               ? "var(--burgundy)"
//                               : "var(--line)",
//                         }}
//                       >
//                         {employee.name}
//                       </span>
//                     );
//                   }
//                 )} */}

//                 {employees.map((employee) => {
//                   const active =
//                     selectedEmployeeId === employee._id;

//                   return (
//                     <span
//                       key={employee._id}
//                       className="pill"
//                       onClick={() =>
//                         handleSelectEmployee(
//                           employee._id
//                         )
//                       }
//                       style={{
//                         cursor: "pointer",

//                         background: active
//                           ? "var(--burgundy)"
//                           : "var(--ivory)",

//                         color: active
//                           ? "#fff"
//                           : "var(--ink)",

//                         borderColor: active
//                           ? "var(--burgundy)"
//                           : "var(--line)",
//                       }}
//                     >
//                       {employee.name}
//                     </span>
//                   );
//                 })}
//               </div>
//             </>

//           )}


//           {/* ==================================
//               STEP 5: AVAILABLE SLOTS
//           =================================== */}

//           {selectedEmployeeId && (

//             <div
//               style={{
//                 marginBottom: 24,
//               }}
//             >

//               <h3
//                 style={{
//                   marginBottom: 10,
//                   color: "black"

//                 }}
//               >
//                 Available slots
//               </h3>


//               {loadingSlots ? (

//                 <p>
//                   Loading available slots...
//                 </p>

//               ) : availableSlots &&
//                 availableSlots.length ===
//                 0 ? (

//                 <p className="empty-state">
//                   No slots found for this
//                   employee on this date.
//                 </p>

//               ) : (

//                 <div
//                   className="pill-row"
//                 >

//                   {(availableSlots || [])
//                     .map(
//                       (
//                         slot,
//                         index
//                       ) => {

//                         const isAvailable =
//                           slot.status ===
//                           "available";


//                         const isOccupied =
//                           slot.status ===
//                           "occupied";

//                         const isLunch =
//                           slot.status === "lunch_break";

//                         const active =
//                           selectedSlot?.start ===
//                           slot.start &&
//                           selectedSlot?.end ===
//                           slot.end;


//                         return (
//                           <span
//                             key={`${slot.start}-${slot.end}-${index}`}

//                             className="pill"

//                             onClick={() => {
//                               if (
//                                 isAvailable
//                               ) {
//                                 handleSelectSlot(
//                                   slot
//                                 );
//                               }
//                             }}

//                             style={{
//                               cursor:
//                                 isAvailable
//                                   ? "pointer"
//                                   : "not-allowed",

//                               background:
//                                 isAvailable
//                                   ? active
//                                     ? "var(--gold)"
//                                     : "#d1fae5"
//                                   : isLunch
//                                     ? "#fef3c7"
//                                     : "#fee2e2",

//                               color:
//                                 isAvailable
//                                   ? "#166534"
//                                   : isLunch
//                                     ? "#92400e"
//                                     : "#991b1b",

//                               borderColor:
//                                 isAvailable
//                                   ? "#22c55e"
//                                   : isLunch
//                                     ? "#f59e0b"
//                                     : "#ef4444",

//                               opacity:
//                                 isOccupied
//                                   ? 0.8
//                                   : 1,
//                             }}
//                           >
//                             {slot.start}

//                             {" – "}

//                             {slot.end}

//                             {" "}
//                             {
//                               isAvailable
//                                 ? "Available"
//                                 : isLunch
//                                   ? "Lunch Break"
//                                   : "Occupied"
//                             }
//                           </span>
//                         );
//                       }
//                     )}

//                 </div>

//               )}

//             </div>

//           )}


//           {/* ==================================
//               STEP 6: SELECTED SLOT
//           =================================== */}

//           {selectedSlot && (

//             <div
//               style={{
//                 marginBottom: 20,
//               }}
//             >

//               <h3
//                 style={{
//                   marginBottom: 8,
//                   color: "black"

//                 }}
//               >
//                 Selected slot
//               </h3>


//               <p
//                 style={{
//                   color: "black"
//                 }}
//               >
//                 Selected time:{" "}

//                 <strong>
//                   {selectedSlot.start}-{selectedSlot.end}
//                 </strong>
//               </p>

//             </div>

//           )}


//           {/* ==================================
//               STEP 7: BOOK APPOINTMENT
//           =================================== */}

//           {selectedSlot && (

//             <button
//               className="btn-primary"

//               onClick={
//                 handleConfirm
//               }

//               disabled={
//                 booking
//               }
//             >
//               {booking
//                 ? "Booking..."
//                 : `Book appointment at ${selectedSlot.start}`}
//             </button>

//           )}

//         </div>
//       )}

//     </div>

//   );

// }


//22-07

// Visual redesign to match the reference booking card layout.
// Flow (unchanged): select services -> select date -> find eligible
// employees -> pick ONE employee -> fetch that employee's slots ->
// pick a slot -> confirm.
//
// npm install lucide-react   (icons used below)
// import {
//   Calendar,
//   CalendarCheck,
//   Check,
//   Clock,
//   Scissors,
//   Search,
//   ShieldCheck,
// } from "lucide-react";
// import { useState } from "react";
// import { createAppointment } from "../../api/appointmentApi";
// import { getAvailableSlots, getEmployeesWithSlots } from "../../api/slotApi";
// import "../../styles/BookAppointment.css";

// export default function BookAppointment({ shop, onBooked }) {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   // Step 1
//   const [selectedServiceIds, setSelectedServiceIds] = useState([]);
//   // Step 2
//   const [date, setDate] = useState("");
//   // Step 3
//   const [employees, setEmployees] = useState(null);
//   const [loadingEmployees, setLoadingEmployees] = useState(false);
//   // Step 4
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   // Step 5
//   const [availableSlots, setAvailableSlots] = useState(null);
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   // Step 6
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   // Step 7
//   const [booking, setBooking] = useState(false);

//   const [error, setError] = useState("");

//   const selectedEmployee = employees?.find((e) => e._id === selectedEmployeeId);

//   const toggleService = (serviceId) => {
//     setSelectedServiceIds((prev) =>
//       prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
//     );
//     setEmployees(null);
//     setSelectedEmployeeId("");
//     setAvailableSlots(null);
//     setSelectedSlot(null);
//     setError("");
//   };

//   const handleDateChange = (value) => {
//     setDate(value);
//     setEmployees(null);
//     setSelectedEmployeeId("");
//     setAvailableSlots(null);
//     setSelectedSlot(null);
//     setError("");
//   };

//   const handleFindEmployees = async () => {
//     setError("");
//     setLoadingEmployees(true);
//     setEmployees(null);
//     setSelectedEmployeeId("");
//     setAvailableSlots(null);
//     setSelectedSlot(null);
//     try {
//       const res = await getEmployeesWithSlots(shop._id, date, selectedServiceIds);
//       setEmployees(res.data.employees || res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not load eligible employees.");
//     } finally {
//       setLoadingEmployees(false);
//     }
//   };

//   const handleSelectEmployee = async (employeeId) => {
//     setSelectedEmployeeId(employeeId);
//     setAvailableSlots(null);
//     setSelectedSlot(null);
//     setError("");
//     setLoadingSlots(true);
//     try {
//       const res = await getAvailableSlots(shop._id, date, selectedServiceIds, employeeId);
//       setAvailableSlots(res.data.slots || res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not load available slots.");
//     } finally {
//       setLoadingSlots(false);
//     }
//   };

//   const handleSelectSlot = (slot) => {
//     if (slot.status !== "available") return;
//     setSelectedSlot(slot);
//     setError("");
//   };

//   const handleConfirm = async () => {
//     if (!selectedSlot) {
//       setError("Please select an available slot.");
//       return;
//     }
//     setBooking(true);
//     setError("");
//     try {
//       await createAppointment(shop._id, {
//         customerId: user.userid,
//         date,
//         employeeId: selectedEmployeeId,
//         services: selectedServiceIds.map((id) => ({ serviceItemId: id })),
//         starttime: selectedSlot.start,
//       });
//       onBooked?.();
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not book this appointment.");
//     } finally {
//       setBooking(false);
//     }
//   };

//   return (
//     <div className="ba-card">
//       {/* ---------- Header ---------- */}
//       <div className="ba-header">
//         <div className="ba-header-icon">
//           <Scissors size={26} />
//         </div>
//         <div>
//           <h1>{shop.shopname}</h1>
//           <p>Select your services and preferred time</p>
//         </div>
//       </div>

//       {/* ---------- Step 1: services ---------- */}
//       <div className="ba-step-block">
//         <div className="ba-step-label">
//           <span className="ba-step-number">1</span>
//           <h3>Select Services</h3>
//         </div>
//         <div className="ba-service-grid">
//           {(shop.services || []).map((s) => {
//             const active = selectedServiceIds.includes(s._id);
//             return (
//               <div
//                 key={s._id}
//                 className={`ba-service-card ${active ? "selected" : ""}`}
//                 onClick={() => toggleService(s._id)}
//               >
//                 {active && (
//                   <span className="ba-check-badge">
//                     <Check size={14} />
//                   </span>
//                 )}
//                 <span className="ba-service-icon">
//                   <Scissors size={20} />
//                 </span>
//                 <div>
//                   <div className="ba-service-name">{s.servicename}</div>
//                   <div className="ba-service-price">₹{s.price}</div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ---------- Step 2: date ---------- */}
//       <div className="ba-step-block">
//         <div className="ba-step-label">
//           <span className="ba-step-number">2</span>
//           <h3>Select Date</h3>
//         </div>
//         <div className="ba-date-field">
//           <Calendar size={18} />
//           <input type="date" value={date} onChange={(e) => handleDateChange(e.target.value)} />
//         </div>
//       </div>

//       {/* ---------- Find employees trigger ---------- */}
//       <button
//         className="ba-book-btn ba-find-btn"
//         onClick={handleFindEmployees}
//         disabled={selectedServiceIds.length === 0 || !date || loadingEmployees}
//         style={{ marginBottom: 28 }}
//       >
//         <Search size={16} />
//         {loadingEmployees ? "Searching..." : "Find eligible employees"}
//       </button>

//       {error && <p className="auth-error">{error}</p>}

//       {/* ---------- Step 3: eligible employees ---------- */}
//       {employees && (
//         <div className="ba-step-block">
//           <div className="ba-step-label">
//             <span className="ba-step-number">3</span>
//             <h3>Eligible Employee</h3>
//           </div>

//           {employees.length === 0 ? (
//             <p className="empty-state">No employee can perform all selected services.</p>
//           ) : (
//             employees.map((employee) => {
//               const active = selectedEmployeeId === employee._id;
//               return (
//                 <div
//                   key={employee._id}
//                   className={`ba-employee-card ${active ? "selected" : ""}`}
//                   onClick={() => handleSelectEmployee(employee._id)}
//                 >
//                   <span className="ba-employee-avatar">{employee.name?.[0]?.toUpperCase()}</span>
//                   <span className="ba-employee-name">{employee.name}</span>
//                   {active && (
//                     <span className="ba-employee-check">
//                       <Check size={16} />
//                     </span>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       )}

//       {/* ---------- Step 4: available slots ---------- */}
//       {selectedEmployeeId && (
//         <div className="ba-step-block">
//           <div className="ba-step-label">
//             <span className="ba-step-number">4</span>
//             <h3>Available Time Slots</h3>
//           </div>

//           {loadingSlots ? (
//             <p className="empty-state">Loading available slots...</p>
//           ) : availableSlots && availableSlots.length === 0 ? (
//             <p className="empty-state">No slots found for this employee on this date.</p>
//           ) : (
//             <div className="ba-slot-grid">
//               {(availableSlots || []).map((slot, index) => {
//                 const isAvailable = slot.status === "available";
//                 const isLunch = slot.status === "lunch_break";
//                 // anything that's neither available nor lunch_break falls
//                 // through to "occupied" in stateClass below — no separate
//                 // isOccupied flag needed
//                 const active =
//                   selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;

//                 const stateClass = active
//                   ? "selected"
//                   : isAvailable
//                     ? "available"
//                     : isLunch
//                       ? "lunch"
//                       : "occupied";

//                 return (
//                   <div
//                     key={`${slot.start}-${slot.end}-${index}`}
//                     className={`ba-slot ${stateClass}`}
//                     onClick={() => (isAvailable ? handleSelectSlot(slot) : undefined)}
//                   >
//                     <span className="ba-slot-time">
//                       <Clock size={13} />
//                       {slot.start} – {slot.end}
//                     </span>
//                     <span className="ba-slot-status">
//                       {isAvailable ? (active ? "Selected" : "Available") : isLunch ? "Lunch Break" : "Occupied"}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ---------- Summary + confirm ---------- */}
//       {selectedSlot && (
//         <div className="ba-summary-bar">
//           <div className="ba-summary-left">
//             <span className="ba-summary-icon">
//               <Clock size={20} />
//             </span>
//             <div>
//               <div className="ba-summary-label">Selected Time</div>
//               <div className="ba-summary-time">
//                 {selectedSlot.start} – {selectedSlot.end}
//               </div>
//               <div className="ba-summary-meta">
//                 {date} · {selectedEmployee?.name}
//               </div>
//             </div>
//           </div>

//           <div className="ba-summary-right">
//             <button className="ba-book-btn" onClick={handleConfirm} disabled={booking}>
//               <CalendarCheck size={17} />
//               {booking ? "Booking..." : "Book Appointment"}
//             </button>
//             <span className="ba-secure-note">
//               <ShieldCheck size={13} />
//               Your booking is safe and secure
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// src/pages/dashboard/BookAppointment.jsx
//
// Visual redesign to match the reference booking card layout.
// Flow (unchanged): select services -> select date -> find eligible
// employees -> pick ONE employee -> fetch that employee's slots ->
// pick a slot -> confirm.
//
// npm install lucide-react   (icons used below)

import {
  Calendar,
  CalendarCheck,
  Check,
  Clock,
  Scissors,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { createAppointment } from "../../api/appointmentApi";
import { getAvailableSlots, getEmployeesWithSlots } from "../../api/slotApi";
import "../../styles/BookAppointment.css";

export default function BookAppointment({ shop, onBack, onBooked }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Step 1
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  // Step 2
  const [date, setDate] = useState("");
  // Step 3
  const [employees, setEmployees] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  // Step 4
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  // Step 5
  const [availableSlots, setAvailableSlots] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  // Step 6
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [totalDuration, settotalDuration] = useState(null);
  const [cost, setcost] = useState(null);

  // Step 7
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");

  const selectedEmployee = employees?.find((e) => e._id === selectedEmployeeId);

  const toggleService = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
    setEmployees(null);
    setSelectedEmployeeId("");
    setAvailableSlots(null);
    setSelectedSlot(null);
    settotalDuration(null);
    setcost(null);
    setError("");
  };

  const handleDateChange = (value) => {
    setDate(value);
    setEmployees(null);
    setSelectedEmployeeId("");
    setAvailableSlots(null);
    setSelectedSlot(null);
    settotalDuration(null);
    setcost(null);
    setError("");
  };

  const handleFindEmployees = async () => {
    setError("");
    setLoadingEmployees(true);
    setEmployees(null);
    setSelectedEmployeeId("");
    setAvailableSlots(null);
    settotalDuration(null);
    setcost(null);
    setSelectedSlot(null);
    try {
      const res = await getEmployeesWithSlots(shop._id, date, selectedServiceIds);
      setEmployees(res.data.employees || res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load eligible employees.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSelectEmployee = async (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setAvailableSlots(null);
    setSelectedSlot(null);
    settotalDuration(null);
    setcost(null);
    setError("");
    setLoadingSlots(true);
    try {
      const res = await getAvailableSlots(shop._id, date, selectedServiceIds, employeeId);
      setAvailableSlots(res.data.slots || res.data);
      settotalDuration(res.data.totalDuration);
      setcost(res.data.totalPrice);

    } catch (err) {
      setError(err.response?.data?.message || "Could not load available slots.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSelectSlot = (slot) => {
    if (slot.status !== "available") return;
    setSelectedSlot(slot);
    setError("");
  };

  const handleConfirm = async () => {
    if (!selectedSlot) {
      setError("Please select an available slot.");
      return;
    }
    setBooking(true);
    setError("");
    try {
      await createAppointment(shop._id, {
        customerId: user.userid,
        date,
        employeeId: selectedEmployeeId,
        services: selectedServiceIds.map((id) => ({ serviceItemId: id })),
        starttime: selectedSlot.start,
      });
      onBooked?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not book this appointment.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="ba-card">
      {onBack && (
        <button className="detail-back" onClick={onBack} style={{ marginBottom: 16 }}>
          ← Back to results
        </button>
      )}

      {/* ---------- Header ---------- */}
      <div className="ba-header">
        <div className="ba-header-icon">
          <Scissors size={26} />
        </div>
        <div>
          <h1>{shop.shopname}</h1>
          <p>Select your services and preferred time</p>
        </div>
      </div>

      {/* ---------- Step 1: services ---------- */}
      <div className="ba-step-block">
        <div className="ba-step-label">
          <span className="ba-step-number">1</span>
          <h3>Select Services</h3>
        </div>
        <div className="ba-service-grid">
          {(shop.services || []).map((s) => {
            const active = selectedServiceIds.includes(s._id);
            return (
              <div
                key={s._id}
                className={`ba-service-card ${active ? "selected" : ""}`}
                onClick={() => toggleService(s._id)}
              >
                {active && (
                  <span className="ba-check-badge">
                    <Check size={14} />
                  </span>
                )}
                <span className="ba-service-icon">
                  <Scissors size={20} />
                </span>
                <div>
                  <div className="ba-service-name">{s.servicename}</div>
                  <div className="ba-service-price">₹{s.price}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- Step 2: date ---------- */}
      <div className="ba-step-block">
        <div className="ba-step-label">
          <span className="ba-step-number">2</span>
          <h3>Select Date</h3>
        </div>
        <div className="ba-date-field">
          <Calendar size={18} />
          <input type="date" value={date} onChange={(e) => handleDateChange(e.target.value)} />
        </div>
      </div>

      {/* ---------- Find employees trigger ---------- */}
      <button
        className="ba-book-btn ba-find-btn"
        onClick={handleFindEmployees}
        disabled={selectedServiceIds.length === 0 || !date || loadingEmployees}
        style={{ marginBottom: 28 }}
      >
        <Search size={16} />
        {loadingEmployees ? "Searching..." : "Find eligible employees"}
      </button>

      {error && <p className="auth-error">{error}</p>}

      {/* ---------- Step 3: eligible employees ---------- */}
      {employees && (
        <div className="ba-step-block">
          <div className="ba-step-label">
            <span className="ba-step-number">3</span>
            <h3>Eligible Employee</h3>
          </div>

          {employees.length === 0 ? (
            <p className="empty-state">No employee can perform all selected services.</p>
          ) : (
            employees.map((employee) => {
              const active = selectedEmployeeId === employee._id;
              return (
                <div
                  key={employee._id}
                  className={`ba-employee-card ${active ? "selected" : ""}`}
                  onClick={() => handleSelectEmployee(employee._id)}
                >
                  <span className="ba-employee-avatar">{employee.name?.[0]?.toUpperCase()}</span>
                  <span className="ba-employee-name">{employee.name}</span>
                  {active && (
                    <span className="ba-employee-check">
                      <Check size={16} />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ---------- Step 4: available slots ---------- */}
      {selectedEmployeeId && (
        <div className="ba-step-block">
          <div className="ba-step-label">
            <span className="ba-step-number">4</span>
            <h3>Available Time Slots</h3>
          </div>

          {loadingSlots ? (
            <p className="empty-state">Loading available slots...</p>
          ) : availableSlots && availableSlots.length === 0 ? (
            <p className="empty-state">No slots found for this employee on this date.</p>
          ) : (
            <div className="ba-slot-grid">
              {(availableSlots || []).map((slot, index) => {
                const isAvailable = slot.status === "available";
                const isLunch = slot.status === "lunch_break";
                // anything that's neither available nor lunch_break falls
                // through to "occupied" in stateClass below — no separate
                // isOccupied flag needed
                const active =
                  selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;

                const stateClass = active
                  ? "selected"
                  : isAvailable
                    ? "available"
                    : isLunch
                      ? "lunch"
                      : "occupied";

                return (
                  <div
                    key={`${slot.start}-${slot.end}-${index}`}
                    className={`ba-slot ${stateClass}`}
                    onClick={() => (isAvailable ? handleSelectSlot(slot) : undefined)}
                  >
                    <span className="ba-slot-time">
                      <Clock size={13} />
                      {slot.start} – {slot.end}
                    </span>
                    <span className="ba-slot-status">
                      {isAvailable ? (active ? "Selected" : "Available") : isLunch ? "Lunch Break" : "Occupied"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------- Summary + confirm ---------- */}
      {selectedSlot && (
        <div className="ba-summary-bar">
          <div className="ba-summary-left">
            <span className="ba-summary-icon">
              <Clock size={20} />
            </span>
            <div>
              <div className="ba-summary-label">Selected Time</div>
              <div className="ba-summary-time">
                {selectedSlot.start} – {selectedSlot.end}
              </div>
              <div className="ba-summary-meta">
                {date} · {selectedEmployee?.name}
              </div>
              <div className="ba-summary-meta">
                {"Service Duration"} : {totalDuration} {"Min"}
              </div>
              <div className="ba-summary-meta">
                {"Service Cost"} : ₹ {cost}
              </div>
            </div>
          </div>

          <div className="ba-summary-right">
            <button className="ba-book-btn" onClick={handleConfirm} disabled={booking}>
              <CalendarCheck size={17} />
              {booking ? "Booking..." : "Book Appointment"}
            </button>
            <span className="ba-secure-note">
              <ShieldCheck size={13} />
              Your booking is safe and secure
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
