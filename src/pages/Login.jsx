import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "../styles/Login.css";

function Login() {
    const[email, setEmail]=useState('');
    const[password, setPassword]=useState('');
    const navigate = useNavigate();
async function handleLogin(e){
    e.preventDefault();

    try{
        const response=await api.post("/login",{
            email,
            password,
        });

        const token=response.data.token;

        localStorage.setItem("token", token);
        const decoded=jwtDecode(token)

        alert(response.data.login);
        if (decoded.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }

    }catch(error){
        if(error.response){
            alert(error.response.data.error)
        }
        else{
            alert(error.message)
        }
    }
}
    return (
        <div className="login-container">
            <h1>Welcome Back</h1>
            <form className="login-form" onSubmit={handleLogin}>
            <div>
                <input type="email" className="login-input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />            
            </div>

            <div>
                <input type="password" className="login-input" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            
            <button className="login-btn" type="submit">Login</button>
            <p className="login-footer">Don't have an account? <span onClick={() => navigate("/register")}>Register</span></p>
            </form>
        </div>
    );
  }
  
  export default Login;