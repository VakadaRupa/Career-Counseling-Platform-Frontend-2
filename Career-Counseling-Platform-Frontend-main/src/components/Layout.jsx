import React, { useState } from 'react';
import Sidebar from './Sidebar';
import FeedbackChat from './FeedbackChat';
import { Bell, Search, User, Menu, X } from 'lucide-react';
import { Button } from './ui/BaseComponents';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Side Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-[0.16,1,0.3,1] ${isSidebarOpen ? 'lg:ml-80' : 'ml-0'}`}>
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2"
              aria-label="Toggle Menu"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Menu</span>
            </button>

            <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Link to="/dashboard" className="hover:text-brand-600 transition-colors">Home</Link>
              <span className="text-slate-200">/</span>
              <span className="text-slate-900 truncate max-w-[80px] md:max-w-none">{location.pathname.split('/')[1] || 'Dashboard'}</span>
            </div>
            <div className="h-4 w-px bg-slate-100 mx-4 hidden lg:block" />
            <div className="flex-1 max-w-md relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="ghost" size="sm" className="rounded-xl text-slate-500 hover:bg-slate-50">
                <Bell size={20} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-500 border-2 border-white"></span>
              </Button>
            </div>
            
            <div className="h-8 w-px bg-slate-100 mx-2" />

            <Link to="/profile" className="flex items-center gap-3 pl-2 group">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-bold text-slate-900 leading-none group-hover:text-brand-600 transition-colors">My Account</span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Settings</span>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-brand-300 transition-colors overflow-hidden">
                <User size={20} />
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
        <FeedbackChat />
      </div>
    </div>
  );
}
