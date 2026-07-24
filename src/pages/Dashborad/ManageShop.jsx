// src/pages/dashboard/ManageShop.jsx
//
// Lets a shop owner add new services/employees after the shop already
// exists — separate from the one-time setupShop() registration form.

// import { useState } from "react";
// import { addEmployee, addService, deleteEmployee, deleteService } from "../../api/shopApi";

// export default function ManageShop({ shop, onChanged }) {
//   const [serviceForm, setServiceForm] = useState({ servicename: "", price: "", duration: "" });
//   const [employeeForm, setEmployeeForm] = useState({ name: "", gender: "male" });
//   const [savingService, setSavingService] = useState(false);
//   const [savingEmployee, setSavingEmployee] = useState(false);
//   const [error, setError] = useState("");


//   const handleAddService = async (e) => {
//     e.preventDefault();
//     if (!serviceForm.servicename.trim()) return;
//     setSavingService(true);
//     setError("");
//     try {
//       const { servicename, price, duration } = serviceForm;

//       if (
//         servicename.trim() &&
//         price.trim() &&
//         duration.trim()
//       ) {
//         await addService(serviceForm, shop._id);
//       } else {
//         alert("Please fill all fields");
//       }
//       setServiceForm({ servicename: "", price: "", duration: "" });
//       onChanged?.(); // reload shop so the new service shows up
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not add service.");
//     } finally {
//       setSavingService(false);
//     }
//   };

//   const handleDeleteService = async (serviceId) => {
//     try {
//       await deleteService(shop._id, serviceId);
//       onChanged?.();
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not remove service.");
//     }
//   };

//   const handleAddEmployee = async (e) => {
//     e.preventDefault();
//     if (!employeeForm.name.trim()) return;
//     setSavingEmployee(true);
//     setError("");
//     try {
//       await addEmployee(employeeForm);
//       setEmployeeForm({ name: "", gender: "male" });
//       onChanged?.();
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not add employee.");
//     } finally {
//       setSavingEmployee(false);
//     }
//   };

//   const handleDeleteEmployee = async (employeeId) => {
//     try {
//       await deleteEmployee(employeeId);
//       onChanged?.();
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not remove employee.");
//     }
//   };

//   return (
//     <>
//       <h1 className="dash-heading">Manage shop</h1>
//       <p className="dash-subheading">Add or remove services and employees.</p>

//       {error && <p className="auth-error">{error}</p>}

//       <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
//         {/* ---------- Services ---------- */}
//         <div style={{ flex: "1 1 320px" }}>
//           <h3 style={{ marginBottom: 10 }}>Services</h3>

//           <div className="pill-row" style={{ marginBottom: 14 }}>
//             {(shop.services || []).length === 0 && (
//               <span style={{ fontSize: 13, color: "var(--muted)" }}>No services yet.</span>
//             )}
//             {(shop.services || []).map((s) => (
//               <span className="pill" key={s._id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 {s.servicename} · ₹{s.price}
//                 <button
//                   onClick={() => handleDeleteService(s._id)}
//                   style={{ border: "none", background: "none", cursor: "pointer", color: "var(--muted)", padding: 0, fontSize: 13 }}
//                   aria-label={`Remove ${s.servicename}`}
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>

//           <form onSubmit={handleAddService} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//             <input
//               type="text"
//               placeholder="Service name"
//               value={serviceForm.servicename}
//               onChange={(e) => setServiceForm({ ...serviceForm, servicename: e.target.value })}
//               style={{ flex: "1 1 140px" }}
//             />
//             <input
//               placeholder="Price"
//               type="number"
//               min={1}
//               value={serviceForm.price}
//               onKeyDown={(e) => {
//                 if (e.key === "-" || e.key === "e" || e.key === "+") {
//                   e.preventDefault();
//                 }
//               }}
//               onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
//               style={{ width: 90 }}
//             />
//             <input
//               placeholder="Duration (min)"
//               type="number"
//               value={serviceForm.duration}
//               onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
//               style={{ width: 120 }}
//             />
//             <button className="btn-primary" type="submit" disabled={savingService}>
//               {savingService ? "Adding..." : "Add"}
//             </button>
//           </form>
//         </div>

//         {/* ---------- Employees ---------- */}
//         <div style={{ flex: "1 1 320px" }}>
//           <h3 style={{ marginBottom: 10 }}>Employees</h3>

//           <div className="pill-row" style={{ marginBottom: 14 }}>
//             {(shop.employees || []).length === 0 && (
//               <span style={{ fontSize: 13, color: "var(--muted)" }}>No employees yet.</span>
//             )}
//             {(shop.employees || []).map((emp) => (
//               <span className="pill" key={emp._id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 {emp.name}
//                 <button
//                   onClick={() => handleDeleteEmployee(emp._id)}
//                   style={{ border: "none", background: "none", cursor: "pointer", color: "var(--muted)", padding: 0, fontSize: 13 }}
//                   aria-label={`Remove ${emp.name}`}
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>

