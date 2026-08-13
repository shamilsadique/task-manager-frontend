import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "../styles/ResetPassword.css";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleResetPassword(e) {
        e.preventDefault();

        if (!token) {
            setMessage("Invalid password reset link.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must be at least 8 characters.");
            return;
        }

        try {
            const response = await api.post(
                "/reset-password-token",
                {
                    token,
                    password,
                }
            );

            setMessage(response.data.message);

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);

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
        <div className="reset-password-container">

            <div className="reset-password-card">

                <h1>Reset Password</h1>

                <p>
                    Enter your new password below.
                </p>

                <form onSubmit={handleResetPassword}>

                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Reset Password
                    </button>

                </form>

                {message && (
                    <p className="reset-message">
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

export default ResetPassword;