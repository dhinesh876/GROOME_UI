import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOtp, verifyOtp } from "../api/authApi";
// import "./Login.css";
import "../styles/VerifyEmail.css";

export default function VerifyEmail() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState(["", "", "", "", ""]);
    const [timer, setTimer] = useState(600); // 10 Minutes
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const inputs = useRef([]);

    // 1️⃣ Auto focus
    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);

    useEffect(() => {

        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);

    }, [timer]);

    const handleChange = (value, index) => {

        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;

        setOtp(updatedOtp);

        if (value && index < otp.length - 1) {
            inputs.current[index + 1]?.focus();
        }

    };

    const handleKeyDown = (e, index) => {

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

        digits.forEach((digit, index) => {
            updated[index] = digit;
        });

        setOtp(updated);

        inputs.current[Math.min(digits.length, 5)]?.focus();

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const code = otp.join("");

        if (code.length !== 5) {
            return setError("Please enter a valid 5 digit OTP.");
        }

        try {

            setLoading(true);

            await verifyOtp({
                email,
                otp: code
            });

            navigate("/");

        }
        catch (err) {

            setError(
                err.response?.data?.message ||
                "Invalid OTP."
            );

        }
        finally {

            setLoading(false);

        }

    };

    const handleResend = async () => {

        try {

            await resendOtp({ email });

            setOtp(["", "", "", "", ""]);

            setTimer(600);

            inputs.current[0]?.focus();

        }
        catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="verify-page">

            <div className="background-circle circle-one"></div>

            <div className="background-circle circle-two"></div>

            <div className="verify-card">

                <div className="otp-brand">

                    <h1>GROOME</h1>

                    <p>Salon Booking Platform</p>

                </div>

                <h2>Email Verification</h2>

                <p className="subtitle">

                    Enter the verification code sent to

                    <br />

                    <strong>{email}</strong>

                </p>

                <form onSubmit={handleSubmit}>

                    <div className="otp-container">

                        {otp.map((digit, index) => (

                            <input className="otp-input"

                                key={index}

                                ref={(el) => (inputs.current[index] = el)}

                                type="text"

                                maxLength={1}

                                value={digit}

                                disabled={loading}

                                onChange={(e) =>
                                    handleChange(
                                        e.target.value,
                                        index
                                    )
                                }

                                onKeyDown={(e) =>
                                    handleKeyDown(
                                        e,
                                        index
                                    )
                                }

                                onPaste={handlePaste}

                            />

                        ))}

                    </div>

                    {error &&

                        <div className="error-box">

                            {error}

                        </div>

                    }

                    <button

                        className="verify-btn"

                        disabled={loading}

                    >

                        {loading
                            ? "Verifying..."
                            : "Verify Email"}

                    </button>

                </form>

                <div className="resend-area">

                    {

                        timer > 0 ?

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

                                className="resend-btn"

                                onClick={handleResend}

                            >

                                Resend OTP

                            </button>

                    }

                </div>

            </div>

        </div>

    );

}