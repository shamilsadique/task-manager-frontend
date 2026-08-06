import api from "../services/api";
import {useState} from 'react';
function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
async function handleRegister(e){
    e.preventDefault();
    alert("Register button clicked!");
    try {
        const response = await api.post("/register", {
            name,
            email,
            password,
        });
        alert(response.data.message);
    } catch (error) {
        console.log(error);
        console.log(error.response);
        if(error.response){
            alert(error.response.data.error)
        }
        else{
            alert(error.message)
        }
        alert("Registration failed.");
    }
}
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Email</label>
                    <br/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <br/>
                <div>
                    <label>Password</label>
                    <br/>
                    <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} />
                </div>
                <br/>

                <button type="submit">Register</button>
            </form>
        </div>
    );
  }
  
  export default Register;