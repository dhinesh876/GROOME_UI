import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/authApi";
// import "./Login.css";
import "../styles/ForgotPassword.css";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const [timer, setTimer] = useState(600);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const inputs = useRef([]);

  useEffect(() => {

    if (!otpSent) return;

    if (timer <= 0) return;

    const interval = setInterval(() => {

      setTimer(prev => prev - 1);

    }, 1000);

    return () => clearInterval(interval);

  }, [timer, otpSent]);

  const handleOtpChange = (value, index) => {

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 4) {

      inputs.current[index + 1]?.focus();

    }

  };

  const handleBackspace = (e, index) => {

    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      index > 0
    ) {

      inputs.current[index - 1]?.focus();

    }

  };

  const handlePaste = (e) => {

    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, 5);

    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.split("");

    const updated = [...otp];

    digits.forEach((d, i) => {

      updated[i] = d;

    });

    setOtp(updated);

  };

  // Send OTP
  const handleSendOtp = async () => {

    setError("");

    if (!email.trim()) {
      return setError("Please enter your email.");
    }

    try {

      setLoading(true);

      await forgotPassword({
        email
      });

      setOtpSent(true);

      setTimer(180);

      setOtp(["", "", "", "", ""]);

      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 200);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to send OTP."
      );

    } finally {

      setLoading(false);

    }

  };

  // Reset Password
  const handleResetPassword = async (e) => {

    e.preventDefault();

    setError("");

    const otpCode = otp.join("");

    if (otpCode.length !== 5) {
      return setError("Please enter a valid 5-digit OTP.");
    }

    if (!password) {
      return setError("Please enter a new password.");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {

      setLoading(true);

      await resetPassword({

        email,

        otp: otpCode,

        password

      });

      alert("Password reset successfully.");

      navigate("/");

    } catch (err) {

      setError(

        err.response?.data?.message ||

        "Unable to reset password."

      );

    } finally {

      setLoading(false);

    }

  };

  // Resend OTP
  const handleResendOtp = async () => {

    try {

      setOtp(["", "", "", "", ""]);

      await forgotPassword({
        email
      });

      setTimer(180);

      setOtp(["", "", "", "", ""]);

      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 200);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to resend OTP."
      );

    }
  };

  return (

    <div className="forgot-page">

      <div className="background-circle circle-one"></div>

      <div className="background-circle circle-two"></div>

      <div className="forgot-card">

        <div className="otp-brand">

          <h1>GROOME</h1>

          <p>Reset Your Password</p>

        </div>

        <h2>Forgot Password</h2>

        <p className="subtitle">

          Enter your registered email address to receive a 5-digit OTP.

        </p>

        <form onSubmit={handleResetPassword}>

          {/* Email */}

          <div className="input-group">

            <label>Email</label>

            <input

              type="email"

              placeholder="Enter your email"

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              disabled={otpSent}

              required

            />

          </div>

          {/* Send OTP */}

          {

            !otpSent &&

            <button

              type="button"

              className="forgot-btn"

              onClick={handleSendOtp}

              disabled={loading}

            >

              {

                loading

                  ?

                  "Sending OTP..."

                  :

                  "Send OTP"

              }

            </button>

          }

          {

            otpSent &&

            <>

              {/* OTP */}

              <div className="input-group">

                <label>OTP</label>

                <div className="otp-box">

                  {

                    otp.map((digit, index) => (

                      <input

                        key={index}

                        ref={(el) => inputs.current[index] = el}

                        type="text"

                        value={digit}

                        maxLength="1"

                        onChange={(e) =>
                          handleOtpChange(
                            e.target.value,
                            index
                          )
                        }

                        onKeyDown={(e) =>
                          handleBackspace(
                            e,
                            index
                          )
                        }

                        onPaste={handlePaste}

                      />

                    ))

                  }

                </div>

              </div>

              {/* Timer */}

              <div className="resend-area">

                {

                  timer > 0

                    ?

                    <p>

                      Resend OTP in

                      <strong>

                        {" "}

                        {String(Math.floor(timer / 60)).padStart(2, "0")}

                        :

                        {String(timer % 60).padStart(2, "0")}

                      </strong>

                    </p>

                    :

                    <button

                      type="button"

                      className="resend-btn"

                      onClick={handleResendOtp}

                    >

                      Resend OTP

                    </button>

                }

              </div>

              {/* Password */}

              <div className="input-group">

                <label>New Password</label>

                <div className="password-box">

                  <input

                    type={showPassword ? "text" : "password"}

                    placeholder="Enter new password"

                    value={password}

                    onChange={(e) =>
                      setPassword(e.target.value)
                    }

                    required

                  />

                  <button

                    type="button"

                    className="show-btn"

                    onClick={() =>
                      setShowPassword(!showPassword)
                    }

                  >

                    {

                      showPassword

                        ?

                        "Hide"

                        :

                        "Show"

                    }

                  </button>

                </div>

              </div>

              {/* Confirm Password */}

              <div className="input-group">

                <label>Confirm Password</label>

                <div className="password-box">

                  <input

                    type={showConfirmPassword ? "text" : "password"}

                    placeholder="Confirm password"

                    value={confirmPassword}

                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }

                    required

                  />

                  <button

                    type="button"

                    className="show-btn"

                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }

                  >

                    {

                      showConfirmPassword

                        ?

                        "Hide"

                        :

                        "Show"

                    }

                  </button>

                </div>

              </div>

              {/* Error */}

              {

                error &&

                <div className="error-box">

                  {error}

                </div>

              }

              {/* Reset Button */}

              <button

                className="forgot-btn"

                disabled={loading}

              >

                {

                  loading

                    ?

                    "Updating..."

                    :

                    "Reset Password"

                }

              </button>

            </>

          }

        </form>

        <p className="bottom-text">

          Remember your password?

          {" "}

          <Link to="/">

            Login

          </Link>

        </p>

      </div>

    </div>

  );
}