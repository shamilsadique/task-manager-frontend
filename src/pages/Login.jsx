import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
    const[email, setEmail]=useState('');
    const[password, setPassword]=useState('');
    const navigate = useNavigate();
async function handleLogin(e){
    e.preventDefault();
    alert("login button clicked");
    try{
        const response=await api.post("/login",{
            email,
            password,
        });
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        alert(response.data.login);
        navigate("/dashboard");
    }catch(error){
        console.log(error);
        console.log(error.response);
        if(error.response){
            alert(error.response.data.error)
        }
        else{
            alert(error.message)
        }
        alert("login attempt failed");
    }
}
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
            <div>
                <label>Email</label>
                <br/>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />            
            </div>
            <br/>
            <div>
                <label>Password</label>
                <br/>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <br/>

            <button type="submit">LogIn</button>
            </form>
        </div>
    );
  }
  
  export default Login;