import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // In-memory store
  const users = new Map(); // socket.id -> { id, name, role }
  const messages = []; // { from, to, text, timestamp }

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userData) => {
      users.set(socket.id, { ...userData, socketId: socket.id });
      io.emit("users:update", Array.from(users.values()));
      console.log(`${userData.name} joined`);
    });

    socket.on("message:send", (messageData) => {
      const fullMessage = {
        ...messageData,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      };
      
      messages.push(fullMessage);
      
      // If it's a private message, send to specific user
      if (messageData.to) {
        const targetUser = Array.from(users.values()).find(u => u.id === messageData.to);
        if (targetUser) {
          io.to(targetUser.socketId).emit("message:receive", fullMessage);
        }
        // Also send back to sender
        socket.emit("message:receive", fullMessage);
      } else {
        // Broadcast to all (e.g., feedback or public chat)
        io.emit("message:receive", fullMessage);
      }
    });

    socket.on("disconnect", () => {
      const user = users.get(socket.id);
      if (user) {
        users.delete(socket.id);
        io.emit("users:update", Array.from(users.values()));
        console.log(`${user.name} disconnected`);
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
