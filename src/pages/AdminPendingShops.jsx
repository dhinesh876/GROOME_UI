// import {
//     CheckCircle,
//     Clock3,
//     Eye,
//     Search,
//     Store,
//     XCircle
// } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getPendingShops } from "../api/adminApi";

// import "../styles/AdminpendingShops.css";
// // import axios from "axios";

// export default function AdminPendingShops() {

//     /* ===========================
//         STATES
//     =========================== */
//     const navigate = useNavigate();

//     const [shops, setShops] = useState([]);

//     const [loading, setLoading] = useState(true);

//     const [search, setSearch] = useState("");

//     const [statusFilter, setStatusFilter] = useState("Pending");

//     const [selectedShop, setSelectedShop] = useState(null);

//     const [showModal, setShowModal] = useState(false);

//     const [page, setPage] = useState(1);

//     const pageSize = 10;

//     /* ===========================
//         LOAD SHOPS
//     =========================== */

//     const loadPendingShops = async () => {

//         try {

//             setLoading(true);

//             const res = await getPendingShops();

//             //console.log(res.data.shops);

//             if (res.data.success) {
//                 setShops(res.data.shops);
//             }

//         }

//         catch (err) {

//             //console.log(err);

//         }

//         finally {

//             setLoading(false);

//         }

//     };

//     const handleApprove = async (id) => {

//         await approveShop(id);

//         loadPendingShops();

//     };

//     const handleReject = async (id) => {

//         await rejectShop(id);

//         loadPendingShops();

//     };

//     useEffect(() => {

//         loadPendingShops();

//     }, []);

//     /* ===========================
//         SEARCH + FILTER
//     =========================== */

//     const filteredShops = useMemo(() => {

//         //console.log(shops.shopname, " shops ");
//         return shops.filter(shop => {

//             const matchSearch =

//                 shop.shopname
//                     .toLowerCase()
//                     .includes(search.toLowerCase())

//                 ||

//                 shop.ownername
//                     .toLowerCase()
//                     .includes(search.toLowerCase())

//                 ||

//                 shop.email
//                     .toLowerCase()
//                     .includes(search.toLowerCase());

//             const matchStatus =

//                 statusFilter === "All"

//                     ? true

//                     : shop.status === statusFilter;

//             return matchSearch && matchStatus;

//         });

//     }, [shops, search, statusFilter]);

//     /* ===========================
//         PAGINATION
//     =========================== */

//     const totalPages = Math.ceil(filteredShops.length / pageSize);

//     const paginatedShops = filteredShops.slice(

//         (page - 1) * pageSize,

//         page * pageSize

//     );

//     /* ===========================
//         VIEW SHOP
//     =========================== */

//     const handleView = (shop) => {

//         setSelectedShop(shop);

//         setShowModal(true);

//     };

//     /* ===========================
//         APPROVE
//     =========================== */

//     const approveShop = async (id) => {

//         try {

//             /*
//             await axios.patch(`/admin/shop/${id}/approve`);
//             */

//             setShops(prev =>

//                 prev.map(shop =>

//                     shop._id === id

//                         ? {

//                             ...shop,

//                             status: "Approved"

//                         }

//                         : shop

//                 )

//             );

//             setShowModal(false);

//         }

//         catch (err) {

//             //console.log(err);

//         }

//     };

//     /* ===========================
//         REJECT
//     =========================== */

//     const rejectShop = async (id) => {

//         try {

//             /*
//             await axios.patch(`/admin/shop/${id}/reject`);
//             */

//             setShops(prev =>

//                 prev.map(shop =>

//                     shop._id === id

//                         ? {

//                             ...shop,

//                             status: "Rejected"

//                         }

//                         : shop

//                 )

//             );

//             setShowModal(false);

//         }

//         catch (err) {

//             //console.log(err);

//         }

//     };

//     /* ===========================
//         RETURN
//     =========================== */

//     return (

//         <div className="adminP-page">

//             {/* Header starts here */}
//             {/* 
//             <div className="adminP-header">

//                 <div>

//                     <h1>Pending Shop Requests</h1>

//                     <p>
//                         Review, approve or reject newly registered shops.
//                     </p>

