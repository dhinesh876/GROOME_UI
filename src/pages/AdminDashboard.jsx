
// import { useEffect, useState } from "react";
// import "../styles/AdminDashboard.css";

// import {
//     Bell,
//     CalendarDays,
//     Clock,
//     LayoutDashboard,
//     LogOut,
//     Scissors,
//     Settings,
//     Star,
//     Store,
//     UserCog,
//     Users,
// } from "lucide-react";

// import { getDashboard } from "../api/adminApi";

// const AdminDashboard = () => {

//     const [dashboard, setDashboard] = useState({
//         totalShops: 0,
//         pendingShops: 0,
//         totalCustomers: 0,
//         totalAppointments: 0,
//         recentPending: []
//     });
//     const loadDashboard = async () => {

//         try {

//             const res = await getDashboard();

//             //console.log(res); // Check this

//             if (res.data.success) {
//                 setDashboard(res.data.dashboard);
//             }

//         } catch (err) {
//             //console.log(err);
//         }

//     };

//     useEffect(() => {
//         loadDashboard();
//     }, []);

//     const cards = [
//         {
//             title: "Total Shops",
//             value: dashboard.totalShops,
//             icon: <Store size={28} />,
//             color: "purple",
//         },
//         {
//             title: "Pending Shops",
//             value: dashboard.pendingShops,
//             icon: <Clock size={28} />,
//             color: "orange",
//         },
//         {
//             title: "Customers",
//             value: dashboard.totalCustomers,
//             icon: <Users size={28} />,
//             color: "blue",
//         },
//         {
//             title: "Appointments",
//             value: dashboard.totalAppointments,
//             icon: <CalendarDays size={28} />,
//             color: "green",
//         },
//     ];

//     return (
//         <div className="adminD-page">

//             {/* Sidebar */}

//             <aside className="adminD-sidebar">

//                 <div>

//                     <div className="adminD-logo">

//                         <div className="adminD-logoIcon">
//                             G
//                         </div>

//                         <div>

//                             <h2>Groome</h2>

//                             <span>Admin Panel</span>

//                         </div>

//                     </div>

//                     {/* <nav className="adminD-nav">

//                         <button className="adminD-navItem adminD-active">
//                             <LayoutDashboard size={20} />
//                             Dashboard
//                         </button>

//                         <button className="adminD-navItem">
//                             <Clock size={20} />
//                             Pending Shops
//                         </button>

//                         <button className="adminD-navItem">
//                             <Store size={20} />
//                             Approved Shops
//                         </button>

//                         <button className="adminD-navItem">
//                             <Users size={20} />
//                             Customers
//                         </button>

//                         <button className="adminD-navItem">
//                             <UserCog size={20} />
//                             Shop Owners
//                         </button>

//                         <button className="adminD-navItem">
//                             <CalendarDays size={20} />
//                             Appointments
//                         </button>

//                         <button className="adminD-navItem">
//                             <Scissors size={20} />
//                             Services
//                         </button>

//                         <button className="adminD-navItem">
//                             <Star size={20} />
//                             Reviews
//                         </button>

//                         <button className="adminD-navItem">
//                             <Bell size={20} />
//                             Notifications
//                         </button>

//                         <button className="adminD-navItem">
//                             <Settings size={20} />
//                             Settings
//                         </button>

//                     </nav> */}

//                     <nav className="adminD-nav">

//                         <button className="adminD-navItem adminD-active">
//                             <LayoutDashboard size={20} />
//                             <span>Dashboard</span>
//                         </button>

//                         <button className="adminD-navItem">
//                             <Clock size={20} />
//                             <span>Pending Shops</span>
//                         </button>

//                         <button className="adminD-navItem">
//                             <Store size={20} />
//                             <span>Approved Shops</span>
//                         </button>

//                         <button className="adminD-navItem">
//                             <Users size={20} />
//                             <span>Customers</span>
//                         </button>

//                         <button className="adminD-navItem">
//                             <UserCog size={20} />
//                             <span>Shop Owners</span>
//                         </button>

//                         <button className="adminD-navItem">
//                             <CalendarDays size={20} />
//                             <span>Appointments</span>
//                         </button>

//                         <button className="adminD-navItem">
//                             <Scissors size={20} />
//                             <span>Services</span>
//                         </button>

//                         <button className="adminD-navItem">
//                             <Star size={20} />
//                             <span>Reviews</span>
//                         </button>

//                         <button className="adminD-navItem">
//                             <Bell size={20} />
//                             <span>Notifications</span>
//                         </button>

//                         <button className="adminD-navItem">
//                             <Settings size={20} />
//                             <span>Settings</span>
//                         </button>

//                     </nav>

//                 </div>
//             </aside>

//             {/* Main */}

//             <main className="adminD-main">

//                 {/* Header */}

//                 <div className="adminD-header">

//                     <div>

