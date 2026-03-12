import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge, Input } from '../components/ui/BaseComponents';
import { 
  BookOpen, 
  Briefcase, 
  MessageCircle, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Edit2, 
  Check, 
  X, 
  Video, 
  Loader2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabaseData } from '../hooks/useSupabaseData';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { 
    data: updates, 
    addItem: addUpdate, 
    updateItem: updateUpdate, 
    deleteItem: deleteUpdate, 
    loading: updatesLoading 
  } = useSupabaseData('platform_updates', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const { 
    data: recentActivities, 
    loading: activitiesLoading 
  } = useSupabaseData('activities', {
    orderBy: { column: 'created_at', ascending: false },
    filter: isAdmin ? {} : { user_id: user.id }
  });

  const [editingUpdate, setEditingUpdate] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const handleEditUpdate = (update) => {
    setEditingUpdate(update.id);
    setEditForm({ title: update.title, description: update.description });
  };

  const handleSaveUpdate = async () => {
    try {
      if (editingUpdate && typeof editingUpdate === 'number') {
        await updateUpdate(editingUpdate, editForm);
      } else {
        await addUpdate({ ...editForm, user_id: user.id });
      }
      setEditingUpdate(null);
    } catch (err) {
      alert('Error saving update: ' + err.message);
    }
  };

  const stats = [
    { label: 'Applications', value: '12', icon: <Briefcase size={20} className="text-blue-600" />, change: '+2 this week' },
    { label: 'Courses', value: '4', icon: <BookOpen size={20} className="text-emerald-600" />, change: '2 in progress' },
    { label: 'Counseling', value: '2', icon: <MessageCircle size={20} className="text-brand-600" />, change: 'Next: tomorrow' },
    { label: 'Skill Score', value: '84', icon: <TrendingUp size={20} className="text-amber-600" />, change: '+5% increase' },
  ];

  // Example liveStats state
  const [liveStats, setLiveStats] = useState(stats);

  return (
    <div className="p-8 lg:p-12">
      <div className="mx-auto max-w-[1600px]">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">System Online</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-gradient italic font-serif font-normal">{user?.name?.split(' ')[0]}</span>.
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Profile Strength</p>
              <p className="text-lg font-bold text-slate-900">85% Complete</p>
            </div>
            <div className="h-12 w-32 bg-slate-100 rounded-2xl overflow-hidden p-1">
              <div className="h-full w-[85%] bg-brand-500 rounded-xl shadow-lg shadow-brand-500/20" />
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Main Hero Bento */}
          <div className="md:col-span-8 bento-item bg-slate-900 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <Badge className="bg-brand-500 text-white border-none rounded-full px-4 mb-8">Active Journey</Badge>
                <h2 className="text-4xl font-bold mb-4 leading-tight">Your career is on <br /> an upward trajectory.</h2>
                <p className="text-slate-400 max-w-md leading-relaxed">
                  Based on your recent activity, you're in the top 5% of candidates for Senior Frontend roles in your area.
                </p>
              </div>
              <div className="mt-12 flex flex-wrap gap-8">
                {stats.slice(0, 2).map((stat, i) => (
                  <div key={i}>
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-[10px] font-bold text-emerald-400 mt-1">{stat.change}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
                alt="Data" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-brand-500/20 blur-[100px] rounded-full" />
          </div>

          {/* Counseling Quick Action */}
          <div className="md:col-span-4 bento-item bg-brand-600 text-white super-shadow flex flex-col justify-between group">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-8">
              <MessageCircle size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">AI Counseling</h3>
              <p className="text-brand-100 text-sm leading-relaxed mb-8">
                Ready for your next session? Our AI is prepared with new insights for your resume.
              </p>
              <Link to="/counseling">
                <Button className="w-full bg-white text-brand-600 hover:bg-brand-50 border-none rounded-2xl py-6 font-bold uppercase tracking-widest text-[10px]">
                  Resume Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Activity Bento */}
          <div className="md:col-span-5 bento-item bg-white super-shadow border border-slate-100 p-0 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-brand-600 font-bold text-[10px] uppercase tracking-widest">View All</Button>
            </div>
            <div className="divide-y divide-slate-50">
              {activitiesLoading ? (
                <div className="p-8 flex justify-center"><Loader2 size={24} className="animate-spin text-brand-500" /></div>
              ) : recentActivities.length > 0 ? recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 px-8 py-5 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-white transition-colors">
                    {activity.type === 'course' && <BookOpen size={20} className="text-emerald-600" />}
                    {activity.type === 'job' && <Briefcase size={20} className="text-blue-600" />}
                    {activity.type === 'chat' && <MessageCircle size={20} className="text-brand-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{activity.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(activity.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-600 transition-colors" />
                </div>
              )) : (
                <div className="p-8 text-center text-slate-400 text-sm">No recent activity</div>
              )}
            </div>
          </div>

          {/* Stats Bento */}
          <div className="md:col-span-7 grid grid-cols-2 gap-6">
            {stats.slice(2).map((stat, idx) => (
              <StatCard 
                key={idx} 
                label={stat.label} 
                value={stat.value} 
                change={stat.change} 
                icon={stat.icon} 
              />
            ))}

            {/* Upcoming Session Bento */}
            <div className="col-span-2 bento-item bg-slate-50 border border-slate-200 flex items-center justify-between gap-8 group">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-white super-shadow text-brand-600 shrink-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">Mar</span>
                  <span className="text-2xl font-extrabold">05</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">Mock Interview Session</p>
                  <p className="text-sm text-slate-500">Sarah Miller • 2:00 PM (GMT+2)</p>
                </div>
              </div>
              <Link to="/meeting">
                <Button className="rounded-2xl bg-slate-900 text-white hover:bg-brand-600 px-8 py-6 font-bold uppercase tracking-widest text-[10px] border-none">
                  Join Room
                </Button>
              </Link>
            </div>
          </div>

          {/* Platform Updates Bento */}
          <div className="md:col-span-4 bento-item bg-white super-shadow border border-slate-100 group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Platform Updates</h3>
              {isAdmin && (
                <Button variant="ghost" size="sm" className="text-brand-600 font-bold text-[10px] uppercase tracking-widest" onClick={() => {
                  setEditingUpdate('new');
                  setEditForm({ title: 'New Update', description: 'Description here' });
                }}>
                  Add
                </Button>
              )}
            </div>
            <div className="space-y-8">
              {updatesLoading ? (
                <div className="flex justify-center"><Loader2 size={24} className="animate-spin text-brand-500" /></div>
              ) : updates.map((update) => (
                <div key={update.id} className="relative group pl-5 border-l-4 border-brand-500">
                  {editingUpdate === update.id ? (
                    <div className="space-y-3">
                      <Input 
                        value={editForm.title} 
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})} 
                        className="rounded-xl text-xs"
                      />
                      <textarea 
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-brand-500 transition-all"
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveUpdate} className="rounded-lg">Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingUpdate(null)} className="rounded-lg">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-slate-900">{update.title}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{update.description}</p>
                      {isAdmin && (
                        <div className="absolute right-0 top-0 hidden group-hover:flex gap-2">
                          <button onClick={() => handleEditUpdate(update)} className="text-slate-400 hover:text-brand-600 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => deleteUpdate(update.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {editingUpdate === 'new' && (
                <div className="relative group pl-5 border-l-4 border-brand-500">
                  <div className="space-y-3">
                    <Input 
                      value={editForm.title} 
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})} 
                      className="rounded-xl text-xs"
                    />
                    <textarea 
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-brand-500 transition-all"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveUpdate} className="rounded-lg">Create</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingUpdate(null)} className="rounded-lg">Cancel</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feedback & Community Bento */}
          <div className="md:col-span-8 bento-item bg-brand-50 border border-brand-100 flex flex-col md:flex-row gap-12 items-center group">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Help us shape the future.</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Your feedback directly influences our AI training models. Tell us what you need to succeed.
              </p>
              <textarea 
                className="w-full rounded-[2rem] border-none bg-white p-6 text-sm focus:ring-2 focus:ring-brand-500/20 mb-6 transition-all super-shadow"
                rows={3}
                placeholder="What feature should we build next?"
              />
              <Button className="rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 px-12 border-none uppercase tracking-widest text-[10px]">
                Submit Feedback
              </Button>
            </div>
            <div className="flex-1 relative hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square rounded-[2rem] bg-white super-shadow p-6 flex items-center justify-center">
                    <div className="h-full w-full rounded-2xl bg-slate-50 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon }) {
  return (
    <div className="bento-item bg-white super-shadow border border-slate-100 flex flex-col justify-between p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-emerald-600">{change}</span>
      </div>
      <div>
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}