//                 </div>

//             </div> */}

//             <div className="adminP-header">

//                 <div className="adminP-headerLeft">

//                     <button
//                         className="adminP-backBtn"
//                         onClick={() => navigate("/admindashboard")}
//                     >
//                         ← Back
//                     </button>

//                     <div>

//                         <h1>Pending Shop Requests</h1>

//                         <p>
//                             Review, approve or reject newly registered shops.
//                         </p>

//                     </div>

//                 </div>

//             </div>

//             {/* ===========================
//                 CARDS
//             ========================== */}

//             <div className="adminP-cardGrid">

//                 <div className="adminP-card">

//                     <div className="adminP-cardIcon purple">

//                         <Store size={28} />

//                     </div>

//                     <div>

//                         <h2>{shops.length}</h2>

//                         <span>Total Requests</span>

//                     </div>

//                 </div>

//                 <div className="adminP-card">

//                     <div className="adminP-cardIcon orange">

//                         <Clock3 size={28} />

//                     </div>

//                     <div>

//                         <h2>

//                             {
//                                 shops.filter(
//                                     x => x.status === "Pending"
//                                 ).length
//                             }

//                         </h2>

//                         <span>Pending</span>

//                     </div>

//                 </div>

//                 <div className="adminP-card">

//                     <div className="adminP-cardIcon green">

//                         <CheckCircle size={28} />

//                     </div>

//                     <div>

//                         <h2>

//                             {
//                                 shops.filter(
//                                     x => x.status === "Approved"
//                                 ).length
//                             }

//                         </h2>

//                         <span>Approved</span>

//                     </div>

//                 </div>

//                 <div className="adminP-card">

//                     <div className="adminP-cardIcon red">

//                         <XCircle size={28} />

//                     </div>

//                     <div>

//                         <h2>

//                             {
//                                 shops.filter(
//                                     x => x.status === "Rejected"
//                                 ).length
//                             }

//                         </h2>

//                         <span>Rejected</span>

//                     </div>

//                 </div>

//             </div>

//             {/* ===========================
//                 SEARCH
//             ========================== */}

//             <div className="adminP-toolbar">

//                 <div className="adminP-search">

//                     <Search size={18} />

//                     <input
//                         type="text"
//                         placeholder="Search shop..."
//                         value={search}
//                         onChange={(e) =>
//                             setSearch(e.target.value)
//                         }
//                     />

//                 </div>

//                 <select
//                     className="adminP-filter"
//                     value={statusFilter}
//                     onChange={(e) =>
//                         setStatusFilter(e.target.value)
//                     }
//                 >

//                     <option value="All">All</option>

//                     <option value="Pending">Pending</option>

//                     <option value="Approved">Approved</option>

//                     <option value="Rejected">Rejected</option>

//                 </select>

//             </div>

//             {/* ===========================
//                 TABLE
//             ========================== */}

//             <div className="adminP-tableCard">

//                 <table className="adminP-table">

//                     <thead>

//                         <tr>

//                             <th>Shop</th>

//                             <th>Owner</th>

//                             <th>Email</th>

//                             <th>Phone</th>

//                             <th>Status</th>

//                             <th>Registered</th>

//                             <th>Action</th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {

//                             loading ?

//                                 <tr>

//                                     <td
//                                         colSpan="7"
//                                         className="adminP-loading"
//                                     >

//                                         Loading...

//                                     </td>

//                                 </tr>

//                                 :

//                                 paginatedShops.length === 0 ?

//                                     <tr>

//                                         <td
//                                             colSpan="7"
//                                             className="adminP-loading"
//                                         >

//                                             No Pending Shops

//                                         </td>

//                                     </tr>

//                                     :

//                                     paginatedShops.map(shop => (

//                                         <tr key={shop._id}>

//                                             <td>{shop.shopname}</td>

//                                             <td>{shop.ownername}</td>

//                                             <td>{shop.email}</td>

//                                             <td>{shop.number}</td>

//                                             <td>

//                                                 <span className={`adminP-badge ${shop.status.toLowerCase()}`}>

//                                                     {shop.status}

