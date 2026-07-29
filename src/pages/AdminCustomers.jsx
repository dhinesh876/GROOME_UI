import {
    Eye,
    Search,
    User,
    UserCheck,
    Users,
    UserX
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    blockCustomer,
    getCustomers,
    unblockCustomer
} from "../api/adminApi";

import "../styles/AdminCustomers.css";

export default function AdminCustomers() {

    const navigate = useNavigate();

    /* ===========================
            STATES
    =========================== */

    const [customers, setCustomers] = useState([]);


    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [page, setPage] = useState(1);

    const pageSize = 10;

    const [stats, setStats] = useState({

        total: 0,

        active: 0,

        blocked: 0,

        newCustomers: 0

    });

    /* ===========================
            LOAD CUSTOMERS
    =========================== */

    const loadCustomers = async () => {

        try {

            setLoading(true);

            const res = await getCustomers();

            if (res.data.success) {

                setCustomers(res.data.customers);

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

        loadCustomers();

    }, []);

    /* ===========================
            SEARCH
    =========================== */

    const filteredCustomers = useMemo(() => {

        return customers.filter(customer => {

            const matchSearch =

                customer.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                customer.email
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                customer.number
                    ?.includes(search);

            const matchStatus =

                statusFilter === "All"

                    ? true

                    : customer.status === statusFilter;

            return matchSearch && matchStatus;

        });

    }, [customers, search, statusFilter]);

    /* ===========================
            PAGINATION
    =========================== */

    const totalPages = Math.ceil(

        filteredCustomers.length / pageSize

    );

    const paginatedCustomers = filteredCustomers.slice(

        (page - 1) * pageSize,

        page * pageSize

    );

    /* ===========================
            VIEW
    =========================== */

    const handleView = (customer) => {

        setSelectedCustomer(customer);

        setShowModal(true);

    };

    /* ===========================
            BLOCK
    =========================== */

    const handleBlock = async (id) => {

        try {

            const res = await blockCustomer(id);

            if (res.data.success) {

                setShowModal(false);

                await loadCustomers();

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    /* ===========================
            UNBLOCK
    =========================== */

    const handleUnblock = async (id) => {

        try {

            const res = await unblockCustomer(id);

            if (res.data.success) {

                setShowModal(false);

                await loadCustomers();

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    return (

        <div className="adminC-page">

            {/* ===========================
                HEADER
        =========================== */}

            <div className="adminC-header">

                <div className="adminC-headerLeft">

                    <button
                        className="adminC-backBtn"
                        onClick={() => navigate("/admindashboard")}
                    >
                        ← Dashboard
                    </button>

                    <div>

                        <h1>Customers</h1>

                        <p>
                            View and manage all registered customers.
                        </p>

                    </div>

                </div>

            </div>

            {/* ===========================
                DASHBOARD CARDS
        =========================== */}

            <div className="adminC-cardGrid">

                <div className="adminC-card">

                    <div className="adminC-cardIcon purple">

                        <Users size={28} />

                    </div>

                    <div>

                        <h2>{stats.total}</h2>

                        <span>Total Customers</span>

                    </div>

                </div>

                <div className="adminC-card">

                    <div className="adminC-cardIcon green">

                        <UserCheck size={28} />

                    </div>

                    <div>

                        <h2>{stats.active}</h2>

                        <span>Active Customers</span>

                    </div>

                </div>

                <div className="adminC-card">

                    <div className="adminC-cardIcon red">

                        <UserX size={28} />

                    </div>

                    <div>

                        <h2>{stats.blocked}</h2>

                        <span>Blocked Customers</span>

                    </div>

                </div>

                <div className="adminC-card">

                    <div className="adminC-cardIcon blue">

                        <User size={28} />

                    </div>

                    <div>

                        <h2>{stats.newCustomers}</h2>

                        <span>New This Month</span>

                    </div>

                </div>

            </div>

            {/* ===========================
                TOOLBAR
        =========================== */}

            <div className="adminC-toolbar">

                <div className="adminC-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search customer..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <select
                    className="adminC-filter"
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >

                    <option value="All">
                        All
                    </option>

                    <option value="Active">
                        Active
                    </option>

                    <option value="Blocked">
                        Blocked
                    </option>

                </select>

            </div>

            {/* ===========================
                TABLE
        =========================== */}

            <div className="adminC-tableCard">

                <table className="adminC-table">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Gender</th>

                            <th>Joined</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="adminC-loading"
                                    >

                                        Loading...

                                    </td>

                                </tr>

                                :

                                paginatedCustomers.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="adminC-loading"
                                        >

                                            No {statusFilter} Found

                                        </td>

                                    </tr>

                                    :

                                    paginatedCustomers.map((customer) => (

                                        <tr key={customer._id}>

                                            <td>

                                                {customer.name}

                                            </td>

                                            <td>

                                                {customer.email}

                                            </td>

                                            <td>

                                                {customer.number}

                                            </td>

                                            <td>

                                                {customer.gender || "-"}

                                            </td>

                                            <td>

                                                {

                                                    new Date(customer.createdAt)
                                                        .toLocaleDateString("en-GB")

                                                }

                                            </td>

                                            <td>

                                                <span
                                                    className={`adminC-badge ${customer.status.toLowerCase()}`}
                                                >

                                                    {customer.status}

                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="adminC-viewBtn"
                                                    onClick={() =>
                                                        handleView(customer)
                                                    }
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

            {/* ===========================
                PAGINATION
        =========================== */}

            {

                totalPages > 1 &&

                <div className="adminC-pagination">

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
                                        ? "adminC-pageActive"
                                        : ""
                                }
                                onClick={() => setPage(index + 1)}
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

            {/* ===========================
                CUSTOMER MODAL
        =========================== */}

            {

                showModal &&

                selectedCustomer &&

                <div className="adminC-modalOverlay">

                    <div className="adminC-modal">

                        <div className="adminC-modalHeader">

                            <h2>

                                Customer Details

                            </h2>

                            <button
                                className="adminC-closeBtn"
                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedCustomer(null);

                                }}
                            >

                                ✕

                            </button>

                        </div>

                        <div className="adminC-modalBody">

                            <div className="adminC-infoRow">

                                <span>Name</span>

                                <strong>{selectedCustomer.name}</strong>

                            </div>

                            <div className="adminC-infoRow">

                                <span>Email</span>

                                <strong>{selectedCustomer.email}</strong>

                            </div>

                            <div className="adminC-infoRow">

                                <span>Phone</span>

                                <strong>{selectedCustomer.number}</strong>

                            </div>

                            <div className="adminC-infoRow">

                                <span>Gender</span>

                                <strong>

                                    {selectedCustomer.gender || "-"}

                                </strong>

                            </div>

                            <div className="adminC-infoRow">

                                <span>Date Of Birth</span>

                                <strong>

                                    {selectedCustomer.dob || "-"}

                                </strong>

                            </div>

                            <div className="adminC-infoRow">

                                <span>Joined</span>

                                <strong>

                                    {

                                        new Date(selectedCustomer.createdAt)
                                            .toLocaleDateString("en-GB")

                                    }

                                </strong>

                            </div>

                            <div className="adminC-infoRow">

                                <span>Total Appointments</span>

                                <strong>

                                    {selectedCustomer.totalAppointments || 0}

                                </strong>

                            </div>

                            <div className="adminC-infoRow">

                                <span>Total Spending</span>

                                <strong>

                                    ₹ {selectedCustomer.totalSpent || 0}

                                </strong>

                            </div>

                            <div className="adminC-infoRow">

                                <span>Last Appointment</span>

                                <strong>

                                    {

                                        selectedCustomer.lastAppointment

                                            ?

                                            new Date(selectedCustomer.lastAppointment)
                                                .toLocaleDateString("en-GB")

                                            :

                                            "-"

                                    }

                                </strong>

                            </div>

                            <div className="adminC-infoRow">

                                <span>Status</span>

                                <strong>

                                    {selectedCustomer.status}

                                </strong>

                            </div>

                        </div>

                        <div className="adminC-modalFooter">

                            {

                                selectedCustomer.status === "Active"

                                    ?

                                    <button
                                        className="adminC-blockBtn"
                                        onClick={() =>
                                            handleBlock(selectedCustomer._id)
                                        }
                                    >

                                        <UserX size={18} />

                                        Block Customer

                                    </button>

                                    :

                                    <button
                                        className="adminC-unblockBtn"
                                        onClick={() =>
                                            handleUnblock(selectedCustomer._id)
                                        }
                                    >

                                        <UserCheck size={18} />

                                        Unblock Customer

                                    </button>

                            }

                            <button
                                className="adminC-closeModalBtn"
                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedCustomer(null);

                                }}
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