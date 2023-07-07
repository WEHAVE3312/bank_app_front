import { Navigate } from "react-router-dom"
import { useState } from "react";
import DefaultLayout from "../layout/defaultlayout";
import { useAuth } from "./auth/authprovider";
import axios from 'axios'

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState("");
    const auth = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const response = await axios.post('https://3.22.234.34:5000/api/v1/login', {email,password}, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"                  }
            });
            if (response.data.status == true){
                const token = response.data.data.token
                const user = response.data.data.user
                console.log('logged')
                auth.login(token,user);
            }else{
                setErrorResponse(response.data.message)
                console.log(response.data.message)
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
                <h1>Login</h1>
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

                <button>Log in</button>
            </form>
        </DefaultLayout>
    );
}