//                                                 </span>

//                                             </td>

//                                             <td>{shop.createdAt}</td>

//                                             <td>

//                                                 <button
//                                                     className="adminP-viewBtn"
//                                                     onClick={() =>
//                                                         handleView(shop)
//                                                     }
//                                                 >

//                                                     <Eye size={16} />

//                                                     View

//                                                 </button>

//                                             </td>

//                                         </tr>

//                                     ))

//                         }

//                     </tbody>

//                 </table>

//             </div>

//             {/* ===========================
//                 PAGINATION
//             ========================== */}

//             {
//                 totalPages > 1 &&

//                 <div className="adminP-pagination">

//                     <button
//                         disabled={page === 1}
//                         onClick={() =>
//                             setPage(page - 1)
//                         }
//                     >
//                         Previous
//                     </button>

//                     {

//                         [...Array(totalPages)].map((_, index) => (

//                             <button
//                                 key={index}
//                                 className={
//                                     page === index + 1
//                                         ? "adminP-pageActive"
//                                         : ""
//                                 }
//                                 onClick={() =>
//                                     setPage(index + 1)
//                                 }
//                             >
//                                 {index + 1}
//                             </button>

//                         ))

//                     }

//                     <button
//                         disabled={page === totalPages}
//                         onClick={() =>
//                             setPage(page + 1)
//                         }
//                     >
//                         Next
//                     </button>

//                 </div>

//             }

//             {/* ===========================
//                 VIEW SHOP MODAL
//             ========================== */}

//             {

//                 showModal &&
//                 selectedShop &&

//                 <div className="adminP-modalOverlay">

//                     <div className="adminP-modal">

//                         <div className="adminP-modalHeader">

//                             <h2>

//                                 {selectedShop.shopname}

//                             </h2>

//                             <button
//                                 className="adminP-closeBtn"
//                                 onClick={() =>
//                                     setShowModal(false)
//                                 }
//                             >
//                                 ✕

//                             </button>

//                         </div>

//                         <div className="adminP-modalBody">

//                             <div className="adminP-infoRow">

//                                 <span>Owner</span>

//                                 <strong>

//                                     {selectedShop.ownername}

//                                 </strong>

//                             </div>

//                             <div className="adminP-infoRow">

//                                 <span>Email</span>

//                                 <strong>

//                                     {selectedShop.email}

//                                 </strong>

//                             </div>

//                             <div className="adminP-infoRow">

//                                 <span>Phone</span>

//                                 <strong>

//                                     {selectedShop.number}

//                                 </strong>

//                             </div>

//                             <div className="adminP-infoRow">

//                                 <span>Address</span>

//                                 <strong>

//                                     {selectedShop.address}

//                                 </strong>

//                             </div>

//                             <div className="adminP-infoRow">

//                                 <span>Registered</span>

//                                 <strong>

//                                     {selectedShop.createdAt}

//                                 </strong>

//                             </div>

//                             <div className="adminP-infoRow">

//                                 <span>Status</span>

//                                 <strong>

//                                     {selectedShop.status}

//                                 </strong>

//                             </div>

//                         </div>

//                         <div className="adminP-modalFooter">

//                             {

//                                 selectedShop.status === "Pending" &&

//                                 <>
//                                     {/* 
//                                     <button
//                                         className="adminP-rejectBtn"
//                                         onClick={() =>
//                                             rejectShop(selectedShop._id)
//                                         }
//                                     >

//                                         Reject

//                                     </button>

//                                     <button
//                                         className="adminP-approveBtn"
//                                         onClick={() =>
//                                             approveShop(selectedShop._id)
//                                         }
//                                     >

//                                         Approve

//                                     </button> */}

//                                     <button
//                                         className="adminP-approveBtn"
//                                         onClick={() => handleApprove(selectedShop._id)}
//                                     >
//                                         Approve
//                                     </button>

//                                     <button
//                                         className="adminP-rejectBtn"
//                                         onClick={() => handleReject(selectedShop._id)}
//                                     >
//                                         Reject
//                                     </button>

//                                 </>

//                             }

//                             {

//                                 selectedShop.status !== "Pending" &&

