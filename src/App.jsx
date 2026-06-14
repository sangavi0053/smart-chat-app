import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import Login from "./Login";
import Register from "./Register";

const socket = io("https://smart-chat-backend.onrender.com", {
  autoConnect: false
});

export default function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedUser) return;
      try {
        const res = await fetch(
          `https://smart-chat-backend.onrender.com/messages/${username}/${selectedUser}`
        );
        const data = await res.json();
        setChat(data);
      } catch (error) {
        console.log(error);
      }
    }
    loadMessages();
  }, [selectedUser, username]);

  useEffect(() => {
    if (!username) return;
    async function loadPhoto() {
      try {
        const res = await fetch(
          `https://smart-chat-backend.onrender.com/api/profile/${username}`
        );
        const data = await res.json();
        if (data.photo) {
          setProfilePhoto(`https://smart-chat-backend.onrender.com${data.photo}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadPhoto();
  }, [username]);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.on("users", (usersList) => setUsers([...usersList]));
    socket.on("receive_private", (data) => setChat((prev) => [...prev, data]));
    socket.on("typing", (user) => setTypingUser(user));
    socket.on("stopTyping", () => setTypingUser(""));
    return () => {
      socket.off("connect");
      socket.off("users");
      socket.off("receive_private");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  function handleLogin(loggedUsername) {
    setUsername(loggedUsername);
    socket.connect();
    socket.once("connect", () => socket.emit("join", loggedUsername));
    setPage("chat");
  }

  function sendMessage() {
    if (!message.trim()) return;
    if (!selectedUser) { alert("Select a user"); return; }
    const data = { sender: username, receiver: selectedUser, message };
    socket.emit("private_message", data);
    socket.emit("stopTyping");
    setMessage("");
  }

  async function uploadPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("username", username);
    try {
      const res = await fetch(
        "https://smart-chat-backend.onrender.com/api/profile/photo",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setProfilePhoto(`https://smart-chat-backend.onrender.com${data.photoUrl}`);
      alert("Profile photo updated!");
    } catch (error) {
      console.log(error);
    }
  }

  function logout() {
    socket.disconnect();
    setUsername(""); setUsers([]); setSelectedUser("");
    setChat([]); setProfilePhoto(null);
    setShowProfile(false); setPage("login");
  }

  if (page === "login") return <Login onLogin={handleLogin} onSwitch={() => setPage("register")} />;
  if (page === "register") return <Register onSwitch={() => setPage("login")} />;

  return (
    <div className="chat-layout">
      <div className="sidebar">
        <div className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
          {profilePhoto ? (
            <img src={profilePhoto} alt="profile" className="profile-img" />
          ) : (
            <div className="profile-placeholder">{username?.charAt(0).toUpperCase()}</div>
          )}
          <span>{username}</span>
        </div>

        {showProfile && (
          <div className="profile-panel">
            <h3>My Profile</h3>
            <div className="profile-photo-container">
              {profilePhoto ? (
                <img src={profilePhoto} alt="profile" className="profile-photo-big" />
              ) : (
                <div className="profile-placeholder-big">{username?.charAt(0).toUpperCase()}</div>
              )}
            </div>
            <p className="profile-username">{username}</p>
            <label className="upload-btn">
              📷 Change Photo
              <input type="file" accept="image/*" onChange={uploadPhoto} style={{ display: "none" }} />
            </label>
            <button className="close-profile-btn" onClick={() => setShowProfile(false)}>Close</button>
          </div>
        )}

        <div className="sidebar-header">Online Users</div>
        <div className="users-list">
          {users.filter(u => u !== username).length === 0 ? (
            <div style={{ color: "#4b5563", padding: "12px", fontSize: "13px" }}>No users online</div>
          ) : (
            users.filter(u => u !== username).map((u, i) => (
              <div
                key={i}
                className={`user-item ${selectedUser === u ? "active-user" : ""}`}
                onClick={() => setSelectedUser(u)}
              >
                🟢 {u}
              </div>
            ))
          )}
        </div>

        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </div>

      <div className="chat-section">
        <div className="chat-header">
          {selectedUser ? `💬 Chat with ${selectedUser}` : "Select a user to start chatting"}
        </div>

        <div className="messages-area">
          {chat
            .filter(m =>
              (m.sender === username && m.receiver === selectedUser) ||
              (m.sender === selectedUser && m.receiver === username)
            )
            .map((m, i) => (
              <div key={i} className={`message ${m.sender === username ? "right" : "left"}`}>
                <div className="msg-user">{m.sender}</div>
                <div className="msg-text">{m.message}</div>
              </div>
            ))}
        </div>

        {typingUser && typingUser !== username && (
          <div className="typing-indicator">
            {typingUser} is typing
            <div className="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              socket.emit("typing", username);
              clearTimeout(window.typingTimeout);
              window.typingTimeout = setTimeout(() => socket.emit("stopTyping"), 1000);
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send ➤</button>
        </div>
      </div>
    </div>
  );
}