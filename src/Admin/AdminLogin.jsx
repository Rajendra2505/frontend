import React,{useState} from "react";
import "./AdminLogin.css";

function AdminLogin(){
    const[email,setEmail]= useState("");
    const[password,setPassword]= useState("");
        const handleSubmit=(e)=>{
            e.preventDefault();

            if(email==="admin@gmail.com"&& password==="admin123"){
                alert("login susscess");
                window.location.href="/admin-dashboard";
            }else{
                alert("invalid login")
            }
        }  ;
        return(
            <div className="login-container">
                <div className="login-box">

                    <h2>Admin login</h2>
                    <form onSubmit={handleSubmit}>

                        <input
                        type="text"
                        placeholder="username"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        />
                        <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        />

                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        ) ; 
}
export default AdminLogin;