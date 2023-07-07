import { Navigate } from "react-router-dom"
import { useState } from "react";
import DefaultLayout from "../layout/defaultlayout";
import { useAuth } from "./auth/authprovider";
import axios from 'axios'
import { useNavigate } from "react-router-dom";




export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState("");
    const auth = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const response = await axios.post('http://3.22.234.34:5000/api/v1/register', {email,password}, {
              
            });
            if (response.data.status == true){
                setErrorResponse(response.data.message)
                setTimeout(() => {
                    navigate("/");
                  }, 1000);
            }else{
                setErrorResponse(response.data.message)
            }
          } catch (error) {
            console.error(error);
          }
    }

    
    if (auth.isAuthenticated){
        return <Navigate to="/dashboard"/>
    }

    return (
        <DefaultLayout>
            <form onSubmit={handleSubmit} className="form">
                <h1>Sign up</h1>
                {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
                <label>Email</label>
                <input 
                    type="text" 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)} />

                <label>Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}/>

                <button>Sign Up</button>
            </form>
        </DefaultLayout>
    );
}