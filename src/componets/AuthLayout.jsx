import { Link } from "react-router-dom";

const AuthLayout = ({
    title,
    subtitle,
    children,
    buttonText,
    loading,
    onSubmit,
    error,
    bottomText,
    bottomLink,
    bottomLinkText,
}) => {
    return (
        <div className="auth-shell">
            <div className="auth-ring"></div>

            <div className="auth-brand">
                <div className="auth-brand-box">
                    <div className="auth-brand-box-inner">
                        THE <br />
                        <span className="accent">CIRCLE</span>
                        <br />
                        COMPANY
                    </div>
                </div>
            </div>

            <div className="auth-content">

                <h1>{title}</h1>

                <p>{subtitle}</p>

                <form onSubmit={onSubmit}>

                    {children}

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    <button
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? "Please Wait..." : buttonText}
                    </button>

                </form>

                {bottomText && (
                    <p className="auth-switch">
                        {bottomText}
                        {" "}
                        <Link to={bottomLink}>
                            {bottomLinkText}
                        </Link>
                    </p>
                )}

            </div>
        </div>
    );
};

export default AuthLayout;