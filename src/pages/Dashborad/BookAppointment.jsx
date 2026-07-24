// // src/pages/dashboard/BookAppointment.jsx
// //
// // Visual redesign to match the reference booking card layout.
// // Flow (unchanged): select services -> select date -> find eligible
// // employees -> pick ONE employee -> fetch that employee's slots ->
// // pick a slot -> confirm.
// //
// // npm install lucide-react   (icons used below)

// import {
//   CalendarCheck,
//   Check,
//   Clock,
//   Scissors,
//   Search,
//   ShieldCheck,
// } from "lucide-react";
// import { useMemo, useState } from "react";
// import { createAppointment } from "../../api/appointmentApi";
// import { getAvailableSlots, getEmployeesWithSlots } from "../../api/slotApi";
// import "../../styles/BookAppointment.css";

// export default function BookAppointment({ shop, onBack, onBooked }) {
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
//   const [totalDuration, settotalDuration] = useState(null);

//   // Step 6
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   // Step 7
//   const [booking, setBooking] = useState(false);

//   const [error, setError] = useState("");

//   const selectedEmployee = employees?.find((e) => e._id === selectedEmployeeId);

//   // sum of the prices of every currently-selected service
//   const totalAmount = (shop.services || [])
//     .filter((s) => selectedServiceIds.includes(s._id))
//     .reduce((sum, s) => sum + Number(s.price || 0), 0);

//   // next 21 days, for the date-strip picker below
//   const dateList = useMemo(() => {
//     const list = [];
//     const today = new Date();
//     for (let i = 0; i < 21; i++) {
//       const d = new Date(today);
//       d.setDate(today.getDate() + i);
//       list.push({
//         iso: d.toISOString().slice(0, 10),
//         day: d.getDate(),
//         weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
//         month: d.toLocaleDateString("en-US", { month: "long" }),
//       });
//     }
//     return list;
//   }, []);

//   // shows the month of whichever date is currently selected,
//   // falling back to the first visible date's month
//   const currentMonthLabel =
//     dateList.find((d) => d.iso === date)?.month || dateList[0]?.month;


//   const toggleService = (serviceId) => {
//     setSelectedServiceIds((prev) =>
//       prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
//     );
//     setEmployees(null);
//     setSelectedEmployeeId("");
//     setAvailableSlots(null);
//     setSelectedSlot(null);
//     settotalDuration(null);
//     setError("");
//   };

//   const handleDateChange = (value) => {
//     setDate(value);
//     setEmployees(null);
//     setSelectedEmployeeId("");
//     setAvailableSlots(null);
//     setSelectedSlot(null);
//     settotalDuration(null);
//     setError("");
//   };

//   const handleFindEmployees = async () => {
//     setError("");
//     setLoadingEmployees(true);
//     setEmployees(null);
//     setSelectedEmployeeId("");
//     setAvailableSlots(null);
//     settotalDuration(null);
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
//     settotalDuration(null);
//     setError("");
//     setLoadingSlots(true);
//     try {
//       const res = await getAvailableSlots(shop._id, date, selectedServiceIds, employeeId);
//       setAvailableSlots(res.data.slots || res.data);
//       settotalDuration(res.data.totalDuration);
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
//       {onBack && (
//         <button className="detail-back" onClick={onBack} style={{ marginBottom: 16 }}>
//           ← Back to results
//         </button>
//       )}

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
//         <div className="ba-date-month">{currentMonthLabel}</div>
//         <div className="ba-date-strip">
//           {dateList.map((d) => {
//             const active = d.iso === date;
//             return (
//               <div
//                 key={d.iso}
//                 className="ba-date-pill"
//                 onClick={() => handleDateChange(d.iso)}
//               >
//                 <span className={`ba-date-circle ${active ? "selected" : ""}`}>{d.day}</span>
//                 <span className="ba-date-weekday">{d.weekday}</span>
//               </div>
//             );
//           })}
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
//       {/* {selectedEmployeeId && (
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
//       )} */}


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
//               {/* {(availableSlots || []).map((slot, index) => {
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
//               })} */}

//               {(availableSlots || []).map((slot, index) => {
//                 const isPast = slot.isPast; // <-- only this line replaces the old 4 lines

//                 const isAvailable = slot.status === "available" && !isPast;
//                 const isLunch = slot.status === "lunch_break";

//                 const active =
//                   selectedSlot?.start === slot.start &&
//                   selectedSlot?.end === slot.end;

//                 const stateClass = active
//                   ? "selected"
//                   : isPast
//                     ? "past"
//                     : isAvailable
//                       ? "available"
//                       : isLunch
//                         ? "lunch"
//                         : "occupied";

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
//                       {isPast
//                         ? "Expired"
//                         : isAvailable
//                           ? active
//                             ? "Selected"
//                             : "Available"
//                           : isLunch
//                             ? "Lunch Break"
//                             : "Occupied"}
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
//               <div className="ba-summary-meta">
//                 {"Service Duration"} : {totalDuration} {"Min"}
//               </div>
//               <div className="ba-summary-total">Total: ₹{totalAmount}</div>
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


