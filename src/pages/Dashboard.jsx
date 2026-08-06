import api from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);

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

        alert("Failed to delete task.");

    }
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
    const token = localStorage.getItem("token");

    const taskResponse = await api.get("/tasks", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    setTasks(taskResponse.data.tasks);
}

    useEffect(() => {

      async function checkDashboard() {
  
          const token = localStorage.getItem("token");
  
          if (!token) {
              navigate("/login");
              return;
          }
  
          try {
  
              const response = await api.get("/dashboard", {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
  
              console.log(response.data);
              
              await fetchTasks();
  
          } catch (error) {
  
              localStorage.removeItem("token");
              navigate("/login");
  
          }
  
      }
  
      checkDashboard();
  
  }, [navigate]);
  console.log(editingTaskId);
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome!</p>
            <h2>Create Task</h2>

            <form onSubmit={handleCreateTask}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <br />
            <br />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
        <br /><br />
            <input  type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>
        <br /><br />
        <button type="submit" >  {editingTaskId ? "Update Task" : "Create Task"}  </button>
          </form>

        <hr />
            <h2>My Tasks</h2>
            <ul>
              {tasks.map((task) => (
             <li key={task.ID}>
             <strong>{task.title}</strong>
             <button onClick={() => handleEditClick(task)}style={{ marginLeft: "10px" }}>Edit</button>

             <button
                 onClick={() => handleDeleteTask(task.ID)}
                 style={{ marginLeft: "10px" }}>
                 Delete
             </button>
         </li>
              ))}
            </ul>
        </div>
    );
}

export default Dashboard;