//           <form onSubmit={handleAddEmployee} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//             <input
//               placeholder="Employee name"
//               value={employeeForm.name}
//               onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
//               style={{ flex: "1 1 140px" }}
//             />
//             <select
//               value={employeeForm.gender}
//               onChange={(e) => setEmployeeForm({ ...employeeForm, gender: e.target.value })}
//               style={{ width: 110 }}
//             >
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//             <button className="btn-primary" type="submit" disabled={savingEmployee}>
//               {savingEmployee ? "Adding..." : "Add"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// =========================
// PART 1 START
// =========================

import { useState } from "react";
import {
  FaClock,
  FaCut,
  FaPlus,
  FaRupeeSign,
  FaTrash,
  FaUserTie,
} from "react-icons/fa";

import {
  addEmployee,
  addService,
  deleteEmployee,
  deleteService, updateEmployee
} from "../../api/shopApi";

import "../../styles/ManageShop.css";

export default function ManageShop({ shop, onChanged }) {

  /* ---------------- SERVICES ---------------- */

  const [serviceForm, setServiceForm] = useState({
    servicename: "",
    price: "",
    duration: "",
  });

  /* ---------------- EMPLOYEE ---------------- */

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    gender: "male",
    employeeServices: [],
  });

  const [savingService, setSavingService] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- TOGGLE SERVICE ---------------- */

  const toggleEmployeeService = (serviceName) => {
    setEmployeeForm((prev) => ({
      ...prev,
      employeeServices: prev.employeeServices.includes(serviceName)
        ? prev.employeeServices.filter(
          (s) => s !== serviceName
        )
        : [...prev.employeeServices, serviceName],
    }));
  };

  /* ---------------- ADD SERVICE ---------------- */
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!serviceForm.servicename.trim()) return;
    setSavingService(true);
    setError("");
    try {
      const { servicename, price, duration } = serviceForm;

      if (
        servicename.trim() &&
        price.trim() &&
        duration.trim()
      ) {
        await addService(serviceForm, shop._id);
      } else {
        alert("Please fill all fields");
      }
      setServiceForm({ servicename: "", price: "", duration: "" });
      onChanged?.(); // reload shop so the new service shows up
    } catch (err) {
      setError(err.response?.data?.message || "Could not add service.");
    } finally {
      setSavingService(false);
    }
  };

  /* ---------------- DELETE SERVICE ---------------- */

  const handleDeleteService = async (serviceId) => {
    try {

      await deleteService(
        shop._id,
        serviceId
      );

      onChanged();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not remove service."
      );
    }
  };

  /* ---------------- ADD EMPLOYEE ---------------- */

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (!employeeForm.name.trim()) {
      alert("Enter employee name");
      return;
    }

    if (
      employeeForm.employeeServices.length === 0
    ) {
      alert(
        "Please assign at least one service."
      );
      return;
    }

    try {

      setSavingEmployee(true);

      await addEmployee(
        shop._id,
        {
          addemployee: [employeeForm],
        }
      );

      setEmployeeForm({
        name: "",
        gender: "male",
        employeeServices: [],
      });

      onChanged();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Could not add employee."
      );

    } finally {
      setSavingEmployee(false);
    }
  };


  const handleToggleEmployeeService = async (employeeId, serviceId) => {
    const employee = (shop.employees || []).find((e) => e._id === employeeId);
    if (!employee) return;

    // employee.employeeServices holds populated {_id, servicename} objects — reduce to just ids
    const currentIds = (employee.employeeServices || []).map((s) => s._id);

    const updatedIds = currentIds.includes(serviceId)
      ? currentIds.filter((id) => id !== serviceId)   // uncheck → remove only this one
      : [...currentIds, serviceId];                    // check → add, keeping everything else

    try {
      await updateEmployee(shop._id, employeeId, { employeeServices: updatedIds });
      onChanged?.(); // reload shop from the server so the UI reflects the real saved state
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update employee services.");
    }
  };

  /* ---------------- DELETE EMPLOYEE ---------------- */

  const handleDeleteEmployee = async (employeeId) => {

    try {

      await deleteEmployee(shop._id, employeeId);

      onChanged();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Could not delete employee."
      );

    }
  };

  // =========================
  // PART 1 END
  // =========================
  // =========================
  // PART 2A START
  // =========================

  return (
    <>
      <h1 className="dash-heading">Manage Shop</h1>

      <p className="dash-subheading">
        Add or remove services and employees.
      </p>

      {error && (
        <p className="auth-error">
          {error}
        </p>
      )}

      <div className="manage-shop-container">

        {/* ================= SERVICES ================= */}

        <div className="manage-card">

          <div className="manage-card-header">

            <h2>
              <FaCut />
              Services
            </h2>

          </div>

          <div className="manage-list">

            {(shop.services || []).length === 0 && (

              <div className="empty-text">

                No Services Found

              </div>

            )}

            {(shop.services || []).map((service) => (

              <div
                className="service-row"
                key={service._id}
              >

                <div className="service-left">

                  <div className="service-icon">

                    <FaCut />

                  </div>

                  <div>

                    <h4>

                      {service.servicename}

                    </h4>

                    <small>

                      <FaRupeeSign />

                      {service.price}

                      &nbsp; | &nbsp;

                      <FaClock />

                      {" "}

                      {service.duration} mins

                    </small>

                  </div>

                </div>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeleteService(service._id)
                  }
                >

                  <FaTrash />

                </button>

              </div>

            ))}

          </div>

          <div className="divider"></div>

          <h3>

            <FaPlus />

            Add Service

          </h3>

          <form
            className="manage-form"
            onSubmit={handleAddService}
          >

            <input
              placeholder="Service Name"
              value={serviceForm.servicename}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  servicename: e.target.value,
                })
              }
            />

            <input
              placeholder="Price"
              type="number"
              min={1}
              value={serviceForm.price}
              onKeyDown={(e) => {
                if (
                  e.key === "-" ||
                  e.key === "+" ||
                  e.key === "e"
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  price: e.target.value,
                })
              }
            />

            <input
              placeholder="Duration (mins)"
              type="number"
              min={1}
              value={serviceForm.duration}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  duration: e.target.value,
                })
              }
            />

            <button
              className="btn-primary"
              type="submit"
              disabled={savingService}
            >

              {savingService
                ? "Adding..."
                : "Add Service"}

            </button>

          </form>

        </div>

        {/* ================= EMPLOYEE SECTION STARTS IN PART 2B ================= */}

        <div className="manage-card">

          <div className="manage-card-header">

            <h2>
              <FaUserTie />
              Employees
            </h2>

          </div>

          <div className="manage-list">

            {(shop.employees || []).length === 0 && (
              <div className="empty-text">
                No Employees Found
              </div>
            )}

            {/* {(shop.employees || []).map((emp) => (

              <div
                key={emp._id}
                className="employee-row"
              >

                <div className="employee-top">

                  <div className="employee-avatar">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="employee-info">

                    <h4>{emp.name}</h4>

                    <small>
                      {emp.gender}
                    </small>

                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteEmployee(emp._id)
                    }
                  >
                    <FaTrash />
                  </button>

                </div>

                

                <div className="employee-services">

                  {(emp.employeeServices || []).map(
                    (service) => (

                      <span
                        key={service._id}
                        className="service-pill"
                      >
                        {service.servicename}
                      </span>

                    )
                  )}

                </div>

              </div>

            ))} */}

            {(shop.employees || []).map((emp) => (

              <div
                key={emp._id}
                className="employee-row"
              >

                <div className="employee-top">

                  <div className="employee-avatar">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="employee-info">

                    <h4>{emp.name}</h4>

                    <small>{emp.gender}</small>

                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteEmployee(emp._id)}
                  >
                    <FaTrash />
                  </button>

                </div>

                {/* Assigned Services */}

                <div className="employee-services">

                  {(emp.employeeServices || []).map((service) => (

                    <span
                      key={service._id}
                      className="service-pill"
                    >
                      {service.servicename}
                    </span>

                  ))}

                </div>

                {/* Add / Remove Services */}

                <div style={{ marginTop: "18px", color: "black" }}>

                  <h5 style={{ marginBottom: "10px" }}>
                    Assign Services
                  </h5>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                      gap: "10px",
                    }}
                  >
                    {(shop.services || []).map((service) => (

                      <label
                        key={service._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          cursor: "pointer",
                        }}
                      >

                        <input
                          type="checkbox"
                          checked={emp.employeeServices?.some((s) => s._id === service._id) || false}
                          onChange={() => handleToggleEmployeeService(emp._id, service._id)}
                        />

                        {service.servicename}

                      </label>

                    ))}
                  </div>

                </div>

              </div>

            ))}

          </div>

          <div className="divider"></div>

          <h3>

            <FaPlus />

            Add Employee

          </h3>

          <form
            className="manage-form"
            onSubmit={handleAddEmployee}
          >

            <input
              placeholder="Employee Name"
              value={employeeForm.name}
              onChange={(e) =>
                setEmployeeForm({
                  ...employeeForm,
                  name: e.target.value,
                })
              }
            />

            <select
              value={employeeForm.gender}
              onChange={(e) =>
                setEmployeeForm({
                  ...employeeForm,
                  gender: e.target.value,
                })
              }
            >

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

              <option value="other">
                Other
              </option>

            </select>

            <label className="checkbox-title" style={{ color: "black" }}>
              Assign Services
            </label>

            <div className="checkbox-grid" style={{ color: "black" }}>

              {(shop.services || []).map((service) => (

                <label
                  key={service._id}
                  className="checkbox-card"
                >

                  <input
                    type="checkbox"
                    // checked={employeeForm.employeeServices.includes(
                    //   service.servicename
                    // )}
                    // onChange={() =>
                    //   toggleEmployeeService(service.servicename)
                    // }
                    checked={employeeForm.employeeServices.includes(service._id)}
                    onChange={() => toggleEmployeeService(service._id)}
                  />

                  <span>
                    {service.servicename}
                  </span>

                </label>

              ))}

            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={savingEmployee}
            >

              {savingEmployee
                ? "Adding..."
                : "Add Employee"}

            </button>

          </form>

        </div>

      </div>

    </>
  );
}