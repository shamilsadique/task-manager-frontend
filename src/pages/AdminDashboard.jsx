import "../styles/AdminDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [showAssignForm, setShowAssignForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");

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

            // Reset assign form
            setShowAssignForm(false);
            setTitle("");
            setDescription("");
            setDueDate("");

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

    async function handleAssignTask(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!selectedUser) {
            alert("Please select a user first.");
            return;
        }

        try {
            await api.post(
                "/admin/tasks",
                {
                    title,
                    description,
                    due_date: `${dueDate}T00:00:00Z`,
                    user_id: selectedUser.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Task assigned successfully!");

            setTitle("");
            setDescription("");
            setDueDate("");
            setShowAssignForm(false);

            await fetchUserTasks(selectedUser);

        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(error.response.data.error);
            } else {
                alert(error.message);
            }
        }
    }

    function handleBackToUsers() {
        setSelectedUser(null);
        setTasks([]);
        setShowAssignForm(false);
        setTitle("");
        setDescription("");
        setDueDate("");
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

            {/* Header */}
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

            {/* Users */}
            <h2>Users</h2>

            <div className="user-list">

                {users.length === 0 ? (

                    <p>No users found.</p>

                ) : (

                    users.map((user) => (

                        <div
                            className="user-card"
                            key={user.id}
                        >

                            <div>

                                <h3>{user.name}</h3>

                                <p>{user.email}</p>

                                <p>
                                    Role: {user.role}
                                </p>

                            </div>

                            <button
                                onClick={() => fetchUserTasks(user)}
                            >
                                View Tasks
                            </button>

                        </div>

                    ))

                )}

            </div>

            {/* Selected User */}
            {selectedUser && (

                <div className="selected-user">

                    <hr />

                    <div className="tasks-header">

                        <h2>
                            {selectedUser.name}'s Tasks
                        </h2>

                        <button
                            onClick={handleBackToUsers}
                        >
                            Back to Users
                        </button>

                    </div>

                    {/* Tasks */}
                    {tasks.length === 0 ? (

                        <p>
                            This user has no tasks.
                        </p>

                    ) : (

                        <div className="admin-task-list">

                            {tasks.map((task) => (

                                <div
                                    className="admin-task-card"
                                    key={task.ID}
                                >

                                    <h3>
                                        {task.title}
                                    </h3>

                                    <p>
                                        {task.description}
                                    </p>

                                    <p>
                                        Due:{" "}
                                        {new Date(
                                            task.due_date
                                        ).toLocaleDateString()}
                                    </p>

                                    <div className="admin-status">

                                        <label>
                                            Status:
                                        </label>

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

                    {/* Assign New Task */}
                    <button
                        className="assign-task-btn"
                        onClick={() =>
                            setShowAssignForm(true)
                        }
                    >
                        + Assign New Task
                    </button>

                    {/* Assign Task Form */}
                    {showAssignForm && (

                        <form
                            className="assign-task-form"
                            onSubmit={handleAssignTask}
                        >

                            <h3>
                                Assign Task to {selectedUser.name}
                            </h3>

                            <input
                                type="text"
                                placeholder="Task title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                required
                            />

                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) =>
                                    setDueDate(e.target.value)
                                }
                                required
                            />

                            <button type="submit">
                                Assign Task
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowAssignForm(false);
                                    setTitle("");
                                    setDescription("");
                                    setDueDate("");
                                }}
                            >
                                Cancel
                            </button>

                        </form>

                    )}

                </div>

            )}

        </div>
    );
}

export default AdminDashboard;