import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch('https://backend-zehy.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Login successful!');
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

        <h2>Sign in</h2>
        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Continue</button>
          {error && <p style={{color: 'red'}}>{error}</p>}
        </form>
        <p className="small-text">
          By continuing, you agree to our{" "}
          <a href="#">Terms</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
        <div className="divider"></div>
        <p className="business">
          Buying for work?{" "}
          <a href="#">Create a business account</a>
        </p>
        <div className="divider"></div>
        <p className="toggle-text">
          New to Amazon?{" "}
          <a href="#" onClick={() => navigate('/signup')}>Create your Amazon account</a>
        </p>
      </div>
    </div>
  );
}
