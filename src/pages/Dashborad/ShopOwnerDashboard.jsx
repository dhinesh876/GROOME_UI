// // src/pages/dashboard/ShopOwnerDashboard.jsx

import { Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  getMyShop,
  getShopAppointments,
  setupShop, updateAppointmentStatus
} from "../../api/shopApi";

import "../../styles/ShopOwnerDashboard.css";
import ManageShop from "../Dashborad/ManageShop";
import Profile from "../Dashborad/Profile";

const DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const emptyService = {
  servicename: "",
  price: "",
  duration: "",
};

const emptyEmployee = {
  name: "",
  gender: "male",
  employeeServices: [],
};

export default function ShopOwnerDashboard({
  tab,
  setTab,
}) {
  // -------------------------------
  // Dashboard
  // -------------------------------
  const [shop, setShop] = useState(null);
  const [hasShop, setHasShop] = useState(null);

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // -------------------------------
  // Register Shop
  // -------------------------------

  const [showForm, setShowForm] =
    useState(false);

  const [shopImage, setShopImage] =
    useState(null);

  const [previewImage, setPreviewImage] =
    useState("");

  const [form, setForm] = useState({
    shopname: "",
    ownername: "",
    address: "",

    genderCategory: "unisex",

    openingTime: "",
    closingTime: "",

    workingDays: [],

    services: [
      {
        ...emptyService,
      },
    ],

    employees: [
      {
        ...emptyEmployee,
      },
    ],
  });

  // -------------------------------
  // Appointment Counts
  // -------------------------------

  const pendingCount =
    appointments.filter(
      (x) => x.status === "Pending"
    ).length;

  const confirmedCount =
    appointments.filter(
      (x) => x.status === "Confirmed"
    ).length;

  const completedCount =
    appointments.filter(
      (x) => x.status === "Completed"
    ).length;

  const cancelledCount =
    appointments.filter(
      (x) => x.status === "Cancelled"
    ).length;

  const noShowCount =
    appointments.filter(
      (x) => x.status === "NoShow"
    ).length;


  // ===========================
  // Load Appointments
  // ===========================

  const loadAppointments = useCallback(async (shopId) => {
    try {
      if (!shopId) return;

      const res = await getShopAppointments(shopId);

      setAppointments(res.data.appointments || res.data || []);
      console.log(res.data.appointments);

    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message ===
        "No booking on your shop"
      ) {
        setAppointments([]);
      } else {
        setError(
          err.response?.data?.message ||
          "Could not check shop status."
        );
      }
    }
  }, []);

  // ===========================
  // Check Shop
  // ===========================

  const checkShop = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyShop();

      const shopData = res.data.shop || res.data;

      setShop(shopData);
      setHasShop(true);

      if (shopData.adminapproval === "Approved") {
        await loadAppointments(shopData._id);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message ===
        "User Not Exists, Create New user Register"
      ) {
        setHasShop(false);
      } else {
        setError(
          err.response?.data?.message ||
          "Could not check shop status."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [loadAppointments]);



  useEffect(() => {
    checkShop();
  }, [checkShop]);


  // ===========================
  // Image Upload
  // ===========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setShopImage(file);

    setPreviewImage(
      URL.createObjectURL(file)
    );
  };

  // ===========================
  // Shop Fields
  // ===========================

  const handleFormChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===========================
  // Working Days
  // ===========================

  const toggleDay = (day) => {
    setForm((prev) => {
      const exists =
        prev.workingDays.includes(day);

      return {
        ...prev,
        workingDays: exists
          ? prev.workingDays.filter(
            (d) => d !== day
          )
          : [...prev.workingDays, day],
      };
    });
  };

  // ===========================
  // Services
  // ===========================

  const handleServiceChange = (
    index,
    field,
    value
  ) => {
    const services = [...form.services];

    services[index][field] = value;

    setForm({
      ...form,
      services,
    });
  };

  const addService = () => {
    setForm((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          ...emptyService,
        },
      ],
    }));
  };

  const removeService = (index) => {
    setForm({
      ...form,
      services: form.services.filter(
        (_, i) => i !== index
      ),
    });
  };

  // ===========================
  // Employees
  // ===========================

  const handleEmployeeChange = (
    index,
    field,
    value
  ) => {
    const employees = [...form.employees];

    employees[index][field] = value;

    setForm({
      ...form,
      employees,
    });
  };

  const addEmployee = () => {
    setForm({
      ...form,
      employees: [
        ...form.employees,
        {
          ...emptyEmployee,
        },
      ],
    });
  };

  const removeEmployee = (index) => {
    setForm({
      ...form,
      employees: form.employees.filter(
        (_, i) => i !== index
      ),
    });
  };// ===================================
  // Register Shop
  // ===================================

  const handleRegisterShop = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const payload = new FormData();

      payload.append("shopname", form.shopname);
      payload.append("ownername", form.ownername);
      payload.append("address", form.address);
      payload.append(
        "genderCategory",
        form.genderCategory
      );

      payload.append(
        "openingTime",
        form.openingTime
      );

      payload.append(
        "closingTime",
        form.closingTime
      );

      payload.append(
        "workingDays",
        JSON.stringify(form.workingDays)
      );

      payload.append(
        "services",
        JSON.stringify(
          form.services.filter(
            (x) => x.servicename.trim() !== ""
          )
        )
      );

      payload.append(
        "employees",
        JSON.stringify(
          form.employees.filter(
            (x) => x.name.trim() !== ""
          )
        )
      );

      if (shopImage) {
        payload.append("photo", shopImage);
      }

      await setupShop(payload);

      setShowForm(false);

      checkShop();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to register shop."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================
  // Loading
  // ===================================

  if (loading) {
    return (
      <div className="dash-content">
        <h2>Loading...</h2>
      </div>
    );
  }

  // ===================================
  // No Shop Found
  // ===================================

  if (hasShop === false) {
    return (
      <div className="dash-content">

        {!showForm ? (
          <div className="register-card">

            <h1>
              Register Your Salon
            </h1>

            <p>
              Create your salon profile to
              start accepting bookings.
            </p>

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            <button
              className="btn-primary"
              onClick={() =>
                setShowForm(true)
              }
            >
              Register Shop
            </button>

          </div>
        ) : (<form
          className="dash-form"
          onSubmit={handleRegisterShop}
        >

          <h2 className="dash-heading">
            Register Shop
          </h2>

          {/* Shop Image */}

          <div className="dash-field">

            <label>Shop Photo</label>

            <div className="shop-image-upload">

              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="shop-preview"
                />
              ) : (
                <div className="shop-placeholder">
                  No Image
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

            </div>

          </div>

          {/* Shop Name */}

          <div className="dash-field">

            <label>Shop Name</label>

            <input
              name="shopname"
              value={form.shopname}
              onChange={handleFormChange}
              placeholder="Royal Unisex Salon"
              required
            />

          </div>

          {/* Owner */}

          <div className="dash-field">

            <label>Owner Name</label>

            <input
              name="ownername"
              value={form.ownername}
              onChange={handleFormChange}
              placeholder="Owner Name"
              required
            />

          </div>

          {/* Address */}

          <div className="dash-field">

            <label>Address</label>

            <textarea
              rows={3}
              name="address"
              value={form.address}
              onChange={handleFormChange}
              placeholder="Full Address"
              required
            />

          </div>

          {/* Category */}

          <div className="dash-field">

            <label>Category</label>

            <select
              name="genderCategory"
              value={form.genderCategory}
              onChange={handleFormChange}
            >
              <option value="unisex">
                Unisex
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

            </select>

          </div>

          {/* Timing */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 15,
            }}
          >

            <div className="dash-field">

              <label>
                Opening Time
              </label>

              <input
                type="time"
                name="openingTime"
                value={form.openingTime}
                onChange={handleFormChange}
                required
              />

            </div>

            <div className="dash-field">

              <label>
                Closing Time
              </label>

              <input
                type="time"
                name="closingTime"
                value={form.closingTime}
                onChange={handleFormChange}
                required
              />

            </div>

          </div>

          {/* Working Days */}

          <div className="dash-field">

            <label>
              Working Days
            </label>

            <div className="pill-row">

              {DAYS.map((day) => {

                const active =
                  form.workingDays.includes(day);

                return (

                  <button
                    type="button"
                    key={day}
                    className={`pill ${active ? "active" : ""
                      }`}
                    onClick={() =>
                      toggleDay(day)
                    }
                  >
                    {day}
                  </button>

                );
              })}

            </div>

          </div>{/* ===========================
    SERVICES
=========================== */}

          <div className="dash-field">

            <label>Services</label>

            {form.services.map((service, index) => (

              <div
                key={index}
                className="service-card"
              >

                <input
                  type="text"
                  placeholder="Service Name"
                  value={service.servicename}
                  onChange={(e) =>
                    handleServiceChange(
                      index,
                      "servicename",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={service.price}
                  onChange={(e) =>
                    handleServiceChange(
                      index,
                      "price",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Duration (Minutes)"
                  value={service.duration}
                  onChange={(e) =>
                    handleServiceChange(
                      index,
                      "duration",
                      e.target.value
                    )
                  }
                />

                {form.services.length > 1 && (

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removeService(index)
                    }
                  >
                    Remove
                  </button>

                )}

              </div>

            ))}

            <button
              type="button"
              className="add-btn"
              onClick={addService}
            >
              + Add Service
            </button>

          </div>{/* ===========================
    EMPLOYEES
=========================== */}

          <div className="dash-field">

            <label>Employees</label>

            {form.employees.map((employee, index) => (

              <div
                key={index}
                className="employee-card"
              >

                {/* Employee Name */}

                <input
                  type="text"
                  placeholder="Employee Name"
                  value={employee.name}
                  onChange={(e) =>
                    handleEmployeeChange(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                />

                {/* Gender */}

                <select
                  value={employee.gender}
                  onChange={(e) =>
                    handleEmployeeChange(
                      index,
                      "gender",
                      e.target.value
                    )
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

                <div className="employee-services">

                  <div className="employee-services-grid" style={{ color: "black" }}>
                    <h4>Employee Services</h4>

                    <div className="employee-service-grid">
                      <div className="pill-row">
                        {form.services
                          .filter((s) => s.servicename.trim() !== "")
                          .map((service) => {
                            const checked = employee.employeeServices.includes(service.servicename);

                            return (
                              <span
                                key={service.servicename}
                                className="pill"
                                onClick={() => {
                                  const employees = [...form.employees];

                                  if (checked) {
                                    employees[index].employeeServices = employees[
                                      index
                                    ].employeeServices.filter((x) => x !== service.servicename);
                                  } else {
                                    employees[index].employeeServices.push(service.servicename);
                                  }

                                  setForm({ ...form, employees });
                                }}
                                style={{
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  background: checked ? "var(--burgundy)" : "var(--ivory)",
                                  color: checked ? "#fff" : "var(--ink)",
                                  borderColor: checked ? "var(--burgundy)" : "var(--line)",
                                }}
                              >
                                {checked && <Check size={13} />}
                                {service.servicename}
                              </span>
                            );
                          })}
                      </div>

                    </div>

                  </div>
                </div>

                {form.employees.length >
                  1 && (

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeEmployee(index)
                      }
                    >
                      Remove Employee
                    </button>

                  )}

              </div>

            ))}

            <button
              type="button"
              className="add-btn"
              onClick={addEmployee}
            >
              + Add Employee
            </button>

          </div>{/* ===========================
    ERROR
=========================== */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* ===========================
    ACTION BUTTONS
=========================== */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                setShowForm(false)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving
                ? "Registering..."
                : "Register Shop"}
            </button>

          </div>

        </form>
        )}
      </div>
    );
  }

  /* ===============================
     SHOP REGISTERED DASHBOARD
  ================================ */
  const isApproved = shop?.adminapproval === "Approved";

  return (
    <>
      <div className="dash-tabs">

        <button
          className={`dash-tab ${tab === "home"
            ? "active"
            : ""
            }`}
          onClick={() =>
            setTab("home")
          }
        >
          Overview
        </button>

        <button
          className={`dash-tab ${tab === "appointments"
            ? "active"
            : ""
            }`}
          onClick={() =>
            setTab("appointments")
          }
        >
          Appointments
        </button>

        <button
          className={`dash-tab ${tab === "manage"
            ? "active"
            : ""
            }`}
          onClick={() =>
            setTab("manage")
          }
        >
          Manage
        </button>

        <button
          className={`dash-tab ${tab === "profile"
            ? "active"
            : ""
            }`}
          onClick={() =>
            setTab("profile")
          }
        >
          Profile
        </button>

      </div>

      <div className="dash-content">
        {tab === "home" && shop && (
          <>
            <div className="shop-hero">

              <div className="shop-left">
                <img

                  src={shop.photo}
                  alt={shop.shopname}
                  className="shop-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/600x400?text=Salon";
                  }}
                />
              </div>

              <div className="shop-right">

                <h1>{shop.shopname}</h1>

                <p className="shop-owner">
                  Owner : {shop.ownername}
                </p>

                <p className="shop-address">
                  📍 {shop.address}
                </p>

                <div className="shop-tags">

                  <span>{shop.genderCategory}</span>

                  <span>
                    🕘 {shop.openingTime} - {shop.closingTime}
                  </span>

                </div>

                <div className="working-days">
                  <span>{shop.workingDays}</span>
                </div>

                <div
                  className={`approval-banner ${isApproved
                    ? "approved"
                    : "pending"
                    }`}
                >
                  {isApproved
                    ? "✅ Shop Approved"
                    : "⏳ Waiting For Admin Approval"}
                </div>

              </div>

            </div>

            {isApproved ? (

              <>
                {/* ================= STATS ================= */}
                <div className={`stats-grid ${!isApproved ? "disabled-section" : ""
                  }`}>

                  <div className="stat-box">

                    <h2>{pendingCount}</h2>

                    <p>Pending</p>

                  </div>

                  <div className="stat-box">

                    <h2>{confirmedCount}</h2>

                    <p>Confirmed</p>

                  </div>

                  <div className="stat-box">

                    <h2>{completedCount}</h2>

                    <p>Completed</p>

                  </div>

                  <div className="stat-box">
                    <h2>{cancelledCount}</h2>
                    <p>Cancelled</p>
                  </div>

                  <div className="stat-box">
                    <h2>{noShowCount}</h2>
                    <p>No Show</p>
                  </div>

                  {/* <div className="stat-box">

                    <h2>
                      {shop.adminapproval}
                    </h2>

                    <p>Approval</p>

                  </div> */}

                </div>

                {/* ================= SERVICES ================= */}

                <div className={`dashboard-card ${!isApproved ? "disabled-section" : ""
                  }`}>

                  <div className="card-header">

                    <h2>Services</h2>

                  </div>

                  <div className="service-grid">

                    {shop.services?.map((service) => (

                      <div
                        key={service._id}
                        className="service-item"
                      >

                        <h3>
                          {service.servicename}
                        </h3>

                        <p>
                          ₹{service.price}
                        </p>

                        <small>
                          {service.duration} Minutes
                        </small>

                      </div>

                    ))}

                  </div>

                </div>

                {/* ================= EMPLOYEES ================= */}

                <div className={`dashboard-card ${!isApproved ? "disabled-section" : ""
                  }`}>

                  <div className="card-header">

                    <h2>Employees</h2>

                  </div>

                  <div className="employee-grid">

                    {shop.employees?.map((emp) => (

                      <div
                        key={emp._id}
                        className="employee-item"
                      >

                        <div className="employee-avatar">

                          {emp.name.charAt(0)}

                        </div>

                        <h3>
                          {emp.name}
                        </h3>

                        <p>
                          {emp.gender}
                        </p>
                        <div className="employee-services-list">
                          {emp.employeeServices?.map((service, index) => (
                            <span
                              key={service._id || index}
                            >
                              {typeof service === "string"
                                ? service
                                : service.servicename}
                            </span>
                          ))}
                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              </>

            ) : (

              <div className="approval-card">

                <h2>
                  Your salon registration has been submitted.
                </h2>

                <p>
                  Your shop is currently under review.
                  Once approved, customers can book
                  appointments and your dashboard will
                  become active.
                </p>

              </div>

            )}
          </>
        )}

        {tab === "appointments" && (
          <>

            <div className="appointment-header">

              <div>

                <h1>Appointments</h1>

                <p>
                  Manage all customer bookings
                </p>

              </div>

            </div>

            {appointments.length === 0 ? (

              <div className="empty-card">

                <h2>No Appointments</h2>

                <p>
                  You don't have any bookings yet.
                </p>

              </div>

            ) : (

              <div className="appointment-list">

                {appointments.map((appointment) => (

                  <div
                    className="appointment-card"
                    key={appointment.appointmentId}
                  >

                    {/* Customer */}

                    <div className="customer-section">

                      <div className="customer-info-row">
                        <i className="fa-solid fa-user"></i>
                        <span>{appointment.customer?.name}</span>
                      </div>

                      <div className="customer-info-row">
                        <i className="fa-solid fa-envelope"></i>
                        <span>{appointment.customer?.email}</span>
                      </div>

                      <div className="customer-info-row">
                        <i className="fa-solid fa-phone"></i>
                        <span>{appointment.customer?.number}</span>
                      </div>

                      <div className="customer-info-row">
                        <i className="fa-solid fa-calendar-days"></i>
                        <strong>Date</strong>
                        <span>{appointment.starttime.split(", ")[0]}</span>
                      </div>

                      <div className="customer-info-row">
                        <i className="fa-solid fa-clock"></i>
                        <strong>Time</strong>
                        <span>
                          {appointment.starttime.split(", ")[1]} - {appointment.endTime.split(", ")[1]}
                        </span>
                      </div>

                      <div className="customer-info-row">
                        <i className="fa-solid fa-scissors"></i>
                        <strong>Services</strong>

                        <div className="service-chip-list">
                          {appointment.services?.map((service, index) => (
                            <span
                              key={`${service.serviceItemId}-${index}`}
                              className="service-chip"
                            >
                              {service.servicename}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="customer-info-row">
                        <i className="fa-solid fa-user-tie"></i>
                        <strong>Employee</strong>
                        <span>{appointment.employee?.name}</span>
                      </div>

                      <div className="customer-info-row">
                        <i className="fa-solid fa-circle-info"></i>
                        <strong>Status</strong>

                        <span
                          className={`status-badge status-${appointment.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div className="customer-info-row">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                        <strong>Total</strong>
                        <span className="price-value">₹{appointment.totalPrice}</span>
                      </div>

                    </div>

                    <div className="appointment-actions">

                      {appointment.status === "Pending" && (
                        <>
                          <button
                            className="btn-action btn-confirm"
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.appointmentId,
                                "Confirmed"
                              )
                            }
                          >
                            ✓ Confirm
                          </button>

                          <button
                            className="btn-action btn-cancel"
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.appointmentId,
                                "Cancelled"
                              )
                            }
                          >
                            ✕ Cancel
                          </button>
                        </>
                      )}

                      {appointment.status === "Confirmed" && (
                        <>
                          <button
                            className="btn-action btn-complete"
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.appointmentId,
                                "Completed"
                              )
                            }
                          >
                            ✔ Complete
                          </button>

                          <button
                            className="btn-action btn-noshow"
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.appointmentId,
                                "NoShow"
                              )
                            }
                          >
                            🚫 No Show
                          </button>

                          <button
                            className="btn-action btn-cancel"
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.appointmentId,
                                "Cancelled"
                              )
                            }
                          >
                            ✕ Cancel
                          </button>
                        </>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </>
        )}

        {tab === "manage" && (
          <ManageShop
            shop={shop}
            onChanged={checkShop}
          />
        )}

        {tab === "profile" && (
          <Profile />
        )}

      </div>
    </>
  );
}