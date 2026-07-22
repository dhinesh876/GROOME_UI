// src/pages/dashboard/ShopOwnerDashboard.jsx
import { useCallback, useEffect, useState } from "react";
import { getMyShop, getShopAppointments, setupShop } from "../../api/shopApi";
import ManageShop from "../Dashborad/ManageShop";
import Profile from "../Dashborad/Profile";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const emptyService = { servicename: "", price: "", duration: "" };
const emptyEmployee = { name: "", gender: "male" };

export default function ShopOwnerDashboard({ tab, setTab }) {
  const [shop, setShop] = useState(null);       // null while checking, {} object once found
  const [hasShop, setHasShop] = useState(null); // null = checking, false = not registered, true = registered
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // registration form state — matches the backend's req.body exactly:
  // { shopname, address, genderCategory, ownername, openingTime,
  //   closingTime, workingDays, services, employees }
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    shopname: "",
    ownername: "",
    address: "",
    genderCategory: "unisex",
    openingTime: "",
    closingTime: "",
    workingDays: [],
    services: [{ ...emptyService }],
    employees: [{ ...emptyEmployee }],
  });
  const [saving, setSaving] = useState(false);


  // const loadAppointments = async () => {
  //   try {
  //     const res = await getShopAppointments();
  //     setAppointments(res.data.appointments || res.data);
  //   } catch {
  //     // non-fatal — shop profile still shows even if appointments fail to load
  //   }
  // };

  // ---- basic field changes (shopname, ownername, address, times, category) ----


  // Load appointments first
  const loadAppointments = useCallback(async () => {
    try {
      const res = await getShopAppointments();
      setAppointments(res.data.appointments || res.data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    }
  }, []);

  // Then check shop
  const checkShop = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getMyShop();

      setShop(res.data.shop || res.data);
      setHasShop(true);

      await loadAppointments();
    } catch (err) {
      if (err.response?.status === 404) {
        setHasShop(false);
      } else {
        setError(
          err.response?.data?.message || "Could not check shop status."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [loadAppointments]);

  useEffect(() => {
    (async () => {
      await checkShop();
    })();
  }, [checkShop]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // const checkShop = async () => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const res = await getMyShop();
  //     setShop(res.data.shop || res.data);
  //     setHasShop(true);
  //     loadAppointments();
  //   } catch (err) {
  //     if (err.response?.status === 404) {
  //       setHasShop(false); // first-time owner, no shop registered yet
  //     } else {
  //       setError(err.response?.data?.message || "Could not check shop status.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // call async loader inside effect to avoid setting state synchronously in the
  //   // effect body which can cause cascading renders
  //   (async () => {
  //     await checkShop();
  //   })();
  // }, []);

  // ---- workingDays: toggle a day in/out of the array ----


  const toggleDay = (day) => {
    setForm((prev) => {
      const already = prev.workingDays.includes(day);
      return {
        ...prev,
        workingDays: already
          ? prev.workingDays.filter((d) => d !== day)
          : [...prev.workingDays, day],
      };
    });
  };

  // ---- services: dynamic rows ----
  const handleServiceChange = (index, field, value) => {
    const updated = [...form.services];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, services: updated });
  };
  const addServiceRow = () => {
    setForm({ ...form, services: [...form.services, { ...emptyService }] });
  };
  const removeServiceRow = (index) => {
    setForm({ ...form, services: form.services.filter((_, i) => i !== index) });
  };

  // ---- employees: dynamic rows ----
  const handleEmployeeChange = (index, field, value) => {
    const updated = [...form.employees];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, employees: updated });
  };
  const addEmployeeRow = () => {
    setForm({ ...form, employees: [...form.employees, { ...emptyEmployee }] });
  };
  const removeEmployeeRow = (index) => {
    setForm({ ...form, employees: form.employees.filter((_, i) => i !== index) });
  };

  const handleRegisterShop = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // strip out any fully-empty service/employee rows before sending
      const payload = {
        ...form,
        services: form.services.filter((s) => s.servicename.trim() !== ""),
        employees: form.employees.filter((emp) => emp.name.trim() !== ""),
      };
      await setupShop(payload);
      setShowForm(false);
      checkShop(); // reload — will now find the shop and switch views
    } catch (err) {
      setError(err.response?.data?.message || "Could not register shop.");
    } finally {
      setSaving(false);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;

  if (loading) {
    return (
      <div className="dash-content">
        <p className="empty-state">Checking your shop status...</p>
      </div>
    );
  }

  // ---------- First-time owner: no shop registered yet ----------
  if (hasShop === false) {
    return (
      <div className="dash-content">
        {!showForm ? (
          <div className="register-cta">
            <h3>Register your shop</h3>
            <p>You haven't set up a shop yet. Add your details to start accepting bookings.</p>
            {error && <p className="auth-error">{error}</p>}
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              Register shop
            </button>
          </div>
        ) : (
          <form className="dash-form" onSubmit={handleRegisterShop} style={{ maxWidth: 560 }}>
            <h1 className="dash-heading">Shop details</h1>

            <div className="dash-field">
              <label>Shop name</label>
              <input name="shopname" value={form.shopname} onChange={handleFormChange} required />
            </div>

            <div className="dash-field">
              <label>Owner name</label>
              <input name="ownername" value={form.ownername} onChange={handleFormChange} required />
            </div>

            <div className="dash-field">
              <label>Address</label>
              <input name="address" value={form.address} onChange={handleFormChange} required />
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <div className="dash-field" style={{ flex: 1 }}>
                <label>Opening time</label>
                <input name="openingTime" type="time" value={form.openingTime} onChange={handleFormChange} required />
              </div>
              <div className="dash-field" style={{ flex: 1 }}>
                <label>Closing time</label>
                <input name="closingTime" type="time" value={form.closingTime} onChange={handleFormChange} required />
              </div>
            </div>

            <div className="dash-field">
              <label>Category</label>
              <select name="genderCategory" value={form.genderCategory} onChange={handleFormChange}>
                <option value="unisex">Unisex</option>
                <option value="male">Male only</option>
                <option value="female">Female only</option>
              </select>
            </div>

            <div className="dash-field">
              <label>Working days</label>
              <div className="pill-row">
                {DAYS.map((day) => {
                  const active = form.workingDays.includes(day);
                  return (
                    <span
                      key={day}
                      className="pill"
                      onClick={() => toggleDay(day)}
                      style={{
                        cursor: "pointer",
                        background: active ? "var(--burgundy)" : "var(--ivory)",
                        color: active ? "#fff" : "var(--ink)",
                        borderColor: active ? "var(--burgundy)" : "var(--line)",
                      }}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="dash-field">
              <label>Services</label>
              {form.services.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <input
                    placeholder="Service name"
                    value={s.servicename}
                    onChange={(e) => handleServiceChange(i, "servicename", e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <input
                    placeholder="Price"
                    type="number"
                    value={s.price}
                    onChange={(e) => handleServiceChange(i, "price", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    placeholder="Duration (min)"
                    type="number"
                    value={s.duration}
                    onChange={(e) => handleServiceChange(i, "duration", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {form.services.length > 1 && (
                    <button type="button" className="dash-logout-btn" onClick={() => removeServiceRow(i)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="dash-logout-btn" onClick={addServiceRow}>
                + Add service
              </button>
            </div>

            <div className="dash-field">
              <label>Employees</label>
              {form.employees.map((emp, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <input
                    placeholder="Employee name"
                    value={emp.name}
                    onChange={(e) => handleEmployeeChange(i, "name", e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <select
                    value={emp.gender}
                    onChange={(e) => handleEmployeeChange(i, "gender", e.target.value)}
                    style={{ flex: 1 }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {form.employees.length > 1 && (
                    <button type="button" className="dash-logout-btn" onClick={() => removeEmployeeRow(i)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="dash-logout-btn" onClick={addEmployeeRow}>
                + Add employee
              </button>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="btn-primary" type="submit" disabled={saving} style={{ marginTop: 8 }}>
              {saving ? "Saving..." : "Save & continue"}
            </button>
          </form>
        )}
      </div>
    );
  }

  // ---------- Returning owner: shop already registered ----------
  return (
    <>
      <div className="dash-tabs">
        <button className={`dash-tab ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}>
          Overview
        </button>
        <button className={`dash-tab ${tab === "appointments" ? "active" : ""}`} onClick={() => setTab("appointments")}>
          Appointments
        </button>
        <button className={`dash-tab ${tab === "manage" ? "active" : ""}`} onClick={() => setTab("manage")}>
          Manage
        </button>
        <button className={`dash-tab ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>
          Profile
        </button>
      </div>

      <div className="dash-content">
        {tab === "profile" && <Profile />}

        {tab === "manage" && shop && <ManageShop shop={shop} onChanged={checkShop} />}

        {tab === "home" && shop && (
          <>
            <h1 className="dash-heading">{shop.shopname}</h1>
            <p className="dash-subheading">{shop.address}</p>

            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-value">{pendingCount}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{confirmedCount}</div>
                <div className="stat-label">Confirmed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{completedCount}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{shop.adminapproval}</div>
                <div className="stat-label">Approval status</div>
              </div>
            </div>

            <div className="pill-row" style={{ marginBottom: 16 }}>
              <span className="pill">{shop.genderCategory}</span>
              <span className="pill">{shop.openingTime}–{shop.closingTime}</span>
              {(shop.workingDays || []).map((d) => (
                <span className="pill" key={d}>{d}</span>
              ))}
            </div>

            {shop.services?.length > 0 && (
              <>
                <h3 style={{ marginBottom: 8 }}>Services</h3>
                <div className="pill-row" style={{ marginBottom: 16 }}>
                  {shop.services.map((s) => (
                    <span className="pill" key={s._id}>{s.servicename} · ₹{s.price}</span>
                  ))}
                </div>
              </>
            )}

            {shop.employees?.length > 0 && (
              <>
                <h3 style={{ marginBottom: 8 }}>Employees</h3>
                <div className="pill-row">
                  {shop.employees.map((e) => (
                    <span className="pill" key={e._id}>{e.name}</span>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {tab === "appointments" && (
          <>
            <h1 className="dash-heading">Appointments</h1>
            {appointments.length === 0 ? (
              <p className="empty-state">No appointments yet.</p>
            ) : (
              <table className="appt-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Services</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a._id}>
                      <td>{a.customerId?.name || a.customerId}</td>
                      <td>{(a.services || []).map((s) => s.servicename).join(", ")}</td>
                      <td>{a.starttime} – {a.endTime}</td>
                      <td><span className={`status-badge status-${a.status}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </>
  );
}
