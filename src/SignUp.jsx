import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch('https://backend-zehy.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Account created successfully!');
        navigate('/');  
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="logo">amazon.in</h1>
        <h2>Create account</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Your name</label>
            <input 
              type="text" 
              placeholder="First and last name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mobile number or email</label>
            <input 
              type="text" 
              placeholder="Enter your email or phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Re-enter password</label>
            <input type="password" placeholder="Confirm your password" />
          </div>
          <button type="submit">Create your Amazon account</button>
        </form>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <p className="small-text">
          By creating an account, you agree to our{" "}
          <a href="#">Terms</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
        <div className="divider"></div>
        <p className="toggle-text">
          Already have an account?{" "}
          <a href="#" onClick={() => navigate('/login')}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
