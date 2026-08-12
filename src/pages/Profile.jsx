import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Profile.css";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

function Profile() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [completed, setCompleted] = useState(0);
    const [pending, setPending] = useState(0);
    const [inProgress, setInProgress] = useState(0);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const chartData = [
        {
            name: "Pending",
            value: pending,
        },
        {
            name: "In Progress",
            value: inProgress,
        },
        {
            name: "Completed",
            value: completed,
        },
    ];

    async function fetchProfile() {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await api.get("/info", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsername(response.data.username);
            setEmail(response.data.email);

            setCompleted(response.data.tasks_completed);
            setPending(response.data.tasks_pending);
            setInProgress(response.data.tasks_in_progress);

        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (error.response) {
                alert(
                    error.response.data.error ||
                    "Failed to load profile."
                );
            } else {
                alert(error.message);
            }
        }
    }

    async function handleChangePassword(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await api.post(
                "/reset-password",
                {
                    currentpass: currentPassword,
                    newpass: newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Password updated successfully!");

            setCurrentPassword("");
            setNewPassword("");

        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                alert(
                    error.response.data.error ||
                    "Current password is incorrect."
                );
                return;
            }

            if (error.response) {
                alert(
                    error.response.data.error ||
                    "Failed to update password."
                );
            } else {
                alert(error.message);
            }
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="profile-container">

            <div className="profile-card">

                {/* Profile Header */}
                <div className="profile-top">

                    <h1>My Profile</h1>

                    <button
                        className="back-dashboard-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>

                </div>

                {/* User Information */}
                <div className="profile-info">

                    <h2>{username}</h2>

                    <p>{email}</p>

                </div>

                {/* Task Statistics */}
                <div className="task-statistics">

                    <div>
                        <h3>{pending}</h3>
                        <p>Pending</p>
                    </div>

                    <div>
                        <h3>{inProgress}</h3>
                        <p>In Progress</p>
                    </div>

                    <div>
                        <h3>{completed}</h3>
                        <p>Completed</p>
                    </div>

                </div>

                {/* Task Chart */}
                <div className="task-chart">

                    <h2>Task Progress</h2>

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >
                        <PieChart>

                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                innerRadius={50}
                                paddingAngle={4}
                            >

                                {/* Pending */}
                                <Cell fill="#f59e0b" />

                                {/* In Progress */}
                                <Cell fill="#3b82f6" />

                                {/* Completed */}
                                <Cell fill="#10b981" />

                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

                {/* Change Password */}
                <div className="password-section">

                    <h2>Change Password</h2>

                    <form
                        className="password-form"
                        onSubmit={handleChangePassword}
                    >

                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                            required
                        />

                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            minLength={8}
                            required
                        />

                        <button type="submit">
                            Change Password
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Profile;