// src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
// import "./Login.css";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    // remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      });

      const { accessToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="background-circle circle-one"></div>
      <div className="background-circle circle-two"></div>

      <div className="login-container">

        {/* Left Side */}

        <div className="login-left">

          <div className="brand-logo">
            G
          </div>

          <h1>
            Welcome to
            <span> Groome</span>
          </h1>

          <p>
            Book appointments faster, manage your salon,
            and deliver a premium customer experience
            with one powerful platform.
          </p>

        </div>

        {/* Right Side */}

        <div className="login-right">

          <div className="login-card">

            <h2>Welcome Back 👋</h2>

            <p className="subtitle">
              Login to continue
            </p>

            <form onSubmit={handleSubmit}>

              <div className="input-group">

                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <label>Password</label>

                <div className="password-box">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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

              <div className="forgot-password">

                <Link to="/forgot-password">

                  Forgot Password?

                </Link>

              </div>

              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}

              <button
                className="login-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <p className="bottom-text">
              Don't have an account?

              <Link to="/register">
                Sign Up
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}