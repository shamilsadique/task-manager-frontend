import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function handleForgotPassword(e) {
        e.preventDefault();

        try {
            const response = await api.post("/forgot-password", {
                email,
            });

            setMessage(response.data.message);
        } catch (error) {
            console.error(error);

            if (error.response) {
                setMessage(error.response.data.error);
            } else {
                setMessage(error.message);
            }
        }
    }

    return (
        <div className="forgot-password-container">

            <div className="forgot-password-card">

                <h1>Forgot Password?</h1>

                <p>
                    Enter your registered email address and we'll
                    send you a password reset link.
                </p>

                <form onSubmit={handleForgotPassword}>

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Send Reset Link
                    </button>

                </form>

                {message && (
                    <p className="forgot-message">
                        {message}
                    </p>
                )}

                <button
                    className="back-login-btn"
                    onClick={() => navigate("/login")}
                >
                    Back to Login
                </button>

            </div>

        </div>
    );
}

export default ForgotPassword;