//                         <h1>
//                             Dashboard
//                         </h1>

//                         <p>
//                             Welcome back Administrator 👋
//                         </p>

//                     </div>
//                     <div className="adminD-profile">

//                         <img
//                             src="https://ui-avatars.com/api/?name=Admin"
//                             alt="Admin"
//                         />

//                         <div className="adminD-profileInfo">
//                             <h4>Administrator</h4>
//                             <span>Super Admin</span>
//                         </div>

//                         <button className="adminD-headerLogout">
//                             <LogOut size={18} />
//                             Logout
//                         </button>

//                     </div>

//                 </div>

//                 {/* Cards */}

//                 <div className="adminD-cardGrid">

//                     {cards.map((card) => (

//                         <div
//                             className="adminD-card"
//                             key={card.title}
//                         >

//                             <div
//                                 className={`adminD-cardIcon ${card.color}`}
//                             >

//                                 {card.icon}

//                             </div>

//                             <div>

//                                 <h2>{card.value}</h2>

//                                 <p>{card.title}</p>

//                             </div>

//                         </div>

//                     ))}

//                 </div>

//                 {/* Pending Shops */}

//                 <div className="adminD-section">

//                     <div className="adminD-sectionHeader">

//                         <h2>
//                             Recent Pending Shops
//                         </h2>

//                         <button className="adminD-viewAll">
//                             View All
//                         </button>

//                     </div>

//                     <table className="adminD-table">

//                         <thead>

//                             <tr>

//                                 <th>Shop</th>

//                                 <th>Owner</th>

//                                 <th>Address</th>

//                                 <th>Status</th>

//                                 <th>Action</th>

//                             </tr>

//                         </thead>

//                         <tbody>

//                             {dashboard.recentPending.map((shop) => (

//                                 <tr key={shop._id}>

//                                     <td>{shop.shopname}</td>

//                                     <td>{shop.ownername}</td>

//                                     <td>{shop.address}</td>

//                                     <td>
//                                         <span className="adminD-badge">
//                                             {shop.adminapproval}
//                                         </span>
//                                     </td>

//                                     <td>

//                                         <button className="adminD-btnView">
//                                             View
//                                         </button>

//                                     </td>

//                                 </tr>

//                             ))}

//                         </tbody>

//                     </table>

//                 </div>

//             </main>

//         </div>
//     );
// };

// export default AdminDashboard;



