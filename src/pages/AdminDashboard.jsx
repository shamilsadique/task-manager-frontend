import "../styles/AdminDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [tasks, setTasks] = useState([]);

    async function fetchUsers() {
        const token = localStorage.getItem("token");

        try {
            const response = await api.get("/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(response.data.users);
        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(error.response.data.error);
            } else {
                alert(error.message);
            }
        }
    }

    async function fetchUserTasks(user) {
        const token = localStorage.getItem("token");

        try {
            const response = await api.get(
                `/admin/users/${user.id}/tasks`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSelectedUser(user);
            setTasks(response.data.tasks);
        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(error.response.data.error);
            } else {
                alert(error.message);
            }
        }
    }

    async function handleStatusChange(taskId, newStatus) {
        const token = localStorage.getItem("token");

        try {
            await api.put(
                `/admin/tasks/${taskId}/status`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Task status updated successfully!");

            if (selectedUser) {
                await fetchUserTasks(selectedUser);
            }
        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(error.response.data.error);
            } else {
                alert(error.message);
            }
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>

                <div>
                    <button
                        className="user-dashboard-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        User Dashboard
                    </button>
                    <button
                        className="admin-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <hr />
            <h2>Users</h2>
            <div className="user-list">
                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    users.map((user) => (
                        <div className="user-card" key={user.id}>
                            <div>
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                                <p>Role: {user.role}</p>
                            </div>
                            <button onClick={() => fetchUserTasks(user)}>
                                View Tasks
                            </button>
                        </div>
                    ))
                )}
            </div>

            {selectedUser && (
                <div className="selected-user">
                    <hr />
                    <div className="tasks-header">
                        <h2>{selectedUser.name}'s Tasks</h2>
                        <button
                            onClick={() => {
                                setSelectedUser(null);
                                setTasks([]);
                            }}
                        >
                            Back to Users
                        </button>
                    </div>
                    {tasks.length === 0 ? (
                        <p>This user has no tasks.</p>
                    ) : (
                        <div className="admin-task-list">
                            {tasks.map((task) => (
                                <div className="admin-task-card" key={task.ID}>
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                    <p>
                                        Due:{" "}
                                        {new Date(
                                            task.due_date
                                        ).toLocaleDateString()}
                                    </p>
                                    <div className="admin-status">
                                        <label>Status:</label>
                                        <select
                                            value={task.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    task.ID,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Pending">
                                                Pending
                                            </option>
                                            <option value="In Progress">
                                                In Progress
                                            </option>
                                            <option value="Completed">
                                                Completed
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;