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
    blockShopOwner,
    getShopOwners,
    unblockShopOwner
} from "../api/adminApi";

import "../styles/AdminShopOwners.css";

export default function AdminShopOwners() {

    const navigate = useNavigate();

    /* ===============================
            STATES
    =============================== */

    const [owners, setOwners] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedOwner, setSelectedOwner] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [page, setPage] = useState(1);

    const pageSize = 10;

    const [stats, setStats] = useState({

        totalOwners: 0,

        activeOwners: 0,

        blockedOwners: 0,

        totalShops: 0

    });

    /* ===============================
            LOAD OWNERS
    =============================== */

    const loadOwners = async () => {

        try {

            setLoading(true);

            const res = await getShopOwners();

            if (res.data.success) {

                setOwners(res.data.owners);

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

        loadOwners();

    }, []);

    /* ===============================
            SEARCH + FILTER
    =============================== */

    const filteredOwners = useMemo(() => {

        return owners.filter(owner => {

            const matchSearch =

                owner.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                owner.email
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                owner.number
                    ?.includes(search);

            const matchStatus =

                statusFilter === "All"

                    ? true

                    : owner.status === statusFilter;

            return matchSearch && matchStatus;

        });

    }, [owners, search, statusFilter]);

    /* ===============================
            PAGINATION
    =============================== */

    const totalPages = Math.ceil(

        filteredOwners.length / pageSize

    );

    const paginatedOwners = filteredOwners.slice(

        (page - 1) * pageSize,

        page * pageSize

    );

    /* ===============================
            VIEW OWNER
    =============================== */

    const handleView = (owner) => {

        setSelectedOwner(owner);

        setShowModal(true);

    };

    /* ===============================
            BLOCK OWNER
    =============================== */

    const handleBlock = async (id) => {

        try {

            const res = await blockShopOwner(id);

            if (res.data.success) {

                setShowModal(false);

                setSelectedOwner(null);

                await loadOwners();

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    /* ===============================
            UNBLOCK OWNER
    =============================== */

    const handleUnblock = async (id) => {

        try {

            const res = await unblockShopOwner(id);

            if (res.data.success) {

                setShowModal(false);

                setSelectedOwner(null);

                await loadOwners();

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    return (

        <div className="adminO-page">
            {/* ===============================
                HEADER
        =============================== */}

            <div className="adminO-header">

                <div className="adminO-headerLeft">

                    <button
                        className="adminO-backBtn"
                        onClick={() => navigate("/admindashboard")}
                    >
                        ← Dashboard
                    </button>

                    <div>

                        <h1>Shop Owners</h1>

                        <p>
                            View and manage all registered shop owners.
                        </p>

                    </div>

                </div>

            </div>

            {/* ===============================
                DASHBOARD CARDS
        =============================== */}

            <div className="adminO-cardGrid">

                <div className="adminO-card">

                    <div className="adminO-cardIcon purple">

                        <Users size={28} />

                    </div>

                    <div>

                        <h2>{stats.totalOwners}</h2>

                        <span>Total Owners</span>

                    </div>

                </div>

                <div className="adminO-card">

                    <div className="adminO-cardIcon green">

                        <UserCheck size={28} />

                    </div>

                    <div>

                        <h2>{stats.activeOwners}</h2>

                        <span>Active Owners</span>

                    </div>

                </div>

                <div className="adminO-card">

                    <div className="adminO-cardIcon red">

                        <UserX size={28} />

                    </div>

                    <div>

                        <h2>{stats.blockedOwners}</h2>

                        <span>Blocked Owners</span>

                    </div>

                </div>

                <div className="adminO-card">

                    <div className="adminO-cardIcon blue">

                        <User size={28} />

                    </div>

                    <div>

                        <h2>{stats.totalShops}</h2>

                        <span>Total Shops</span>

                    </div>

                </div>

            </div>

            {/* ===============================
                SEARCH & FILTER
        =============================== */}

            <div className="adminO-toolbar">

                <div className="adminO-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search owner..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <select
                    className="adminO-filter"
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

            {/* ===============================
                TABLE
        =============================== */}

            <div className="adminO-tableCard">

                <table className="adminO-table">

                    <thead>

                        <tr>

                            <th>Owner</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Total Shops</th>

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
                                        className="adminO-loading"
                                    >

                                        Loading...

                                    </td>

                                </tr>

                                :

                                paginatedOwners.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="adminO-loading"
                                        >

                                            No Shop Owners Found

                                        </td>

                                    </tr>

                                    :

                                    paginatedOwners.map((owner) => (

                                        <tr key={owner._id}>

                                            <td>

                                                {owner.name}

                                            </td>

                                            <td>

                                                {owner.email}

                                            </td>

                                            <td>

                                                {owner.number}

                                            </td>

                                            <td>

                                                {owner.totalShops}

                                            </td>

                                            <td>

                                                {

                                                    new Date(owner.createdAt)
                                                        .toLocaleDateString("en-GB")

                                                }

                                            </td>

                                            <td>

                                                <span
                                                    className={`adminO-badge ${owner.status.toLowerCase()}`}
                                                >

                                                    {owner.status}

                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="adminO-viewBtn"
                                                    onClick={() =>
                                                        handleView(owner)
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

            {/* ===============================
                PAGINATION
        =============================== */}

            {

                totalPages > 1 &&

                <div className="adminO-pagination">

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
                                        ? "adminO-pageActive"
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

            {/* ===============================
                OWNER DETAILS MODAL
        =============================== */}

            {

                showModal &&

                selectedOwner &&

                <div className="adminO-modalOverlay">

                    <div className="adminO-modal">

                        <div className="adminO-modalHeader">

                            <h2>

                                Shop Owner Details

                            </h2>

                            <button
                                className="adminO-closeBtn"
                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedOwner(null);

                                }}
                            >

                                ✕

                            </button>

                        </div>

                        <div className="adminO-modalBody">

                            <div className="adminO-infoRow">

                                <span>Name</span>

                                <strong>{selectedOwner.name}</strong>

                            </div>

                            <div className="adminO-infoRow">

                                <span>Email</span>

                                <strong>{selectedOwner.email}</strong>

                            </div>

                            <div className="adminO-infoRow">

                                <span>Phone</span>

                                <strong>{selectedOwner.number}</strong>

                            </div>

                            <div className="adminO-infoRow">

                                <span>Gender</span>

                                <strong>

                                    {selectedOwner.gender || "-"}

                                </strong>

                            </div>

                            <div className="adminO-infoRow">

                                <span>Address</span>

                                <strong>

                                    {selectedOwner.address || "-"}

                                </strong>

                            </div>

                            <div className="adminO-infoRow">

                                <span>Joined</span>

                                <strong>

                                    {

                                        new Date(selectedOwner.createdAt)
                                            .toLocaleDateString("en-GB")

                                    }

                                </strong>

                            </div>

                            <div className="adminO-infoRow">

                                <span>Total Shops</span>

                                <strong>

                                    {selectedOwner.totalShops}

                                </strong>

                            </div>

                            <div className="adminO-infoRow">

                                <span>Approved Shops</span>

                                <strong>

                                    {selectedOwner.approvedShops}

                                </strong>

                            </div>

                            <div className="adminO-infoRow">

                                <span>Pending Shops</span>

                                <strong>

                                    {selectedOwner.pendingShops}

                                </strong>

                            </div>

                            <div className="adminO-infoRow">

                                <span>Rejected Shops</span>

                                <strong>

                                    {selectedOwner.rejectedShops}

                                </strong>

                            </div>

                            <div className="adminO-infoRow">

                                <span>Status</span>

                                <strong>

                                    {selectedOwner.status}

                                </strong>

                            </div>

                        </div>

                        <div className="adminO-modalFooter">

                            {

                                selectedOwner.status === "Active"

                                    ?

                                    <button
                                        className="adminO-blockBtn"
                                        onClick={() =>
                                            handleBlock(selectedOwner._id)
                                        }
                                    >

                                        <UserX size={18} />

                                        Block Owner

                                    </button>

                                    :

                                    <button
                                        className="adminO-unblockBtn"
                                        onClick={() =>
                                            handleUnblock(selectedOwner._id)
                                        }
                                    >

                                        <UserCheck size={18} />

                                        Unblock Owner

                                    </button>

                            }

                            <button
                                className="adminO-closeModalBtn"
                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedOwner(null);

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