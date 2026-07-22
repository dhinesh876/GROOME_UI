// src/pages/dashboard/ManageShop.jsx
//
// Lets a shop owner add new services/employees after the shop already
// exists — separate from the one-time setupShop() registration form.

import { useState } from "react";
import { addService, deleteService, addEmployee, deleteEmployee } from "../../api/shopApi";

export default function ManageShop({ shop, onChanged }) {
  const [serviceForm, setServiceForm] = useState({ servicename: "", price: "", duration: "" });
  const [employeeForm, setEmployeeForm] = useState({ name: "", gender: "male" });
  const [savingService, setSavingService] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);
  const [error, setError] = useState("");

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!serviceForm.servicename.trim()) return;
    setSavingService(true);
    setError("");
    try {
      await addService(serviceForm);
      setServiceForm({ servicename: "", price: "", duration: "" });
      onChanged?.(); // reload shop so the new service shows up
    } catch (err) {
      setError(err.response?.data?.message || "Could not add service.");
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteService(serviceId);
      onChanged?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove service.");
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!employeeForm.name.trim()) return;
    setSavingEmployee(true);
    setError("");
    try {
      await addEmployee(employeeForm);
      setEmployeeForm({ name: "", gender: "male" });
      onChanged?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add employee.");
    } finally {
      setSavingEmployee(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      onChanged?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove employee.");
    }
  };

  return (
    <>
      <h1 className="dash-heading">Manage shop</h1>
      <p className="dash-subheading">Add or remove services and employees.</p>

      {error && <p className="auth-error">{error}</p>}

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* ---------- Services ---------- */}
        <div style={{ flex: "1 1 320px" }}>
          <h3 style={{ marginBottom: 10 }}>Services</h3>

          <div className="pill-row" style={{ marginBottom: 14 }}>
            {(shop.services || []).length === 0 && (
              <span style={{ fontSize: 13, color: "var(--muted)" }}>No services yet.</span>
            )}
            {(shop.services || []).map((s) => (
              <span className="pill" key={s._id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {s.servicename} · ₹{s.price}
                <button
                  onClick={() => handleDeleteService(s._id)}
                  style={{ border: "none", background: "none", cursor: "pointer", color: "var(--muted)", padding: 0, fontSize: 13 }}
                  aria-label={`Remove ${s.servicename}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddService} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              placeholder="Service name"
              value={serviceForm.servicename}
              onChange={(e) => setServiceForm({ ...serviceForm, servicename: e.target.value })}
              style={{ flex: "1 1 140px" }}
            />
            <input
              placeholder="Price"
              type="number"
              value={serviceForm.price}
              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
              style={{ width: 90 }}
            />
            <input
              placeholder="Duration (min)"
              type="number"
              value={serviceForm.duration}
              onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
              style={{ width: 120 }}
            />
            <button className="btn-primary" type="submit" disabled={savingService}>
              {savingService ? "Adding..." : "Add"}
            </button>
          </form>
        </div>

        {/* ---------- Employees ---------- */}
        <div style={{ flex: "1 1 320px" }}>
          <h3 style={{ marginBottom: 10 }}>Employees</h3>

          <div className="pill-row" style={{ marginBottom: 14 }}>
            {(shop.employees || []).length === 0 && (
              <span style={{ fontSize: 13, color: "var(--muted)" }}>No employees yet.</span>
            )}
            {(shop.employees || []).map((emp) => (
              <span className="pill" key={emp._id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {emp.name}
                <button
                  onClick={() => handleDeleteEmployee(emp._id)}
                  style={{ border: "none", background: "none", cursor: "pointer", color: "var(--muted)", padding: 0, fontSize: 13 }}
                  aria-label={`Remove ${emp.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddEmployee} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              placeholder="Employee name"
              value={employeeForm.name}
              onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
              style={{ flex: "1 1 140px" }}
            />
            <select
              value={employeeForm.gender}
              onChange={(e) => setEmployeeForm({ ...employeeForm, gender: e.target.value })}
              style={{ width: 110 }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <button className="btn-primary" type="submit" disabled={savingEmployee}>
              {savingEmployee ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
