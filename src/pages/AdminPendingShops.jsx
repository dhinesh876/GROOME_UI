// // import "../styles/AdminpendingShops.css";

// const AdminPendingShops = ({
//     shops = [],
//     handleApprove,
//     handleReject,
//     handleView,
// }) => {
//     return (
//         <div className="adminP-page">

//             <div className="adminP-header">

//                 <div>
//                     <h1 className="adminP-title">
//                         Shop Approval Requests
//                     </h1>

//                     <p className="adminP-subtitle">
//                         Review new salon registrations and approve or reject them.
//                     </p>
//                 </div>

//                 <div className="adminP-count">
//                     Pending : {shops.length}
//                 </div>

//             </div>

//             {shops.length === 0 ? (

//                 <div className="adminP-empty">

//                     <h2>No Pending Shops</h2>

//                     <p>
//                         All shop requests have been reviewed.
//                     </p>

//                 </div>

//             ) : (

//                 <div className="adminP-grid">

//                     {shops.map((shop) => (

//                         <div
//                             key={shop._id}
//                             className="adminP-card"
//                         >

//                             <div className="adminP-imageBox">

//                                 <img
//                                     src={shop.photo}
//                                     alt={shop.shopname}
//                                     className="adminP-image"
//                                 />

//                                 <span className="adminP-status">
//                                     Pending
//                                 </span>

//                             </div>

//                             <div className="adminP-content">

//                                 <h2 className="adminP-shopName">
//                                     {shop.shopname}
//                                 </h2>

//                                 <div className="adminP-details">

//                                     <div className="adminP-row">
//                                         <span>Owner</span>
//                                         <strong>{shop.ownername}</strong>
//                                     </div>

//                                     <div className="adminP-row">
//                                         <span>Email</span>
//                                         <strong>{shop.email}</strong>
//                                     </div>

//                                     <div className="adminP-row">
//                                         <span>Phone</span>
//                                         <strong>{shop.number}</strong>
//                                     </div>

//                                     <div className="adminP-row">
//                                         <span>Gender</span>
//                                         <strong>{shop.genderCategory}</strong>
//                                     </div>

//                                     <div className="adminP-row">
//                                         <span>Timing</span>
//                                         <strong>
//                                             {shop.openingTime} - {shop.closingTime}
//                                         </strong>
//                                     </div>

//                                     <div className="adminP-row">
//                                         <span>Address</span>
//                                         <strong>{shop.address}</strong>
//                                     </div>

//                                     <div className="adminP-row">
//                                         <span>Working Days</span>

//                                         <div className="adminP-days">

//                                             {shop.workingDays?.map((day) => (

//                                                 <span
//                                                     key={day}
//                                                     className="adminP-day"
//                                                 >
//                                                     {day}
//                                                 </span>

//                                             ))}

//                                         </div>

//                                     </div>

//                                 </div>

//                                 <div className="adminP-actions">

//                                     <button
//                                         className="adminP-viewBtn"
//                                         onClick={() => handleView(shop)}
//                                     >
//                                         👁 View Details
//                                     </button>

//                                     <button
//                                         className="adminP-approveBtn"
//                                         onClick={() => handleApprove(shop._id)}
//                                     >
//                                         ✔ Approve
//                                     </button>

//                                     <button
//                                         className="adminP-rejectBtn"
//                                         onClick={() => handleReject(shop._id)}
//                                     >
//                                         ✖ Reject
//                                     </button>

//                                 </div>

//                             </div>

//                         </div>

//                     ))}

//                 </div>

//             )}

//         </div>
//     );
// };

// export default AdminPendingShops;


import "../styles/AdminpendingShops.css";

const AdminPendingShops = ({
    shops = [],
    handleApprove,
    handleReject,
    handleView,
}) => {
    return (
        <div className="adminP-page">

            <div className="adminP-header">

                <div>
                    <h1 className="adminP-title">
                        Shop Approval Requests
                    </h1>

                    <p className="adminP-subtitle">
                        Review new salon registrations and approve or reject them.
                    </p>
                </div>

                <div className="adminP-count">
                    Pending : {shops.length}
                </div>

            </div>

            {shops.length === 0 ? (

                <div className="adminP-empty">

                    <h2>No Pending Shops</h2>

                    <p>
                        All shop requests have been reviewed.
                    </p>

                </div>

            ) : (

                <div className="adminP-grid">

                    {shops.map((shop) => (

                        <div
                            key={shop._id}
                            className="adminP-card"
                        >

                            <div className="adminP-imageBox">

                                <img
                                    src={shop.photo}
                                    alt={shop.shopname}
                                    className="adminP-image"
                                />

                                <span className="adminP-status">
                                    Pending
                                </span>

                            </div>

                            <div className="adminP-content">

                                <h2 className="adminP-shopName">
                                    {shop.shopname}
                                </h2>

                                <div className="adminP-details">

                                    <div className="adminP-row">
                                        <span>Owner</span>
                                        <strong>{shop.ownername}</strong>
                                    </div>

                                    <div className="adminP-row">
                                        <span>Email</span>
                                        <strong>{shop.email}</strong>
                                    </div>

                                    <div className="adminP-row">
                                        <span>Phone</span>
                                        <strong>{shop.number}</strong>
                                    </div>

                                    <div className="adminP-row">
                                        <span>Gender</span>
                                        <strong>{shop.genderCategory}</strong>
                                    </div>

                                    <div className="adminP-row">
                                        <span>Timing</span>
                                        <strong>
                                            {shop.openingTime} - {shop.closingTime}
                                        </strong>
                                    </div>

                                    <div className="adminP-row">
                                        <span>Address</span>
                                        <strong>{shop.address}</strong>
                                    </div>

                                    <div className="adminP-row">
                                        <span>Working Days</span>

                                        <div className="adminP-days">

                                            {shop.workingDays?.map((day) => (

                                                <span
                                                    key={day}
                                                    className="adminP-day"
                                                >
                                                    {day}
                                                </span>

                                            ))}

                                        </div>

                                    </div>

                                </div>

                                <div className="adminP-actions">

                                    <button
                                        className="adminP-viewBtn"
                                        onClick={() => handleView(shop)}
                                    >
                                        👁 View Details
                                    </button>

                                    <button
                                        className="adminP-approveBtn"
                                        onClick={() => handleApprove(shop._id)}
                                    >
                                        ✔ Approve
                                    </button>

                                    <button
                                        className="adminP-rejectBtn"
                                        onClick={() => handleReject(shop._id)}
                                    >
                                        ✖ Reject
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default AdminPendingShops;