// src/pages/dashboard/BookAppointment.jsx - UIPDAETD CODE
//
// Flow: select services -> select date (date-strip picker) -> find
// eligible employees -> pick ONE employee -> fetch that employee's
// slots -> pick a slot -> confirm.
//
// npm install lucide-react   (icons used below)

import {
  CalendarCheck,
  Check,
  Clock,
  Scissors,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
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
  const [totalDuration, setTotalDuration] = useState(null);
  // backend-computed price for the selected services + employee, set once
  // getAvailableSlots responds — this is the source of truth over any
  // client-side sum, since the server can apply discounts/rounding rules
  const [backendCost, setBackendCost] = useState(null);
  // Step 6
  const [selectedSlot, setSelectedSlot] = useState(null);
  // Step 7
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");

  const selectedEmployee = employees?.find((e) => e._id === selectedEmployeeId);

  // fallback only — used if the backend response doesn't include totalPrice
  const clientComputedTotal = (shop.services || [])
    .filter((s) => selectedServiceIds.includes(s._id))
    .reduce((sum, s) => sum + Number(s.price || 0), 0);

  const totalAmount = backendCost ?? clientComputedTotal;

  // next 21 days, for the date-strip picker below
  // const dateList = useMemo(() => {
  //   const list = [];
  //   const today = new Date();
  //   for (let i = 0; i < 21; i++) {
  //     const d = new Date(today);
  //     d.setDate(today.getDate() + i);
  //     list.push({
  //       iso: d.toISOString().slice(0, 10),
  //       day: d.getDate(),
  //       weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
  //       month: d.toLocaleDateString("en-US", { month: "long" }),
  //     });
  //   }
  //   return list;
  // }, []);

  const dateList = useMemo(() => {
    const list = [];
    const today = new Date();

    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");

      list.push({
        iso: `${yyyy}-${mm}-${dd}`,
        day: dd,
        weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
        month: d.toLocaleDateString("en-US", { month: "long" }),
      });
    }

    return list;
  }, []);

  // shows the month of whichever date is currently selected,
  // falling back to the first visible date's month
  const currentMonthLabel =
    dateList.find((d) => d.iso === date)?.month || dateList[0]?.month;

  const resetDownstream = () => {
    setEmployees(null);
    setSelectedEmployeeId("");
    setAvailableSlots(null);
    setSelectedSlot(null);
    setTotalDuration(null);
    setBackendCost(null);
    setError("");
  };

  const toggleService = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
    resetDownstream();
  };

  const handleDateChange = (value) => {
    setDate(value);
    resetDownstream();
  };

  const handleFindEmployees = async () => {
    setLoadingEmployees(true);
    resetDownstream();
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
    setTotalDuration(null);
    setBackendCost(null);
    setError("");
    setLoadingSlots(true);
    try {
      const res = await getAvailableSlots(shop._id, date, selectedServiceIds, employeeId);
      setAvailableSlots(res.data.slots || res.data);
      setTotalDuration(res.data.totalDuration);
      // backend may or may not send totalPrice — clientComputedTotal covers it if absent
      setBackendCost(res.data.totalPrice ?? null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load available slots.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSelectSlot = (slot) => {
    if (slot.status !== "available" || slot.isPast) return;
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
          {/* <Scissors size={26} /> */}

          <div className="profile-shop-avatar">

            <img
              src={shop.photo?.url || shop.photo}
              className="profile-shop-avatar-img"
            />
          </div>
        </div>
        <div style={{ marginLeft: 10 }}>
          <h1>{shop.shopname}</h1>
          <p> Select your services and preferred time</p>
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

      {/* ---------- Step 2: date (date-strip picker) ---------- */}
      <div className="ba-step-block">
        <div className="ba-step-label">
          <span className="ba-step-number">2</span>
          <h3>Select Date</h3>
        </div>
        <div className="ba-date-month">{currentMonthLabel}</div>
        <div className="ba-date-strip">
          {dateList.map((d) => {
            const active = d.iso === date;
            return (
              <div key={d.iso} className="ba-date-pill" onClick={() => handleDateChange(d.iso)}>
                <span className={`ba-date-circle ${active ? "selected" : ""}`}>{d.day}</span>
                <span className="ba-date-weekday">{d.weekday}</span>
              </div>
            );
          })}
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
            <p className="empty-state" style={{ color: "black" }}>No employee can perform all selected services.</p>
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
                const isPast = slot.isPast;
                const isAvailable = slot.status === "available" && !isPast;
                const isLunch = slot.status === "lunch_break";
                const active =
                  selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;

                const stateClass = active
                  ? "selected"
                  : isPast
                    ? "past"
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
                      {isPast
                        ? "Expired"
                        : isAvailable
                          ? active
                            ? "Selected"
                            : "Available"
                          : isLunch
                            ? "Lunch Break"
                            : "Occupied"}
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
              <div className="ba-summary-meta">Service Duration : {totalDuration} Min</div>
              <div className="ba-summary-total">Total: ₹{totalAmount}</div>
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