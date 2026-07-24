// // src/pages/dashboard/Profile.jsx

// import { useEffect, useState } from "react";
// import { getProfile, updateProfile } from "../../api/userApi";
// import "../../styles/Profile.css";

// export default function Profile() {
//   const [profile, setProfile] = useState(null);
//   const [editing, setEditing] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     number: "",
//     gender: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const loadProfile = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await getProfile();

//       const data = res.data.userprofile;

//       setProfile(data);

//       setForm({
//         name: data.name || "",
//         number: data.number || "",
//         gender: data.gender || "",
//       });

//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//         "Could not load profile."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         setMessage("");
//       }, 2000);

//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     setSaving(true);
//     setError("");
//     setMessage("");

//     try {

//       const res = await updateProfile(form);

//       const updatedUser =
//         res.data.updatedprofile || res.data.userprofile;

//       setProfile(updatedUser);

//       const { accessToken, user } = res.data;

//       localStorage.setItem("accessToken", accessToken); // new
//       localStorage.setItem("user", JSON.stringify(user)); // new user 

//       setEditing(false);

//       setMessage("Profile updated successfully.");

//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//         "Could not update profile."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <p className="empty-state">
//         Loading profile...
//       </p>
//     );
//   }

//   if (!profile) {
//     return (
//       <p className="empty-state">
//         {error || "Profile not found."}
//       </p>
//     );
//   }

//   return (
//     <div className="profile-container">

//       <h1 className="dash-heading">
//         My Profile
//       </h1>

//       <p className="dash-subheading">
//         Manage your account information.
//       </p>

//       {message && (
//         <p className="auth-success">
//           {message}
//         </p>
//       )}

//       {error && (
//         <p className="auth-error">
//           {error}
//         </p>
//       )}

//       {!editing ? (

//         <div className="profile-card">

//           <div className="profile-top">

//             <div className="profile-avatar">
//               {profile.name?.charAt(0).toUpperCase()}
//             </div>

//             <div className="profile-user">
//               <h2>{profile.name}</h2>
//               <p>{profile.email}</p>
//             </div>

//           </div>

//           <div className="profile-details">

//             <div className="profile-row">
//               <span>📧 Email</span>
//               <strong>{profile.email}</strong>
//             </div>

//             <div className="profile-row">
//               <span>📱 Mobile</span>
//               <strong>{profile.number}</strong>
//             </div>

//             <div className="profile-row">
//               <span>👤 Gender</span>
//               <strong>{profile.gender}</strong>
//             </div>

//           </div>

//           <button
//             className="btn-primary profile-btn"
//             onClick={() => setEditing(true)}
//           >
//             Edit Profile
//           </button>

//         </div>

//       ) : (

//         <form
//           className="profile-form"
//           onSubmit={handleSave}
//         >

//           <div className="dash-field">

//             <label>Name</label>

//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//             />

//           </div>

//           <div className="dash-field">

//             <label>Mobile Number</label>

//             <input
//               type="text"
//               name="number"
//               value={form.number}
//               onChange={handleChange}
//               required
//             />

//           </div>

//           <div className="dash-field">

//             <label>Gender</label>

//             <select
//               name="gender"
//               value={form.gender}
//               onChange={handleChange}
//             >
//               <option value="">
//                 Select Gender
//               </option>

//               <option value="male">
//                 Male
//               </option>

//               <option value="female">
//                 Female
//               </option>

//               <option value="other">
//                 Other
//               </option>

//             </select>

//           </div>

//           <div className="dash-field">

//             <label>Email</label>

//             <input
//               type="email"
//               value={profile.email}
//               disabled
//             />

//           </div>

//           <p className="profile-note">
//             Email cannot be changed.
//           </p>

//           <div className="profile-actions">

//             <button
//               className="btn-primary"
//               type="submit"
//               disabled={saving}
//             >
//               {saving
//                 ? "Saving..."
//                 : "Save Changes"}
//             </button>

//             <button
//               type="button"
//               className="dash-logout-btn"
//               onClick={() => {
//                 setEditing(false);

//                 setForm({
//                   name: profile.name,
//                   number: profile.number,
//                   gender: profile.gender,
//                 });
//               }}
//             >
//               Cancel
//             </button>

//           </div>

//         </form>

//       )}

//     </div>
//   );
// }

// src/pages/dashboard/Profile.jsx

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/userApi";
import "../../styles/Profile.css";

