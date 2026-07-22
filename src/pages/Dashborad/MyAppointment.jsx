import { useEffect, useState } from "react";
import {
  cancelAppointment,
  getMyAppointments,
} from "../../api/appointmentApi";
import "../../styles/MyAppointment.css";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getMyAppointments();

      setAppointments(
        res.data.appointments || res.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      const res = await cancelAppointment(id);
      alert(res.data.message);

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.appointmentId === id
            ? { ...appointment, status: "Cancelled" }
            : appointment
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.data ||
        err.response?.data?.message ||
        "Unable to cancel appointment."
      );
    }
  };

  return (
    <>
      <h1 className="dash-heading">
        My Appointments
      </h1>

      <p className="dash-subheading">
        View and manage your bookings.
      </p>

      {error && (
        <p className="auth-error">{error}</p>
      )}

      {loading ? (
        <p className="empty-state">
          Loading appointments...
        </p>
      ) : appointments.length === 0 ? (
        <p className="empty-state">
          No appointments found.
        </p>
      ) : (
        <div className="appointment-grid">
          {appointments.map((item) => (
            <div
              key={item.appointmentId}
              className="appointment-card"
            >
              <div className="appointment-header">
                <h2>{item.shop?.shopname}</h2>

                {/* <span
                  className={`appointment-status ${item.status.toLowerCase()}`}
                >
                  {item.status}
                </span> */}

                <span
                  className={`appointment-status ${(item.status || "")
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {item.status || "Unknown"}
                </span>
              </div>

              <div className="appointment-info">
                <p>
                  <strong>Date:</strong> {item.date}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {item.starttime} - {item.endTime}
                </p>

                <p>
                  <strong>Employee:</strong>{" "}
                  {item.employee?.name}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {item.totalDuration} mins
                </p>

                <p>
                  <strong>Total Price:</strong> ₹
                  {item.totalPrice}
                </p>
              </div>

              <div className="appointment-services">
                {item.services.map((service) => (
                  <span
                    key={service.serviceItemId}
                    className="service-pill"
                  >
                    {service.servicename}
                  </span>
                ))}
              </div>

              {!["Cancelled", "Completed", "NoShow"].includes(item.status) && (
                <button
                  className="cancel-btn"
                  onClick={() =>
                    handleCancel(item.appointmentId)
                  }
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}