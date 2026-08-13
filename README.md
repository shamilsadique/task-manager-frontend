 Frontend — `task-manager-frontend`

Replace the frontend `README.md` with:

markdown
# Task Manager - Frontend

A responsive React frontend for a full-stack Task Management application.

The application provides user registration, login, task management, profile management, admin functionality, and password recovery.

## Tech Stack

- React
- Vite
- JavaScript
- Axios
- React Router
- JWT Decode
- CSS

## Features

### Authentication

- User registration
- User login
- JWT authentication
- Automatic navigation based on user role
- Logout
- Forgot password
- Password reset through email link

### User Dashboard

Users can:

- Create tasks
- View their tasks
- Edit tasks
- Delete tasks
- View task status
- View task due dates

### Profile

Users can:

- View their profile information
- View task statistics
- Change their password

### Admin Dashboard

Admins can:

- View all users
- View a user's tasks
- Change task status
- Assign new tasks to selected users
- Navigate between users and tasks

## Project Structure

```
task-manager-frontend/
│
├── public/
│   └── user.png
│
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── styles/
│   │   ├── AdminDashboard.css
│   │   ├── Dashboard.css
│   │   ├── ForgotPassword.css
│   │   ├── Login.css
│   │   ├── Profile.css
│   │   ├── Register.css
│   │   └── ResetPassword.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
