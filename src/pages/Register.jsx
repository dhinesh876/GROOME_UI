// src/pages/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
// import "./Login.css";
import "../styles/Register.css";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    gender: "",
    role: "customer",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {

      setLoading(true);

      await registerUser({
        name: form.name,
        email: form.email,
        number: form.number,
        gender: form.gender,
        role: form.role,
        password: form.password,
      });

      navigate("/verify-email", {
        state: {
          email: form.email
        }
      });

    }
    catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration Failed..."
      );

    }
    finally {

      setLoading(false);

    }

  };

  return (

    <div className="register-page">

      <div className="background-circle circle-one"></div>
      <div className="background-circle circle-two"></div>
      <div className="register-container">

        {/* LEFT */}

        <div className="register-left">

          <div className="brand-logo">
            G
          </div>

          <h1>
            Join <span>Groome</span>
          </h1>

          <p>
            Create your account and enjoy seamless salon booking,
            appointment scheduling and profile management.
          </p>

        </div>

        {/* RIGHT */}

        <div className="register-right">

          <div className="register-card">

            <h2>Create Account</h2>

            <p className="subtitle">
              Register to continue
            </p>

            <form onSubmit={handleSubmit}>

              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="number"
                  placeholder="Enter Mobile Number"
                  value={form.number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Gender</label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

              </div>

              <div className="input-group">
                <label>Role</label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="customer">Customer</option>
                  <option value="shopowner">Shop Owner</option>
                </select>

              </div>

              <div className="input-group">

                <label>Password</label>

                <div className="password-box">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="show-btn"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              <div className="input-group">

                <label>Confirm Password</label>

                <div className="password-box">

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="show-btn"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {error &&
                <div className="error-box">
                  {error}
                </div>
              }

              <button
                className="register-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>

            <p className="bottom-text">

              Already have an account?

              <Link to="/login">
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}