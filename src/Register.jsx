import { useState } from "react";

export default function Register({ onSwitch }) {
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setSuccess("Account created! Please login.");
        setRegUsername("");
        setRegPassword("");
        setRegConfirm("");
        setTimeout(() => onSwitch(), 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Server error. Try again.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">💬</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join Smart Chat today</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div className="auth-input-group">
          <span className="auth-icon">👤</span>
          <input
            type="text"
            placeholder="Choose a username"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
          />
        </div>

        <div className="auth-input-group">
          <span className="auth-icon">🔒</span>
          <input
            type="password"
            placeholder="Choose a password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
        </div>

        <div className="auth-input-group">
          <span className="auth-icon">🔒</span>
          <input
            type="password"
            placeholder="Confirm password"
            value={regConfirm}
            onChange={(e) => setRegConfirm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && register()}
          />
        </div>

        <button className="auth-btn" onClick={register}>
          Create Account
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={onSwitch}>Login</span>
        </p>

      </div>
    </div>
  )
}









