import { useState } from "react";
import "./App.css";

export default function Login({ onLogin, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://smart-chat-backend.onrender.com/api/auth/login", {
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
    setLoading(false);
  }

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">💬</div>
          <h1 className="auth-brand-name">SmartChat</h1>
          <p className="auth-brand-tagline">Connect. Talk. Share.</p>
        </div>
        <div className="auth-circles">
          <div className="circle c1"></div>
          <div className="circle c2"></div>
          <div className="circle c3"></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box slide-in">
          <h2 className="auth-form-title">Welcome Back</h2>
          <p className="auth-form-sub">Sign in to continue chatting</p>

          {error && <div className="auth-error shake">{error}</div>}

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>

          <button className="auth-submit-btn" onClick={login} disabled={loading}>
            {loading ? <span className="spinner"></span> : "Sign In"}
          </button>

          <p className="auth-toggle">
            Don't have an account?{" "}
            <span onClick={onSwitch}>Create one</span>
          </p>
        </div>
      </div>
    </div>
  );
}