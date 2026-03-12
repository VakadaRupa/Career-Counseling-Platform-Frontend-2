import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Briefcase, MessageSquare, BookOpen, LayoutDashboard, MessageCircle, Shield, CreditCard, Bell } from 'lucide-react';
import { Button } from './ui/BaseComponents';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  const notifications = [
    { id: 1, text: 'Your resume review is ready!', time: '2h ago' },
    { id: 2, text: 'New job match: Senior React Dev', time: '5h ago' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">CP</div>
            <span className="text-xl font-bold tracking-tight text-gray-900">CareerPath AI</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
              {isAdmin && <NavLink to="/admin" icon={<Shield size={18} />} label="Admin" />}
              <NavLink to="/counseling" icon={<MessageCircle size={18} />} label="Counseling" />
              <NavLink to="/resources" icon={<BookOpen size={18} />} label="Resources" />
              <NavLink to="/jobs" icon={<Briefcase size={18} />} label="Jobs" />
              <NavLink to="/forum" icon={<MessageSquare size={18} />} label="Forum" />
              <NavLink to="/pricing" icon={<CreditCard size={18} />} label="Pricing" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell size={18} className="text-gray-500" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 uppercase">Notifications</span>
                      <button className="text-[10px] text-indigo-600 font-bold hover:underline">Clear all</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                          <p className="text-sm text-gray-800">{n.text}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <User size={16} />
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="text-gray-500">
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-indigo-600"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
