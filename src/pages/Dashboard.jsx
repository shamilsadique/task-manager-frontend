import api from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handleCreateTask(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      if (editingTaskId) {
        await api.put(
          `/tasks/${editingTaskId}`,
          {
            title,
            description,
            due_date: `${dueDate}T00:00:00Z`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Task updated successfully!");
      } else {
        await api.post(
          "/tasks",
          {
            title,
            description,
            due_date: `${dueDate}T00:00:00Z`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Task created successfully!");
      }

      await fetchTasks();

      setTitle("");
      setDescription("");
      setDueDate("");
      setEditingTaskId(null);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
        alert(error.response.data.error || "Operation failed.");
      } else {
        alert(error.message);
      }
    }
  }

  async function handleDeleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await api.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Task deleted successfully!");
      await fetchTasks();
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.error || "Failed to delete task.");
      } else {
        alert(error.message);
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function handleEditClick(task) {
    setEditingTaskId(task.ID);
    setTitle(task.title);
    setDescription(task.description);

    if (task.due_date) {
      setDueDate(task.due_date.split("T")[0]);
    } else {
      setDueDate("");
    }
  }

  async function fetchTasks() {
    try {
      const token = localStorage.getItem("token");

      const taskResponse = await api.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(taskResponse.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

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

      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert(error.message);
      }
    }
  }

  useEffect(() => {
    async function checkDashboard() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        await api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await fetchTasks();
      } catch (error) {
        console.error(error);

        localStorage.removeItem("token");
        navigate("/login");
      }
    }

    checkDashboard();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>TASK MANAGER</h1>
        <div className="header-buttons">
          <button
            className="info-button"
            onClick={() => navigate("/profile")}
          >
            <img
              src="/user.png"
              alt=""
              width="40"
              height="40"
            />
            <span>Profile</span>
          </button>
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <h2>{editingTaskId ? "Update Task" : "Create Task"}</h2>

      <form className="task-form" onSubmit={handleCreateTask}>
        <input
          className="form-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="form-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          className="create-btn"
          type="submit"
        >
          {editingTaskId ? "Update Task" : "Create A New Task"}
        </button>
      </form>

      <h2>My Tasks</h2>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">
            No tasks yet. Create your first task!
          </p>
        ) : (
          tasks.map((task) => (
            <div
              className="task-card"
              key={task.ID}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p className="due-date">
                Due:{" "}
                {new Date(task.due_date).toLocaleDateString()}
              </p>
              <p className="task-status">
                Status: <span>{task.status}</span>
              </p>
              <div className="task-buttons">
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(task)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteTask(task.ID)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
