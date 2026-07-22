// src/pages/dashboard/Profile.jsx

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/userApi";
import "../../styles/Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    number: "",
    gender: "",
  });

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

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {

      const res = await updateProfile(form);

      const updatedUser =
        res.data.updatedprofile || res.data.userprofile;

      setProfile(updatedUser);

      const { accessToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken); // new
      localStorage.setItem("user", JSON.stringify(user)); // new user 

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
                  name: profile.name,
                  number: profile.number,
                  gender: profile.gender,
                });
              }}
            >
              Cancel
            </button>

          </div>

        </form>

      )}

    </div>
  );
}