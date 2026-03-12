import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/BaseComponents';
import { Send, Loader2, User, Bot, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/utils';

export default function Counseling() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: "Hello! I'm your Career Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history] = useState([
    { id: 1, title: 'Software Engineering Path' },
    { id: 2, title: 'Product Management Tips' }
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await getChatResponse([...messages, userMessage]);
      const assistantMessage = { id: Date.now() + 1, role: 'assistant', text: responseText };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Chat History */}
        <aside className="hidden w-64 flex-col border-r border-gray-200 bg-gray-50 md:flex">
          <div className="p-4">
            <Button variant="outline" className="w-full justify-start gap-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
              <Plus size={16} />
              New Chat
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Recent Chats</p>
            <div className="space-y-1">
              {history.map((chat) => (
                <button
                  key={chat.id}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                >
                  <MessageSquare size={16} className="shrink-0 text-gray-400" />
                  <span className="flex-1 truncate">{chat.title}</span>
                  <Trash2 size={14} className="hidden group-hover:block text-gray-400 hover:text-red-500" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="relative flex flex-1 flex-col overflow-hidden bg-gray-50/50">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" 
              alt="Counseling Background" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-8 md:px-0 relative z-10"
          >
            <div className="mx-auto max-w-3xl space-y-8">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 md:gap-6"
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-sm",
                      msg.role === 'assistant' ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white"
                    )}>
                      {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className="flex-1 space-y-2 overflow-hidden">
                      <p className="text-sm font-bold text-gray-900 capitalize">{msg.role}</p>
                      <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {loading && (
                <div className="flex gap-4 md:gap-6">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-emerald-600 text-white">
                    <Bot size={20} />
                  </div>
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 bg-white p-4 md:p-8">
            <div className="mx-auto max-w-3xl">
              <form 
                onSubmit={handleSend}
                className="relative flex items-center"
              >
                <textarea
                  rows={1}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white py-4 pl-4 pr-12 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ask me anything about your career..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