export default function Profile() {

  const [profile, setProfile] = useState(null);

  const [editing, setEditing] = useState(false);
  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [form, setForm] = useState({
    name: "",
    number: "",
    gender: "",
  });

  const [shopForm, setShopForm] = useState({
    shopname: "",
    address: "",
    openingTime: "",
    closingTime: "",
    workingDays: [],
    genderCategory: "",
    photo: ""
  });

  // const [shopImage, setShopImage] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const isShopOwner = user?.role === "shopowner";

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const loadProfile = async () => {

    setLoading(true);

    setError("");

    try {

      const res = await getProfile();

      const data = res.data.userprofile;

      setProfile(data);

      setForm({
        name: data.name || "",
        number: data.number || "",
        gender: data.gender || "",
      });

      const shop = data.shop?.[0];

      if (shop) {

        setShopForm({
          shopname: shop.shopname || "",
          address: shop.address || "",
          openingTime: shop.openingTime || "",
          closingTime: shop.closingTime || "",
          workingDays: shop.workingDays || [],
          genderCategory: shop.genderCategory || "",
          photo: shop.photo || "",
        });

      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Could not load profile."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {

    if (message) {

      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);

      return () => clearTimeout(timer);

    }

  }, [message]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleShopChange = (e) => {

    setShopForm({
      ...shopForm,
      [e.target.name]: e.target.value,
    });

  };


  const handleShopImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setShopForm(prev => ({
      ...prev,
      photo: file
    }));

  };



  const toggleWorkingDay = (day) => {
    setShopForm((prev) => {

      const updated = prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];

      return {
        ...prev,
        workingDays: updated.sort(
          (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
        ),
      };
    });
  };

  const handleSave = async (e) => {

    e.preventDefault();

    setSaving(true);

    setError("");

    setMessage("");

    try {

      const payload = isShopOwner
        ? {
          ...form,
          shop: shopForm
        }
        : form;

      const res = await updateProfile(payload);

      const updatedUser =
        res.data.updatedprofile ||
        res.data.userprofile;

      setProfile(updatedUser);

      if (updatedUser.shop) {

        const shop = updatedUser.shop?.[0];

        if (shop) {

          setShopForm({
            shopname: shop.shopname || "",
            address: shop.address || "",
            openingTime: shop.openingTime || "",
            closingTime: shop.closingTime || "",
            workingDays: shop.workingDays || [],
            genderCategory: shop.genderCategory || "",
            photo: shop.photo || "",
          });

        }

      }

      setForm({

        name: updatedUser.name || "",

        number: updatedUser.number || "",

        gender: updatedUser.gender || "",

      });

      if (res.data.accessToken) {

        localStorage.setItem(
          "accessToken",
          res.data.accessToken
        );

      }

      if (res.data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

      }

      setEditing(false);

      setMessage("Profile updated successfully.");

    } catch (err) {

      setError(

        err.response?.data?.message ||

        "Could not update profile."

      );

    } finally {

      setSaving(false);

    }

  };

  if (loading) {

    return (
      <p className="empty-state">
        Loading profile...
      </p>
    );

  }

  if (!profile) {

    return (
      <p className="empty-state">
        {error || "Profile not found."}
      </p>
    );

  }

  return (

    <div className="profile-container">

      <h1 className="dash-heading">
        My Profile
      </h1>

      <p className="dash-subheading">
        Manage your account information.
      </p>

      {message && (
        <p className="auth-success">
          {message}
        </p>
      )}

      {error && (
        <p className="auth-error">
          {error}
        </p>
      )}

      {!editing ? (
        isShopOwner ? (

          <div className="profile-card">

            <div className="profile-top">

              <div className="profile-shop-avatar">

                {profile.shop?.[0]?.photo ? (

                  <img
                    src={profile.shop?.[0]?.photo}
                    alt={profile.shop?.[0]?.shopname}
                    className="profile-shop-avatar-img"
                  />

                ) : (

                  <div className="profile-avatar">
                    {(profile.shop?.[0]?.shopname || profile.name)
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                )}

              </div>

              <div className="profile-user">

                <h2>
                  {profile.shop?.[0]?.shopname}
                </h2>

                <p>
                  {profile.email}
                </p>

              </div>

            </div>

            <div className="profile-details">

              <div className="profile-row">
                <span>🏪 Shop Name</span>
                <strong>{profile.shop?.[0]?.shopname}</strong>
              </div>

              <div className="profile-row">
                <span>👤 Owner</span>
                <strong>{profile.name}</strong>
              </div>

              <div className="profile-row">
                <span>📧 Email</span>
                <strong>{profile.email}</strong>
              </div>

              <div className="profile-row">
                <span>📱 Mobile</span>
                <strong>{profile.number}</strong>
              </div>

              <div className="profile-row">

                <span>👤 Gender</span>

                <strong>{profile.gender}</strong>

              </div>

              <div className="profile-row">
                <span>📍 Address</span>
                <strong>{profile.shop?.[0]?.address}</strong>
              </div>

              <div className="profile-row">
                <span>🕒 Opening Time</span>
                <strong>{profile.shop?.[0]?.openingTime}</strong>
              </div>

              <div className="profile-row">
                <span>🕒 Closing Time</span>
                <strong>{profile.shop?.[0]?.closingTime}</strong>
              </div>

              <div className="profile-row">
                <span>📅 Working Days</span>
                <strong>
                  {profile.shop?.[0]?.workingDays?.join(", ")}
                </strong>
              </div>

              <div className="profile-row">
                <span>🚻 Category</span>
                <strong>{profile.shop?.[0]?.genderCategory}</strong>
              </div>

            </div>

            <button
              className="btn-primary profile-btn"
              onClick={() => setEditing(true)}
            >
              Edit Shop
            </button>

          </div>

        ) : (

          <div className="profile-card">

            <div className="profile-top">

              <div className="profile-avatar">
                {profile.name?.charAt(0).toUpperCase()}
              </div>

              <div className="profile-user">

                <h2>{profile.name}</h2>

                <p>{profile.email}</p>

              </div>

            </div>

            <div className="profile-details">
              <div className="profile-row">

                <span>📧 Email</span>

                <strong>{profile.email}</strong>

              </div>

              <div className="profile-row">

                <span>📱 Mobile</span>

                <strong>{profile.number}</strong>

              </div>

              <div className="profile-row">

                <span>👤 Gender</span>

                <strong>{profile.gender}</strong>

              </div>

            </div>

            <button
              className="btn-primary profile-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>

          </div>

        )

      ) : (

        isShopOwner ? (

          <form
            className="profile-form"
            onSubmit={handleSave}
          >

            <div className="dash-field">

              <div className="dash-field">

                <label>Shop Image</label>

                <div className="shop-image-upload">

                  <img
                    src={
                      shopForm.photo instanceof File
                        ? URL.createObjectURL(shopForm.photo)
                        : shopForm.photo
                    }
                    alt="Shop"
                    className="shop-preview"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleShopImageChange}
                  />

                </div>

              </div>

              <label>Owner Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>

            <div className="dash-field">

              <label>Mobile Number</label>

              <input
                type="text"
                name="number"
                value={form.number}
                onChange={handleChange}
                required
              />

            </div>

            <div className="dash-field">

              <label>Gender</label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

            </div>

            <div className="dash-field">

              <label>Email</label>

              <input
                type="email"
                value={profile.email}
                disabled
              />

            </div>

            <hr style={{ margin: "20px 0" }} />

            <div className="dash-field">

              <label>Shop Name</label>

              <input
                type="text"
                name="shopname"
                value={shopForm.shopname}
                onChange={handleShopChange}
                required
              />

            </div>

            <div className="dash-field">

              <label>Address</label>

              <textarea
                name="address"
                rows={3}
                value={shopForm.address}
                onChange={handleShopChange}
                required
              />

            </div>

            <div className="time-grid">

              <div className="dash-field">

                <label>Opening Time</label>

                <input
                  type="time"
                  name="openingTime"
                  value={shopForm.openingTime}
                  onChange={handleShopChange}
                />

              </div>

              <div className="dash-field">

                <label>Closing Time</label>

                <input
                  type="time"
                  name="closingTime"
                  value={shopForm.closingTime}
                  onChange={handleShopChange}
                />

              </div>

            </div>

            <div className="dash-field">

              <label>Gender Category</label>

              <select
                name="genderCategory"
                value={shopForm.genderCategory}
                onChange={handleShopChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unisex">Unisex</option>
              </select>

            </div>

            <div className="dash-field">

              <label>Working Days</label>

              <div className="pill-row">

                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (

                  <button
                    key={day}
                    type="button"
                    className={`pill ${shopForm.workingDays.includes(day)
                      ? "active"
                      : ""
                      }`}
                    onClick={() => toggleWorkingDay(day)}
                  >
                    {day}
                  </button>

                ))}

              </div>

            </div>

            <div className="profile-actions">

              <button
                className="btn-primary"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                className="dash-logout-btn"

                style={{
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#b91c1c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc2626";
                }}


                onClick={() => {

                  setEditing(false);

                  setForm({
                    name: profile.name || "",
                    number: profile.number || "",
                    gender: profile.gender || "",
                  });

                  const shop = profile.shop?.[0];

                  setShopForm({
                    shopname: shop?.shopname || "",
                    address: shop?.address || "",
                    openingTime: shop?.openingTime || "",
                    closingTime: shop?.closingTime || "",
                    workingDays: [...(shop.workingDays || [])].sort(
                      (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
                    ), genderCategory: shop?.genderCategory || "",
                    photo: shop?.photo || "",
                  });

                }}
              >
                Cancel
              </button>

            </div>

          </form>

        ) : (
          <form
            className="profile-form"
            onSubmit={handleSave}
          >

            <div className="dash-field">

              <label>Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>

            <div className="dash-field">

              <label>Mobile Number</label>

              <input
                type="text"
                name="number"
                value={form.number}
                onChange={handleChange}
                required
              />

            </div>

            <div className="dash-field">

              <label>Gender</label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >

                <option value="">
                  Select Gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>

              </select>

            </div>

            <div className="dash-field">

              <label>Email</label>

              <input
                type="email"
                value={profile.email}
                disabled
              />

            </div>

            <p className="profile-note">
              Email cannot be changed.
            </p>

            <div className="profile-actions">

              <button
                className="btn-primary"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                className="dash-logout-btn"
                onClick={() => {

                  setEditing(false);

                  setForm({

                    name: profile.name || "",

                    number: profile.number || "",

                    gender: profile.gender || "",

                  });

                }}
              >
                Cancel
              </button>

            </div>

          </form>

        )

      )}

    </div>

  );

}


