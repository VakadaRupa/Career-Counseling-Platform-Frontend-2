import React, { useState, useEffect, useRef } from "react";

export default function Community() {

  // Current logged user
  const currentUser = {
    name: "Alice",
    role: "user" // change to "admin" to test admin permissions
  };

  // Online users
  const users = [
    { id: 1, name: "Alice", role: "user" },
    { id: 2, name: "John", role: "user" },
    { id: 3, name: "Admin", role: "admin" }
  ];

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- CHAT ----------------

  const sendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;

    const newMessage = {
      from: currentUser.name,
      to: selectedUser.name,
      text: messageText,
      time: new Date().toLocaleTimeString()
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const chatMessages = messages.filter(
    (m) =>
      (m.from === currentUser.name && m.to === selectedUser?.name) ||
      (m.from === selectedUser?.name && m.to === currentUser.name)
  );

  // ---------------- POSTS ----------------

  const createPost = () => {
    if (!postText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: currentUser.name,
      text: postText,
      time: new Date().toLocaleString()
    };

    setPosts([newPost, ...posts]);
    setPostText("");
  };

  const updatePost = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, text: postText } : post
      )
    );

    setEditingPostId(null);
    setPostText("");
  };

  const deletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  // Permission check
  const canEditOrDelete = (post) => {
    return (
      post.author === currentUser.name || currentUser.role === "admin"
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* USERS LIST */}
      <div style={{ width: "25%", borderRight: "1px solid #ccc", padding: "15px" }}>
        <h3>Online Users</h3>

        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            style={{
              padding: "10px",
              cursor: "pointer",
              background: selectedUser?.id === user.id ? "#eee" : ""
            }}
          >
            {user.name} ({user.role})
          </div>
        ))}
      </div>

      {/* MAIN AREA */}
      <div style={{ width: "75%", display: "flex", flexDirection: "column" }}>

        {/* POSTS SECTION */}
        <div style={{ padding: "15px", borderBottom: "1px solid #ccc" }}>
          <h3>Community Posts</h3>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              value={postText}
              placeholder="Write a post..."
              onChange={(e) => setPostText(e.target.value)}
              style={{ flex: 1, padding: "8px" }}
            />

            <button
              onClick={() =>
                editingPostId
                  ? updatePost(editingPostId)
                  : createPost()
              }
            >
              {editingPostId ? "Update" : "Post"}
            </button>
          </div>

          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px"
              }}
            >
              <b>{post.author}</b>
              <p>{post.text}</p>
              <small>{post.time}</small>

              {canEditOrDelete(post) && (
                <div style={{ marginTop: "5px" }}>
                  <button
                    onClick={() => {
                      setEditingPostId(post.id);
                      setPostText(post.text);
                    }}
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deletePost(post.id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CHAT SECTION */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {selectedUser ? (
            <>
              <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                Chat with <b>{selectedUser.name}</b>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign:
                        msg.from === currentUser.name ? "right" : "left",
                      marginBottom: "10px"
                    }}
                  >
                    <span
                      style={{
                        padding: "8px 12px",
                        background:
                          msg.from === currentUser.name
                            ? "#4CAF50"
                            : "#ddd",
                        color:
                          msg.from === currentUser.name
                            ? "#fff"
                            : "#000",
                        borderRadius: "10px"
                      }}
                    >
                      {msg.text}
                    </span>

                    <div style={{ fontSize: "10px" }}>{msg.time}</div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              <div style={{ display: "flex", padding: "10px" }}>
                <input
                  type="text"
                  value={messageText}
                  placeholder="Type message..."
                  onChange={(e) => setMessageText(e.target.value)}
                  style={{ flex: 1, padding: "8px" }}
                />

                <button
                  onClick={sendMessage}
                  style={{ marginLeft: "10px" }}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: "20px" }}>
              Select a user to start chatting
            </div>
          )}

        </div>
      </div>
    </div>
  );
}