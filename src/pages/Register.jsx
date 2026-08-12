import api from "../services/api";
import { useState } from 'react';
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        try {
            const response = await api.post("/register", {
                name,
                email,
                password,
            });
            alert(response.data.message);
            navigate("/login"); 
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.error);
            } else {
                alert(error.message);
            }
        }
    }

    return (
        <div className="register-container">
            <h1>Create Account</h1>
            <form className="register-form" onSubmit={handleRegister}>
                <div>
                    <input 
                        type="text" 
                        className="register-input" 
                        placeholder="Full Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div>
                    <input 
                        type="email" 
                        className="register-input" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        className="register-input" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <button className="register-btn" type="submit">Register</button>
                <p className="register-footer"> 
                    Already have an account? <span onClick={() => navigate("/login")}>Login</span> 
                </p>
            </form>
        </div>
    );
}

export default Register;
