import { useState } from "react";
import "./App.css";

export default function Register({ onSwitch }) {
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    setError("");
    setSuccess("");
    if (!regUsername.trim() || !regPassword.trim()) {
      setError("Please fill all fields");
      return;
    }
    if (regPassword !== regConfirm) {
      setError("Passwords do not match");
      return;
    }
    if (regPassword.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://smart-chat-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regUsername,
          email: regUsername + "@chat.com",
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => onSwitch(), 1500);
      } else {
        setError(data.message || "Registration failed");
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
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-sub">Join SmartChat today</p>

          {error && <div className="auth-error shake">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Choose a password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={regConfirm}
              onChange={(e) => setRegConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && register()}
            />
          </div>

          <button className="auth-submit-btn" onClick={register} disabled={loading}>
            {loading ? <span className="spinner"></span> : "Create Account"}
          </button>

          <p className="auth-toggle">
            Already have an account?{" "}
            <span onClick={onSwitch}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}