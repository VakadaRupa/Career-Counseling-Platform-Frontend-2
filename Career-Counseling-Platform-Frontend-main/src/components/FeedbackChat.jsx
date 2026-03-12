import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, X, Send, Shield, User, Bot, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/BaseComponents';

export default function FeedbackChat() {
  const { user } = useAuth();
  const { messages, sendMessage, unreadCount, clearUnread } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      clearUnread();
    }
  }, [isOpen, messages, clearUnread]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    // In this context, "null" target means it's a general feedback/admin chat
    sendMessage(messageText, null);
    setMessageText('');
  };

  // Filter messages that are "public" (feedback/admin chat)
  const feedbackMessages = messages.filter(m => m.to === null);

  if (!user) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[100] h-16 w-16 rounded-3xl bg-slate-900 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        </div>
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-brand-500 border-4 border-slate-50 text-[10px] font-black flex items-center justify-center animate-bounce">
            {unreadCount}
          </div>
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 right-8 z-[100] w-[400px] h-[600px] bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-[60px] rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Bot size={28} className="text-brand-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Support & Feedback</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/30">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Sparkles size={12} className="text-brand-500" />
                  Official Support Channel
                </div>
                <p className="text-xs text-slate-400 mt-4 px-6">
                  Share your feedback or ask questions. Our team will get back to you here.
                </p>
              </div>

              {feedbackMessages.map((m, idx) => {
                const isMe = m.from === (user.id || user.email);
                return (
                  <motion.div
                    key={m.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {!isMe && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-2">
                        {m.fromName}
                      </span>
                    )}
                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                      isMe ? 'bg-brand-500 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    }`}>
                      <p className="text-sm leading-relaxed">{m.text}</p>
                      <p className={`text-[9px] mt-2 font-bold uppercase tracking-widest ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Type your feedback..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
                <Button 
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 shadow-xl"
                >
                  <Send size={20} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
