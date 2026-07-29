import {
    Ban,
    CheckCircle,
    Eye,
    RefreshCw,
    Search,
    Store
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    activateShop,
    getApprovedShops,
    suspendShop
} from "../api/adminApi";

import "../styles/AdminApprovedShops.css";

export default function AdminApprovedShops() {

    const navigate = useNavigate();

    /* ===========================
            STATES
    =========================== */

    const [shops, setShops] = useState([]);
    const [filterdat, setFilterData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedShop, setSelectedShop] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [page, setPage] = useState(1);

    const pageSize = 10;

    const [stats, setStats] = useState({

        total: 0,

        active: 0,

        suspended: 0

    });

    /* ===========================
            LOAD DATA
    =========================== */

    const loadApprovedShops = async () => {

        try {

            setLoading(true);

            const res = await getApprovedShops();

            if (res.data.success) {

                setShops(res.data.shops);

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

        loadApprovedShops();

    }, []);

    /* ===========================
            SEARCH
    =========================== */

    const filteredShops = useMemo(() => {

        return shops.filter(shop => {

            const owner = shop.shopUserId?.name || "";

            const email = shop.shopUserId?.email || "";

            const phone = shop.shopUserId?.number || "";

            const matchSearch =

                shop.shopname
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                owner
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                email
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                phone
                    .includes(search);

            const matchStatus =

                statusFilter === "All"

                    ? true

                    : shop.shopstatus === statusFilter;

            return matchSearch && matchStatus;

        });

    }, [shops, search, statusFilter]);

    /* ===========================
            PAGINATION
    =========================== */

    const totalPages = Math.ceil(

        filteredShops.length / pageSize

    );

    const paginatedShops = filteredShops.slice(

        (page - 1) * pageSize,

        page * pageSize

    );

    /* ===========================
            VIEW SHOP
    =========================== */

    const handleView = (shop) => {

        setSelectedShop(shop);

        setShowModal(true);

    };

    /* ===========================
            SUSPEND SHOP
    =========================== */

    const handleSuspend = async (id) => {

        try {

            const res = await suspendShop(id);

            if (res.data.success) {

                setShowModal(false);

                await loadApprovedShops();

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    /* ===========================
            ACTIVATE SHOP
    =========================== */

    const handleActivate = async (id) => {

        try {

            const res = await activateShop(id);

            if (res.data.success) {

                setShowModal(false);

                await loadApprovedShops();

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    return (

        <div className="adminA-page">
            {/* ===========================
                    HEADER
            =========================== */}

            <div className="adminA-header">

                <div className="adminA-headerLeft">

                    <button
                        className="adminA-backBtn"
                        onClick={() => navigate("/admindashboard")}
                    >
                        ← Dashboard
                    </button>

                    <div>

                        <h1>Approved Shops</h1>

                        <p>
                            Manage all approved salon businesses.
                        </p>

                    </div>

                </div>

            </div>

            {/* ===========================
                    DASHBOARD CARDS
            =========================== */}

            <div className="adminA-cardGrid">

                <div className="adminA-card">

                    <div className="adminA-cardIcon purple">

                        <Store size={28} />

                    </div>

                    <div>

                        <h2>{stats.total}</h2>

                        <span>Total Approved</span>

                    </div>

                </div>

                <div className="adminA-card">

                    <div className="adminA-cardIcon green">

                        <CheckCircle size={28} />

                    </div>

                    <div>

                        <h2>{stats.active}</h2>

                        <span>Active Shops</span>

                    </div>

                </div>

                <div className="adminA-card">

                    <div className="adminA-cardIcon red">

                        <Ban size={28} />

                    </div>

                    <div>

                        <h2>{stats.suspended}</h2>

                        <span>Suspended</span>

                    </div>

                </div>

            </div>

            {/* ===========================
                    SEARCH BAR
            =========================== */}

            <div className="adminA-toolbar">

                <div className="adminA-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search Shop..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <select
                    className="adminA-filter"
                    value={statusFilter}
                    onChange={(e) => {
                        const value = e.target.value;
                        setStatusFilter(value);
                        setFilterData(value);
                    }}
                >

                    <option value="All">
                        All
                    </option>

                    <option value="Active">
                        Active
                    </option>

                    <option value="Suspended">
                        Suspended
                    </option>

                </select>

            </div>

            {/* ===========================
                    TABLE
            =========================== */}

            <div className="adminA-tableCard">

                <table className="adminA-table">

                    <thead>

                        <tr>

                            <th>Shop</th>

                            <th>Owner</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Status</th>

                            <th>Approved Date</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="adminA-loading"
                                    >

                                        Loading...

                                    </td>

                                </tr>

                                :

                                paginatedShops.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="adminA-loading"
                                        >

                                            No ${filterdat} Shops

                                        </td>

                                    </tr>

                                    :

                                    paginatedShops.map((shop) => (

                                        <tr key={shop._id}>

                                            <td>

                                                {shop.shopname}

                                            </td>

                                            <td>

                                                {shop.shopUserId?.name}

                                            </td>

                                            <td>

                                                {shop.shopUserId?.email}

                                            </td>

                                            <td>

                                                {shop.shopUserId?.number}

                                            </td>

                                            <td>

                                                <span
                                                    className={`adminA-badge ${shop.shopstatus.toLowerCase()}`}
                                                >

                                                    {shop.shopstatus}

                                                </span>

                                            </td>

                                            <td>

                                                {

                                                    new Date(shop.createdAt)
                                                        .toLocaleDateString("en-GB")

                                                }

                                            </td>

                                            <td>

                                                <button
                                                    className="adminA-viewBtn"
                                                    onClick={() =>
                                                        handleView(shop)
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

                <div className="adminA-pagination">

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
                                        ? "adminA-pageActive"
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
                    SHOP DETAILS MODAL
            =========================== */}

            {

                showModal &&

                selectedShop &&

                <div className="adminA-modalOverlay">

                    <div className="adminA-modal">

                        <div className="adminA-modalHeader">

                            <h2>

                                {selectedShop.shopname}

                            </h2>

                            <button
                                className="adminA-closeBtn"
                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedShop(null);

                                }}
                            >

                                ✕

                            </button>

                        </div>

                        <div className="adminA-modalBody">

                            <div className="adminA-infoRow">

                                <span>Owner</span>

                                <strong>

                                    {selectedShop.shopUserId?.name}

                                </strong>

                            </div>

                            <div className="adminA-infoRow">

                                <span>Email</span>

                                <strong>

                                    {selectedShop.shopUserId?.email}

                                </strong>

                            </div>

                            <div className="adminA-infoRow">

                                <span>Phone</span>

                                <strong>

                                    {selectedShop.shopUserId?.number}

                                </strong>

                            </div>

                            <div className="adminA-infoRow">

                                <span>Address</span>

                                <strong>

                                    {selectedShop.address}

                                </strong>

                            </div>

                            <div className="adminA-infoRow">

                                <span>Opening Time</span>

                                <strong>

                                    {selectedShop.openingTime}

                                </strong>

                            </div>

                            <div className="adminA-infoRow">

                                <span>Closing Time</span>

                                <strong>

                                    {selectedShop.closingTime}

                                </strong>

                            </div>

                            <div className="adminA-infoRow">

                                <span>Status</span>

                                <strong>

                                    {selectedShop.shopstatus}

                                </strong>

                            </div>

                            <div className="adminA-infoRow">

                                <span>Approved On</span>

                                <strong>

                                    {

                                        selectedShop.createdAt
                                            ?

                                            new Date(selectedShop.createdAt)
                                                .toLocaleDateString("en-GB")

                                            :

                                            "-"

                                    }

                                </strong>

                            </div>

                        </div>

                        <div className="adminA-modalFooter">

                            {

                                selectedShop.shopstatus === "Active"

                                    ?

                                    <button
                                        className="adminA-suspendBtn"
                                        onClick={() =>
                                            handleSuspend(selectedShop._id)
                                        }
                                    >

                                        <Ban size={18} />

                                        Suspend Shop

                                    </button>

                                    :

                                    <button
                                        className="adminA-activateBtn"
                                        onClick={() =>
                                            handleActivate(selectedShop._id)
                                        }
                                    >

                                        <RefreshCw size={18} />

                                        Activate Shop

                                    </button>

                            }

                            <button
                                className="adminA-closeModalBtn"
                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedShop(null);

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