//                                 <button
//                                     className="adminP-closeModalBtn"
//                                     onClick={() =>
//                                         setShowModal(false)
//                                     }
//                                 >

//                                     Close

//                                 </button>

//                             }

//                         </div>

//                     </div>

//                 </div>

//             }

//         </div>

//     );

// }


//29/07

import {
    CheckCircle,
    Clock3,
    Eye,
    Search,
    Store,
    XCircle
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    approveShop,
    getPendingShops,
    rejectShop
} from "../api/adminApi";

import "../styles/AdminPendingShops.css";

export default function AdminPendingShops() {

    const navigate = useNavigate();

    const [shops, setShops] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    // const [statusFilter, setStatusFilter] = useState("Pending");

    const [selectedShop, setSelectedShop] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [page, setPage] = useState(1);

    const pageSize = 10;

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    /* ===============================
            LOAD SHOPS
    =============================== */

    const loadPendingShops = async () => {

        try {

            setLoading(true);

            const res = await getPendingShops();

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

        loadPendingShops();

    }, []);

    /* ===============================
        APPROVE
    =============================== */

    const handleApprove = async (id) => {

        try {

            const res = await approveShop(id);

            if (res.data.success) {

                setShowModal(false);

                setSelectedShop(null);

                await loadPendingShops();

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    /* ===============================
        REJECT
    =============================== */

    const handleReject = async (id) => {

        try {

            const res = await rejectShop(id);

            if (res.data.success) {

                setShowModal(false);

                setSelectedShop(null);

                await loadPendingShops();

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    /* ===============================
            SEARCH
    =============================== */

    const filteredShops = useMemo(() => {

        return shops.filter(shop => {

            const ownerName =
                shop.ownerid?.name || "";

            const ownerEmail =
                shop.ownerid?.email || "";

            const matchSearch =

                shop.shopname
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                ownerName
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                ownerEmail
                    .toLowerCase()
                    .includes(search.toLowerCase());

            // const matchStatus =

            // statusFilter === "All"

            //     ? true

            //     : shop.adminapproval === statusFilter;

            return matchSearch //&& matchStatus;

        });

    }, [shops, search]);

    /* ===============================
            PAGINATION
    =============================== */

    const totalPages = Math.ceil(

        filteredShops.length / pageSize

    );

    const paginatedShops = filteredShops.slice(

        (page - 1) * pageSize,

        page * pageSize

    );

    /* ===============================
            VIEW
    =============================== */

    const handleView = (shop) => {

        setSelectedShop(shop);

        setShowModal(true);

    };

    return (

        <div className="adminP-page">
            {/* ===============================
                    HEADER
            =============================== */}

            <div className="adminP-header">

                <div className="adminP-headerLeft">

                    <button
                        className="adminP-backBtn"
                        onClick={() => navigate("/admindashboard")}
                    >
                        ← Dashboard
                    </button>

                    <div>

                        <h1>Pending Shop Requests</h1>

                        <p>
                            Review, approve or reject newly registered shops.
                        </p>

                    </div>

                </div>

            </div>

            {/* ===============================
                    CARDS
            =============================== */}

            <div className="adminP-cardGrid">

                <div className="adminP-card">

                    <div className="adminP-cardIcon purple">

                        <Store size={28} />

                    </div>

                    <div>

                        <h2>{stats.total}</h2>

                        <span>Total Requests</span>

                    </div>

                </div>

                <div className="adminP-card">

                    <div className="adminP-cardIcon orange">

                        <Clock3 size={28} />

                    </div>

                    <div>

                        <h2>

                            {
                                stats.pending
                            }

                        </h2>

                        <span>Pending</span>

                    </div>

                </div>

                <div className="adminP-card">

                    <div className="adminP-cardIcon green">

                        <CheckCircle size={28} />

                    </div>

                    <div>

                        <h2>

                            {
                                stats.approved
                            }

                        </h2>

                        <span>Approved</span>

                    </div>

                </div>

                <div className="adminP-card">

                    <div className="adminP-cardIcon red">

                        <XCircle size={28} />

                    </div>

                    <div>

                        <h2>

                            {
                                stats.rejected
                            }

                        </h2>

                        <span>Rejected</span>

                    </div>

                </div>

            </div>

            {/* ===============================
                    SEARCH
            =============================== */}

            <div className="adminP-toolbar">

                <div className="adminP-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search Shop..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                {/* <select
                    className="adminP-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >

                    <option value="All">All</option>

                    <option value="Pending">Pending</option>

                    <option value="Approved">Approved</option>

                    <option value="Rejected">Rejected</option>

                </select> */}

            </div>

            {/* ===============================
                    TABLE
            =============================== */}

            <div className="adminP-tableCard">

                <table className="adminP-table">

                    <thead>

                        <tr>

                            <th>Shop</th>

                            <th>Owner</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Status</th>

                            <th>Registered</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="adminP-loading"
                                    >

                                        Loading...

                                    </td>

                                </tr>

                                :

                                paginatedShops.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="adminP-loading"
                                        >

                                            No Pending Shops

                                        </td>

                                    </tr>

                                    :

                                    paginatedShops.map((shop) => (

                                        <tr key={shop._id}>

                                            <td>

                                                {shop.shopname}

                                            </td>

                                            <td>

                                                {shop.ownername}

                                            </td>

                                            <td>

                                                {shop.shopUserId?.email}

                                            </td>

                                            <td>

                                                {shop.shopUserId?.number}

                                            </td>

                                            <td>

                                                <span
                                                    className={`adminP-badge ${shop.adminapproval.toLowerCase()}`}
                                                >

                                                    {shop.adminapproval}

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
                                                    className="adminP-viewBtn"
                                                    onClick={() => handleView(shop)}
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

                <div className="adminP-pagination">

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
                                        ? "adminP-pageActive"
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
                    VIEW MODAL
            =============================== */}

            {

                showModal &&

                selectedShop &&

                <div className="adminP-modalOverlay">

                    <div className="adminP-modal">

                        <div className="adminP-modalHeader">

                            <h2>

                                {selectedShop.shopname}

                            </h2>

                            <button
                                className="adminP-closeBtn"
                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedShop(null);

                                }}
                            >

                                ✕

                            </button>

                        </div>

                        <div className="adminP-modalBody">

                            <div className="adminP-infoRow">

                                <span>Owner</span>

                                <strong>

                                    {selectedShop.ownername}

                                </strong>

                            </div>

                            <div className="adminP-infoRow">

                                <span>Email</span>

                                <strong>

                                    {selectedShop.shopUserId.email}

                                </strong>

                            </div>

                            <div className="adminP-infoRow">

                                <span>Phone</span>

                                <strong>

                                    {selectedShop.shopUserId.number}

                                </strong>

                            </div>

                            <div className="adminP-infoRow">

                                <span>Address</span>

                                <strong>

                                    {selectedShop.address}

                                </strong>

                            </div>

                            <div className="adminP-infoRow">

                                <span>Registered</span>

                                <strong>

                                    {

                                        new Date(selectedShop.createdAt)
                                            .toLocaleDateString("en-GB")

                                    }

                                </strong>

                            </div>

                            <div className="adminP-infoRow">

                                <span>Status</span>

                                <strong>

                                    {selectedShop.adminapproval}

                                </strong>

                            </div>

                        </div>

                        <div className="adminP-modalFooter">

                            {

                                selectedShop.adminapproval === "Pending" &&

                                <>

                                    <button
                                        className="adminP-rejectBtn"
                                        onClick={() =>
                                            handleReject(selectedShop._id)
                                        }
                                    >

                                        Reject

                                    </button>

                                    <button
                                        className="adminP-approveBtn"
                                        onClick={() =>
                                            handleApprove(selectedShop._id)
                                        }
                                    >

                                        Approve

                                    </button>

                                </>

                            }

                            {

                                selectedShop.adminapproval !== "Pending" &&

                                <button
                                    className="adminP-closeModalBtn"
                                    onClick={() => {

                                        setShowModal(false);

                                        setSelectedShop(null);

                                    }}
                                >

                                    Close

                                </button>

                            }

                        </div>

                    </div>

                </div>

            }

        </div>

    );

}