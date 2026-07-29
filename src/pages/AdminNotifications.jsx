import {
    Bell,

    CheckCircle,
    Clock3,
    Eye,
    Search,

    Trash2
} from "lucide-react";

import {
    useEffect,

    useMemo,

    useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
    deleteNotification,
    getNotifications,

    markNotificationRead
} from "../api/adminApi";

import "../styles/AdminNotifications.css";

export default function AdminNotifications() {

    /* ===============================
        STATES
    =============================== */

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

    const [stats, setStats] = useState({

        totalNotifications: 0,

        unread: 0,

        read: 0

    });

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [selectedNotification, setSelectedNotification] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [page, setPage] = useState(1);

    const pageSize = 10;

    /* ===============================
        LOAD NOTIFICATIONS
    =============================== */

    const loadNotifications = async () => {

        try {

            setLoading(true);

            const res = await getNotifications();

            if (res.data.success) {

                setNotifications(res.data.notifications);

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

        loadNotifications();

    }, []);

    /* ===============================
        MARK READ
    =============================== */

    const handleRead = async (id) => {

        try {

            const res = await markNotificationRead(id);

            if (res.data.success) {

                loadNotifications();

                setShowModal(false);

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    /* ===============================
        DELETE
    =============================== */

    const handleDelete = async (id) => {

        if (!window.confirm("Delete notification?"))

            return;

        try {

            const res = await deleteNotification(id);

            if (res.data.success) {

                loadNotifications();

                setShowModal(false);

            }

        }

        catch (err) {

            //console.log(err);

        }

    };

    /* ===============================
        SEARCH
    =============================== */

    const filteredNotifications = useMemo(() => {

        const keyword = search.toLowerCase();

        return notifications.filter(item =>

            (item.title || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (item.message || "")

                .toLowerCase()

                .includes(keyword)

        );

    }, [

        notifications,

        search

    ]);

    /* ===============================
        PAGINATION
    =============================== */

    const totalPages = Math.ceil(

        filteredNotifications.length / pageSize

    );

    const paginatedNotifications = filteredNotifications.slice(

        (page - 1) * pageSize,

        page * pageSize

    );

    /* ===============================
        VIEW
    =============================== */

    const handleView = (notification) => {

        setSelectedNotification(notification);

        setShowModal(true);

    };

    /* ===============================
    RETURN
=============================== */

    return (

        <div className="adminN-page">

            {/* ===============================
                HEADER
            =============================== */}

            <div className="adminN-header">

                <div className="adminN-headerLeft">

                    <button
                        className="adminN-backBtn"
                        onClick={() => navigate("/admindashboard")}
                    >
                        ← Dashboard
                    </button>

                    <div>

                        <h1>Notifications</h1>

                        <p>

                            Monitor all system notifications.

                        </p>

                    </div>

                </div>

            </div>

            {/* ===============================
                DASHBOARD CARDS
            =============================== */}

            <div className="adminN-cardGrid">

                <div className="adminN-card">

                    <div className="adminN-cardIcon purple">

                        <Bell size={28} />

                    </div>

                    <div>

                        <h2>

                            {stats.totalNotifications}

                        </h2>

                        <span>

                            Total Notifications

                        </span>

                    </div>

                </div>

                <div className="adminN-card">

                    <div className="adminN-cardIcon red">

                        <Clock3 size={28} />

                    </div>

                    <div>

                        <h2>

                            {stats.unread}

                        </h2>

                        <span>

                            Unread

                        </span>

                    </div>

                </div>

                <div className="adminN-card">

                    <div className="adminN-cardIcon green">

                        <CheckCircle size={28} />

                    </div>

                    <div>

                        <h2>

                            {stats.read}

                        </h2>

                        <span>

                            Read

                        </span>

                    </div>

                </div>

            </div>

            {/* ===============================
                SEARCH
            =============================== */}

            <div className="adminN-toolbar">

                <div className="adminN-search">

                    <Search size={18} />

                    <input

                        type="text"

                        placeholder="Search Notifications..."

                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                    />

                </div>

            </div>

            {/* ===============================
                TABLE
            =============================== */}

            <div className="adminN-tableCard">

                <table className="adminN-table">

                    <thead>

                        <tr>

                            <th>Title</th>

                            <th>Message</th>

                            <th>Status</th>

                            <th>Date</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                <tr>

                                    <td

                                        colSpan="5"

                                        className="adminN-loading"

                                    >

                                        Loading...

                                    </td>

                                </tr>

                                :

                                paginatedNotifications.length === 0 ?

                                    <tr>

                                        <td

                                            colSpan="5"

                                            className="adminN-loading"

                                        >

                                            No Notifications Found

                                        </td>

                                    </tr>

                                    :

                                    paginatedNotifications.map(notification => (

                                        <tr key={notification._id}>

                                            <td>

                                                {notification.title}

                                            </td>

                                            <td>

                                                {

                                                    notification.message?.length > 50

                                                        ?

                                                        notification.message.substring(0, 50) + "..."

                                                        :

                                                        notification.message

                                                }

                                            </td>

                                            <td>

                                                <span

                                                    className={`adminN-badge ${notification.status}`}

                                                >

                                                    {notification.status}

                                                </span>

                                            </td>

                                            <td>

                                                {

                                                    new Date(

                                                        notification.createdAt

                                                    ).toLocaleDateString()

                                                }

                                            </td>

                                            <td>

                                                <button

                                                    className="adminN-viewBtn"

                                                    onClick={() =>

                                                        handleView(notification)

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

                <div className="adminN-pagination">

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

                                        ? "adminN-pageActive"

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

                selectedNotification &&

                <div className="adminN-modalOverlay">

                    <div className="adminN-modal">

                        <div className="adminN-modalHeader">

                            <h2>

                                Notification Details

                            </h2>

                            <button

                                className="adminN-closeBtn"

                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedNotification(null);

                                }}

                            >

                                ✕

                            </button>

                        </div>

                        <div className="adminN-modalBody">

                            <div className="adminN-infoRow">

                                <span>

                                    Title

                                </span>

                                <strong>

                                    {selectedNotification.title}

                                </strong>

                            </div>

                            <div className="adminN-infoRow">

                                <span>

                                    Message

                                </span>

                                <strong>

                                    {selectedNotification.message}

                                </strong>

                            </div>

                            <div className="adminN-infoRow">

                                <span>

                                    Status

                                </span>

                                <strong>

                                    {selectedNotification.status}

                                </strong>

                            </div>

                            <div className="adminN-infoRow">

                                <span>

                                    Date

                                </span>

                                <strong>

                                    {

                                        new Date(

                                            selectedNotification.createdAt

                                        ).toLocaleString()

                                    }

                                </strong>

                            </div>

                        </div>

                        <div className="adminN-modalFooter">

                            {

                                selectedNotification.status === "Unread" &&

                                <button

                                    className="adminN-readBtn"

                                    onClick={() =>

                                        handleRead(

                                            selectedNotification._id

                                        )

                                    }

                                >

                                    Mark as Read

                                </button>

                            }

                            <button

                                className="adminN-deleteBtn"

                                onClick={() =>

                                    handleDelete(

                                        selectedNotification._id

                                    )

                                }

                            >

                                <Trash2 size={16} />

                                Delete

                            </button>

                            <button

                                className="adminN-closeModalBtn"

                                onClick={() => {

                                    setShowModal(false);

                                    setSelectedNotification(null);

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