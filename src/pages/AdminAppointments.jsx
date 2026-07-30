import {
    CalendarDays,
    CheckCircle,
    Clock3,
    Eye,
    Search,
    XCircle
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAppointments
} from "../api/adminApi";

import "../styles/adminAppointments.css";

export default function adminAppointments() {

    /* ===============================
        STATES
    =============================== */

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);

    const [stats, setStats] = useState({

        totalAppointments: 0,

        todayAppointments: 0,

        completedAppointments: 0,

        cancelledAppointments: 0

    });

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [page, setPage] = useState(1);

    const pageSize = 10;

    /* ===============================
        LOAD APPOINTMENTS
    =============================== */

    const loadAppointments = async () => {

        try {

            setLoading(true);

            const res = await getAppointments();

            if (res.data.success) {

                setAppointments(res.data.appointments);

                setStats(res.data.stats);

            }

        }

        catch (err) {

            //console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadAppointments();

    }, []);

    /* ===============================
    SEARCH + FILTER
=============================== */

    const filteredAppointments = useMemo(() => {

        return appointments.filter((appointment) => {

            const keyword = search.toLowerCase();

            const matchSearch =

                appointment.customer?.name?.toLowerCase().includes(keyword)

                ||

                appointment.shop?.shopname?.toLowerCase().includes(keyword)

                ||

                appointment.employee?.name?.toLowerCase().includes(keyword)

                ||

                appointment._id?.toLowerCase().includes(keyword);

            const matchStatus =

                statusFilter === "All"

                    ? true

                    : appointment.status === statusFilter;

            return matchSearch && matchStatus;

        });

    }, [

        appointments,

        search,

        statusFilter

    ]);

    /* ===============================
        PAGINATION
    =============================== */

    const totalPages = Math.ceil(

        filteredAppointments.length / pageSize

    );

    const paginatedAppointments = filteredAppointments.slice(

        (page - 1) * pageSize,

        page * pageSize

    );

    /* ===============================
        VIEW APPOINTMENT
    =============================== */

    const handleView = (appointment) => {

        setSelectedAppointment(appointment);

        setShowModal(true);

    };

    /* ===============================
        RETURN
    =============================== */

    return (

        <div className="adminApt-page">

            {/* ===============================
                HEADER
            =============================== */}

            <div className="adminApt-header">

                <div className="adminApt-headerLeft">

                    <button

                        className="adminApt-backBtn"

                        onClick={() => navigate("/admindashboard")}

                    >

                        ← Dashboard

                    </button>

                    <div>

                        <h1>

                            Appointments

                        </h1>

                        <p>

                            Monitor all appointments in the platform.

                        </p>

                    </div>

                </div>

            </div>

            {/* ===============================
                CARDS
            =============================== */}

            <div className="adminApt-cardGrid">

                <div className="adminApt-card">

                    <div className="adminApt-cardIcon purple">

                        <CalendarDays size={28} />

                    </div>

                    <div>

                        <h2>

                            {stats.totalAppointments}

                        </h2>

                        <span>

                            Total Appointments

                        </span>

                    </div>

                </div>

                <div className="adminApt-card">

                    <div className="adminApt-cardIcon orange">

                        <Clock3 size={28} />

                    </div>

                    <div>

                        <h2>

                            {stats.todayAppointments}

                        </h2>

                        <span>

                            Today

                        </span>

                    </div>

                </div>

                <div className="adminApt-card">

                    <div className="adminApt-cardIcon green">

                        <CheckCircle size={28} />

                    </div>

                    <div>

                        <h2>

                            {stats.completedAppointments}

                        </h2>

                        <span>

                            Completed

                        </span>

                    </div>

                </div>

                <div className="adminApt-card">

                    <div className="adminApt-cardIcon red">

                        <XCircle size={28} />

                    </div>

                    <div>

                        <h2>

                            {stats.cancelledAppointments}

                        </h2>

                        <span>

                            Cancelled

                        </span>

                    </div>

                </div>

            </div>

            {/* ===============================
                SEARCH
            =============================== */}

            <div className="adminApt-toolbar">

                <div className="adminApt-search">

                    <Search size={18} />

                    <input

                        type="text"

                        placeholder="Search Appointment..."

                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                    />

                </div>

                <select

                    className="adminApt-filter"

                    value={statusFilter}

                    onChange={(e) =>

                        setStatusFilter(e.target.value)

                    }

                >

                    <option value="All">All</option>

                    <option value="Pending">Pending</option>

                    <option value="Confirmed">Confirmed</option>

                    <option value="Completed">Completed</option>

                    <option value="Cancelled">Cancelled</option>

                    <option value="NoShow">NoShow</option>

                </select>

            </div>

            {/* ===============================
                TABLE
            =============================== */}

            <div className="adminApt-tableCard">

                <table className="adminApt-table">

                    <thead>

                        <tr>

                            <th>Customer</th>

                            <th>Shop</th>

                            <th>Employee</th>

                            <th>Date</th>

                            <th>Time</th>

                            <th>Status</th>

                            <th>Price</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="adminApt-loading"
                                    >

                                        Loading...

                                    </td>

                                </tr>

                                :

                                paginatedAppointments.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="8"
                                            className="adminApt-loading"
                                        >

                                            No Appointments Found

                                        </td>

                                    </tr>

                                    :

                                    paginatedAppointments.map((appointment) => (

                                        <tr key={appointment._id}>

                                            <td>

                                                {appointment.customer?.name}

                                            </td>

                                            <td>

                                                {appointment.shop?.shopname}

                                            </td>

                                            <td>

                                                {appointment.employee?.name}

                                            </td>

                                            <td>

                                                {appointment.startDate}

                                            </td>

                                            <td>

                                                {appointment.startTime}

                                            </td>

                                            <td>

                                                <span className={`adminApt-badge ${appointment.status.toLowerCase()}`}>

                                                    {appointment.status}

                                                </span>

                                            </td>

                                            <td>

                                                ₹ {appointment.totalPrice}

                                            </td>

                                            <td>

                                                <button

                                                    className="adminApt-viewBtn"

                                                    onClick={() => handleView(appointment)}

                                                >

                                                    <Eye size={16} />

                                                    View

                                                </button>

                                            </td>

                                        </tr>

                                    ))

                        }

                    </tbody>

                </table>

            </div>

            {/* ===============================
                PAGINATION
            =============================== */}

            {

                totalPages > 1 &&

                <div className="adminApt-pagination">

                    <button

                        disabled={page === 1}

                        onClick={() => setPage(page - 1)}

                    >

                        Previous

                    </button>

                    {

                        [...Array(totalPages)].map((_, index) => (

                            <button

                                key={index}

                                className={

                                    page === index + 1

                                        ? "adminApt-pageActive"

                                        : ""

                                }

                                onClick={() =>

                                    setPage(index + 1)

                                }

                            >

                                {index + 1}

                            </button>

                        ))

                    }

                    <button

                        disabled={page === totalPages}

                        onClick={() => setPage(page + 1)}

                    >

                        Next

                    </button>

                </div>

            }

            {/* ===============================
                VIEW MODAL
            =============================== */}

            {

                showModal &&

                selectedAppointment &&

                <div className="adminApt-modalOverlay">

                    <div className="adminApt-modal">

                        <div className="adminApt-modalHeader">

                            <h2>

                                Appointment Details

                            </h2>

                            <button

                                className="adminApt-closeBtn"

                                onClick={() => setShowModal(false)}

                            >

                                ✕

                            </button>

                        </div>

                        <div className="adminApt-modalBody">

                            <div className="adminApt-infoRow">

                                <span>Customer</span>

                                <strong>{selectedAppointment.customer?.name}</strong>

                            </div>

                            <div className="adminApt-infoRow">

                                <span>Phone</span>

                                <strong>{selectedAppointment.customer?.number}</strong>

                            </div>

                            <div className="adminApt-infoRow">

                                <span>Shop</span>

                                <strong>{selectedAppointment.shop?.shopname}</strong>

                            </div>

                            <div className="adminApt-infoRow">

                                <span>Employee</span>

                                <strong>{selectedAppointment.employee?.name}</strong>

                            </div>

                            <div className="adminApt-infoRow">

                                <span>Services</span>

                                <strong>

                                    {

                                        selectedAppointment.services

                                            ?.map(service => service.servicename)

                                            .join(", ")

                                    }

                                </strong>

                            </div>

                            <div className="adminApt-infoRow">

                                <span>Date</span>

                                <strong>{selectedAppointment.startDate}</strong>

                            </div>

                            <div className="adminApt-infoRow">

                                <span>Time</span>

                                <strong>{selectedAppointment.startTime}</strong>

                            </div>

                            <div className="adminApt-infoRow">

                                <span>Duration</span>

                                <strong>

                                    {selectedAppointment.totalDuration} mins

                                </strong>

                            </div>

                            <div className="adminApt-infoRow">

                                <span>Total Price</span>

                                <strong>

                                    ₹ {selectedAppointment.totalPrice}

                                </strong>

                            </div>

                            <div className="adminApt-infoRow">

                                <span>Status</span>

                                <strong>

                                    {selectedAppointment.status}

                                </strong>

                            </div>

                        </div>

                        <div className="adminApt-modalFooter">

                            <button

                                className="adminApt-closeModalBtn"

                                onClick={() => setShowModal(false)}

                            >

                                Close

                            </button>

                        </div>

                    </div>

                </div>

            }

        </div>

    );

}