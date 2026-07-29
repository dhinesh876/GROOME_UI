
import {
    BadgeCheck,
    Eye,
    Scissors,
    Search,
    Store,
    XCircle
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    disableService,
    enableService,
    getServices
} from "../api/adminApi";

import "../styles/AdminServices.css";

export default function AdminServices() {

    /* =====================================
        STATES
    ===================================== */

    const navigate = useNavigate();

    const [services, setServices] = useState([]);

    const [stats, setStats] = useState({

        totalServices: 0,

        activeServices: 0,

        inactiveServices: 0,

        totalShops: 0

    });

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [selectedService, setSelectedService] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [page, setPage] = useState(1);

    const pageSize = 10;

    /* =====================================
        LOAD SERVICES
    ===================================== */

    const loadServices = async () => {

        try {

            setLoading(true);

            const res = await getServices();

            if (res.data.success) {

                setServices(res.data.services);

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

        loadServices();

    }, []);

    /* =====================================
        ENABLE SERVICE
    ===================================== */

    const handleEnable = async (id) => {

        try {

            const res = await enableService(id);

            if (res.data.success) {

                setShowModal(false);

                setSelectedService(null);

                loadServices();

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    /* =====================================
        DISABLE SERVICE
    ===================================== */

    const handleDisable = async (id) => {

        try {

            const res = await disableService(id);

            if (res.data.success) {

                setShowModal(false);

                setSelectedService(null);

                loadServices();

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    /* =====================================
        SEARCH
    ===================================== */

    const filteredServices = useMemo(() => {

        const keyword = search.toLowerCase();

        return services.filter(service =>

            (service.servicename || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (service.shop?.shopname || "")
                .toLowerCase()
                .includes(keyword)

        );

    }, [

        services,

        search

    ]);

    /* =====================================
        PAGINATION
    ===================================== */

    const totalPages = Math.ceil(

        filteredServices.length / pageSize

    );

    const paginatedServices = filteredServices.slice(

        (page - 1) * pageSize,

        page * pageSize

    );

    /* =====================================
        VIEW
    ===================================== */

    const handleView = (service) => {

        setSelectedService(service);

        setShowModal(true);

    };

    /* =====================================
    RETURN
===================================== */

    return (

        <div className="adminS-page">

            {/* ==========================
                HEADER
            ========================== */}

            <div className="adminS-header">

                <div className="adminS-headerLeft">

                    <button
                        className="adminS-backBtn"
                        onClick={() => navigate("/admindashboard")}
                    >
                        ← Dashboard
                    </button>

                    <div>

                        <h1>
                            Services
                        </h1>

                        <p>
                            Manage all shop services.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==========================
                DASHBOARD CARDS
            ========================== */}

            <div className="adminS-cardGrid">

                <div className="adminS-card">

                    <div className="adminS-cardIcon purple">

                        <Scissors size={28} />

                    </div>

                    <div>

                        <h2>{stats.totalServices}</h2>

                        <span>Total Services</span>

                    </div>

                </div>

                <div className="adminS-card">

                    <div className="adminS-cardIcon green">

                        <BadgeCheck size={28} />

                    </div>

                    <div>

                        <h2>{stats.activeServices}</h2>

                        <span>Active</span>

                    </div>

                </div>

                <div className="adminS-card">

                    <div className="adminS-cardIcon red">

                        <XCircle size={28} />

                    </div>

                    <div>

                        <h2>{stats.inactiveServices}</h2>

                        <span>Inactive</span>

                    </div>

                </div>

                <div className="adminS-card">

                    <div className="adminS-cardIcon blue">

                        <Store size={28} />

                    </div>

                    <div>

                        <h2>{stats.totalShops}</h2>

                        <span>Shops</span>

                    </div>

                </div>

            </div>

            {/* ==========================
                SEARCH
            ========================== */}

            <div className="adminS-toolbar">

                <div className="adminS-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search Service / Shop..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

            </div>

            {/* ==========================
                TABLE
            ========================== */}

            <div className="adminS-tableCard">

                <table className="adminS-table">

                    <thead>

                        <tr>

                            <th>Service</th>

                            <th>Shop</th>

                            <th>Price</th>

                            <th>Duration</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="adminS-loading"
                                    >

                                        Loading...

                                    </td>

                                </tr>

                                :

                                paginatedServices.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="adminS-loading"
                                        >

                                            No Services Found

                                        </td>

                                    </tr>

                                    :

                                    paginatedServices.map(service => (

                                        <tr key={service._id}>

                                            <td>

                                                {service.servicename}

                                            </td>

                                            <td>

                                                {service.shop?.shopname}

                                            </td>

                                            <td>

                                                ₹ {service.price}

                                            </td>

                                            <td>

                                                {service.duration} mins

                                            </td>

                                            <td>

                                                <span
                                                    className={`adminS-badge ${(service.status || "Active").toLowerCase()}`}
                                                >

                                                    {service.status || "Active"}

                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="adminS-viewBtn"
                                                    onClick={() => handleView(service)}
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

            {/* ==========================
                PAGINATION
            ========================== */}

            {

                totalPages > 1 &&

                <div className="adminS-pagination">

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
                                        ? "adminS-pageActive"
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

            {/* ==========================
                VIEW MODAL
            ========================== */}

            {

                showModal &&

                selectedService &&

                <div className="adminS-modalOverlay">

                    <div className="adminS-modal">

                        <div className="adminS-modalHeader">

                            <h2>

                                Service Details

                            </h2>

                            <button

                                className="adminS-closeBtn"

                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedService(null);

                                }}

                            >

                                ✕

                            </button>

                        </div>

                        <div className="adminS-modalBody">

                            <div className="adminS-infoRow">

                                <span>

                                    Shop

                                </span>

                                <strong>

                                    {selectedService.shop?.shopname}

                                </strong>

                            </div>

                            <div className="adminS-infoRow">

                                <span>

                                    Service

                                </span>

                                <strong>

                                    {selectedService.servicename}

                                </strong>

                            </div>

                            <div className="adminS-infoRow">

                                <span>

                                    Price

                                </span>

                                <strong>

                                    ₹ {selectedService.price}

                                </strong>

                            </div>

                            <div className="adminS-infoRow">

                                <span>

                                    Duration

                                </span>

                                <strong>

                                    {selectedService.duration} mins

                                </strong>

                            </div>

                            <div className="adminS-infoRow">

                                <span>

                                    Status

                                </span>

                                <strong>

                                    {selectedService.status || "Active"}

                                </strong>

                            </div>

                        </div>

                        <div className="adminS-modalFooter">

                            {

                                (selectedService.status || "Active") === "Active"

                                    ?

                                    <button

                                        className="adminS-disableBtn"

                                        onClick={() =>

                                            handleDisable(selectedService._id)

                                        }

                                    >

                                        Disable

                                    </button>

                                    :

                                    <button

                                        className="adminS-enableBtn"

                                        onClick={() =>

                                            handleEnable(selectedService._id)

                                        }

                                    >

                                        Enable

                                    </button>

                            }

                            <button

                                className="adminS-closeModalBtn"

                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedService(null);

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