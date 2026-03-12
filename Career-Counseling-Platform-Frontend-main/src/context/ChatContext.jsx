import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const newSocket = io(window.location.origin);
      setSocket(newSocket);

      newSocket.emit('join', {
        id: user.id || user.email,
        name: user.name,
        role: user.role,
        email: user.email
      });

      newSocket.on('users:update', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('message:receive', (message) => {
        setMessages((prev) => [...prev, message]);
        // Increment unread if message is for me and not from me
        if (message.to === (user.id || user.email) && message.from !== (user.id || user.email)) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const sendMessage = useCallback((text, to = null) => {
    if (socket && user) {
      const messageData = {
        from: user.id || user.email,
        fromName: user.name,
        text,
        to, // null for public/feedback
        timestamp: new Date().toISOString()
      };
      socket.emit('message:send', messageData);
    }
  }, [socket, user]);

  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return (
    <ChatContext.Provider value={{ 
      onlineUsers, 
      messages, 
      sendMessage, 
      unreadCount, 
      clearUnread,
      socket 
    }}>
      {children}
    </ChatContext.Provider>
  );
};
