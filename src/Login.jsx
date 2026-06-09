import { useState } from "react";
import "./App.css";
export default function Login({ onLogin, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function login() {
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: username + "@chat.com",
          password: password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(username);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Server error. Try again.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">💬</div>
        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-subtitle">Login to Smart Chat</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div className="auth-input-group">
          <span className="auth-icon">👤</span>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="auth-input-group">
          <span className="auth-icon">🔒</span>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
        </div>

        <button className="auth-btn" onClick={login}>
          Login
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={onSwitch}>Register</span>
        </p>

      </div>
    </div>
  );
}