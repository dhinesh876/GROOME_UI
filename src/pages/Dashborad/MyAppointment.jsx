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
        <div className="empty-state">
          <h3>Loading appointments...</h3>
        </div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <h3>No Appointments Found</h3>
          <p>You haven't booked any appointments yet.</p>
        </div>
      ) : (
        <div className="appointment-grid" >
          {appointments.map((item) => (
            <div
              key={item.appointmentId}
              className="appointment-card"
            >
              {/* Header */}
              <div className="appointment-header">
                <div>
                  <h2>{item.shop?.shopname}</h2>

                  <p className="booking-id">
                    Booking ID : #{item.appointmentId.slice(-6).toUpperCase()}
                  </p>
                </div>

                <span
                  className={`appointment-status ${(item.status || "")
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Details */}
              <div className="appointment-info">

                <div className="info-row">
                  <span>Date</span>
                  <strong>{item.date}</strong>
                </div>

                <div className="info-row">
                  <span>Time</span>
                  <strong>
                    {item.starttime} - {item.endTime}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Employee</span>
                  <strong>{item.employee?.name}</strong>
                </div>

                <div className="info-row">
                  <span>Duration</span>
                  <strong>{item.totalDuration} mins</strong>
                </div>

                <div className="info-row total-price">
                  <span>Total Price</span>
                  <strong>₹{item.totalPrice}</strong>
                </div>

              </div>

              {/* Services */}
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

              {/* Cancel Button */}
              {!["Cancelled", "Completed", "NoShow"].includes(item.status) && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(item.appointmentId)}
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