import {
    Bell,
    CalendarDays,
    Clock,
    LayoutDashboard,
    LogOut,
    Scissors,
    Settings,
    Star,
    Store,
    UserCog,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";


import { getDashboard } from "../api/adminApi";

const AdminDashboard = () => {


    const navigate = useNavigate();

    // const location = useLocation();

    // //console.log(location.state?.shopId);
    const [dashboard, setDashboard] = useState({
        totalShops: 0,
        pendingShops: 0,
        totalCustomers: 0,
        totalAppointments: 0,
        recentPending: []
    });
    const loadDashboard = async () => {

        try {

            const res = await getDashboard();

            if (res.data.success) {
                setDashboard(res.data.dashboard);
            }

        } catch (err) {
            //console.log(err);
        }

    };

    useEffect(() => {
        loadDashboard();
    }, []);

    // Scopes the purple scrollbar theme (see AdminDashboard.css) to only
    // while this page is mounted, so it doesn't bleed onto other pages
    // like the Shop Owner Dashboard once this stylesheet has loaded.
    useEffect(() => {
        document.body.classList.add("adminD-scrollbar-theme");
        return () => {
            document.body.classList.remove("adminD-scrollbar-theme");
        };
    }, []);

    // const cards = [
    //     {
    //         title: "Total Shops",
    //         value: dashboard.totalShops,
    //         icon: <Store size={28} />,
    //         color: "purple",
    //     },
    //     {
    //         title: "Pending Shops",
    //         value: dashboard.pendingShops,
    //         icon: <Clock size={28} />,
    //         color: "orange",
    //     },
    //     {
    //         title: "Customers",
    //         value: dashboard.totalCustomers,
    //         icon: <Users size={28} />,
    //         color: "blue",
    //     },
    //     {
    //         title: "Appointments",
    //         value: dashboard.totalAppointments,
    //         icon: <CalendarDays size={28} />,
    //         color: "green",
    //     },
    // ];

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("city");
        navigate("/login");
    };

    const cards = [
        {
            title: "Total Shops",
            value: dashboard.totalShops,
            icon: <Store size={28} />,
            color: "purple",
            path: "/admin/approved-shops"
        },
        {
            title: "Pending Shops",
            value: dashboard.pendingShops,
            icon: <Clock size={28} />,
            color: "orange",
            path: "/admin/pending-shops"
        },
        {
            title: "Customers",
            value: dashboard.totalCustomers,
            icon: <Users size={28} />,
            color: "blue",
            path: "/admin/customers"
        },
        {
            title: "Appointments",
            value: dashboard.totalAppointments,
            icon: <CalendarDays size={28} />,
            color: "green",
            path: "/admin/appointments"
        }
    ];
    return (
        <div className="adminD-page">

            {/* Sidebar */}

            <aside className="adminD-sidebar">

                <div>

                    <div className="adminD-logo">

                        <div className="adminD-logoIcon">
                            G
                        </div>

                        <div>

                            <h2>Groome</h2>

                            <span>Admin Panel</span>

                        </div>

                    </div>

                    <nav className="adminD-nav">

                        <button className="adminD-navItem adminD-active">
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </button>
                        {/* 
                        <button className="adminD-navItem">
                            <Clock size={20} />
                            <span>Pending Shops</span>
                        </button> */}


                        <button
                            className="adminD-navItem"
                            onClick={() => navigate("/admin/pending-shops")}
                        >
                            <Clock size={20} />
                            <span>Pending Shops</span>
                        </button>

                        <button className="adminD-navItem"
                            onClick={() => navigate("/admin/approved-shops")}
                        >
                            <Store size={20} />
                            <span>Approved Shops</span>
                        </button>

                        <button className="adminD-navItem"
                            onClick={() => navigate("/admin/customers-shops")}
                        >
                            <Users size={20} />
                            <span>Customers</span>
                        </button>

                        <button className="adminD-navItem"
                            onClick={() => navigate("/admin/shopowner-shops")}>
                            <UserCog size={20} />
                            <span>Shop Owners</span>
                        </button>

                        <button className="adminD-navItem"
                            onClick={() => navigate("/admin/appointments-shops")}>
                            <CalendarDays size={20} />
                            <span>Appointments</span>
                        </button>

                        <button className="adminD-navItem" onClick={() => navigate("/admin/Services-shops")}>
                            <Scissors size={20} />
                            <span>Services</span>
                        </button>

                        <button className="adminD-navItem">
                            <Star size={20} />
                            <span>Reviews</span>
                        </button>

                        <button className="adminD-navItem" >
                            {/* onClick={() => navigate("/admin/notification-shops")} */}
                            <Bell size={20} />
                            <span>Notifications</span>
                        </button>

                        <button className="adminD-navItem">
                            <Settings size={20} />
                            <span>Settings</span>
                        </button>

                    </nav>

                </div>
            </aside>

            {/* Main */}

            <main className="adminD-main">

                {/* Header */}

                <div className="adminD-header">

                    <div>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Welcome back Administrator 👋
                        </p>

                    </div>
                    <div className="adminD-profile">

                        <img
                            src="https://ui-avatars.com/api/?name=Admin"
                            alt="Admin"
                        />

                        <div className="adminD-profileInfo">
                            <h4>Administrator</h4>
                            <span>Super Admin</span>
                        </div>

                        <button className="adminD-headerLogout" onClick={handleLogout}>
                            <LogOut size={18} />
                            Logout
                        </button>

                    </div>

                </div>

                {/* Cards */}

                <div className="adminD-cardGrid">

                    {cards.map((card) => (

                        // <div
                        //     className="adminD-card"
                        //     key={card.title}
                        // >

                        <div
                            key={card.title}
                            className="adminD-card"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(card.path)}

                        >

                            <div
                                className={`adminD-cardIcon ${card.color}`}
                            >

                                {card.icon}

                            </div>

                            <div>

                                <h2>{card.value}</h2>

                                <p>{card.title}</p>

                            </div>

                        </div>

                    ))}

                </div>

                {/* Pending Shops */}

                <div className="adminD-section">

                    <div className="adminD-sectionHeader">

                        <h2>
                            Recent Pending Shops
                        </h2>

                        {/* <button className="adminD-viewAll">
                            View All
                        </button> */}
                        <button
                            className="adminD-viewAll"
                            onClick={() => navigate("/admin/pending-shops")}
                        >
                            View All
                        </button>

                    </div>

                    <table className="adminD-table">

                        <thead>

                            <tr>

                                <th>Shop</th>

                                <th>Owner</th>

                                <th>Address</th>

                                <th>Status</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {dashboard.recentPending.map((shop) => (

                                <tr key={shop._id}>

                                    <td>{shop.shopname}</td>

                                    <td>{shop.ownername}</td>

                                    <td>{shop.address}</td>

                                    <td>
                                        <span className="adminD-badge">
                                            {shop.adminapproval}
                                        </span>
                                    </td>

                                    <td>

                                        {/* <button className="adminD-btnView">
                                            View
                                        </button> */}

                                        <button
                                            className="adminD-btnView"
                                            onClick={() =>
                                                navigate("/admin/pending-shops", {
                                                    state: {
                                                        shopId: shop._id
                                                    }
                                                })
                                            }
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </main>

        </div>
    );
};

export default AdminDashboard;