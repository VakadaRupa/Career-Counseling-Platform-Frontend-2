import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card, Button, Input, Badge } from '../components/ui/BaseComponents';
import { Briefcase, Search, MapPin, DollarSign, Clock, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { logActivity } from '../utils/activityLogger';

export default function JobBoard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [search, setSearch] = useState('');
  const [naukriExtension, setNaukriExtension] = useState(false);
  
  const { data: jobs, addItem, updateItem, deleteItem, loading: dataLoading } = useSupabaseData('jobs', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const naukriJobs = [
    { id: 'n1', title: 'Full Stack Developer', company: 'Infosys', location: 'Bangalore', salary: '₹12L - ₹20L', type: 'Full-time', posted: 'Naukri', logo: 'https://static.naukimg.com/s/4/100/i/naukri_Logo.png', isExternal: true },
    { id: 'n2', title: 'Data Scientist', company: 'TCS', location: 'Mumbai', salary: '₹15L - ₹25L', type: 'Full-time', posted: 'Naukri', logo: 'https://static.naukimg.com/s/4/100/i/naukri_Logo.png', isExternal: true },
  ];

  const displayJobs = naukriExtension ? [...jobs, ...naukriJobs] : jobs;

  const [isEditing, setIsEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', company: '', location: '', salary: '', type: 'Full-time', logo: '' });

  const filteredJobs = displayJobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm('Delete this job listing?')) {
      try {
        await deleteItem(id);
      } catch (err) {
        alert('Error deleting job: ' + err.message);
      }
    }
  };

  const handleEdit = (job) => {
    setIsEditing(job.id);
    setEditForm(job);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateItem(isEditing, editForm);
      } else {
        await addItem({ ...editForm, user_id: user.id });
        await logActivity(user.id, 'job', `Posted job: ${editForm.title} at ${editForm.company}`);
      }
      setIsEditing(null);
      setIsAdding(false);
      setEditForm({ title: '', company: '', location: '', salary: '', type: 'Full-time', logo: '' });
    } catch (err) {
      alert('Error saving job: ' + err.message);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({
      title: '',
      company: '',
      location: '',
      salary: '',
      type: 'Full-time',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=100'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
            <p className="text-gray-600">Find your next career move.</p>
          </div>
          {isAdmin && (
            <Button onClick={handleAdd}>
              <Plus size={18} className="mr-2" />
              Post Job
            </Button>
          )}
        </header>

        <div className="mb-8 relative flex gap-4">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </div>
            <Input
              className="pl-10"
              placeholder="Search jobs by title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="border-brand-200 text-brand-600 hover:bg-brand-50"
            onClick={() => window.open(`https://www.naukri.com/${search.replace(/\s+/g, '-')}-jobs`, '_blank')}
          >
            Search on Naukri
          </Button>
        </div>

        {/* Naukri Extension Banner */}
        <Card className={`mb-8 p-6 transition-all duration-500 border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 ${naukriExtension ? 'bg-blue-600 text-white border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center p-2">
              <img src="https://static.naukimg.com/s/4/100/i/naukri_Logo.png" alt="Naukri" className="w-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${naukriExtension ? 'text-white' : 'text-blue-900'}`}>Naukri Extension {naukriExtension ? 'Active' : 'Available'}</h3>
              <p className={`text-sm ${naukriExtension ? 'text-blue-100' : 'text-blue-700'}`}>
                {naukriExtension ? 'External jobs from Naukri.com are now visible in your feed.' : 'Enable Naukri integration to see more job opportunities from external sources.'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              size="sm" 
              className={naukriExtension ? "bg-white text-blue-600 hover:bg-blue-50" : "bg-blue-600 hover:bg-blue-700 text-white"}
              onClick={() => setNaukriExtension(!naukriExtension)}
            >
              {naukriExtension ? 'Disable Extension' : 'Enable Extension'}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className={naukriExtension ? "border-white/30 text-white hover:bg-white/10" : "border-blue-200 text-blue-600 hover:bg-blue-50"}
              onClick={() => window.open('https://www.naukri.com/', '_blank')}
            >
              Visit Naukri
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {isAdding && (
            <Card className="p-8 border-2 border-dashed border-brand-300 bg-brand-50/30 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Post New Job</h3>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input placeholder="Job Title" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
                <Input placeholder="Company" value={editForm.company} onChange={(e) => setEditForm({...editForm, company: e.target.value})} />
                <Input placeholder="Location" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
                <Input placeholder="Salary" value={editForm.salary} onChange={(e) => setEditForm({...editForm, salary: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="rounded-xl">Post Listing</Button>
                <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl">Cancel</Button>
              </div>
            </Card>
          )}

          {dataLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 size={40} className="animate-spin text-brand-500 mb-4" />
              <p className="text-slate-400 font-medium">Loading opportunities...</p>
            </div>
          ) : filteredJobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
              {isEditing === job.id ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} placeholder="Title" />
                  <Input value={editForm.company} onChange={(e) => setEditForm({...editForm, company: e.target.value})} placeholder="Company" />
                  <Input value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} placeholder="Location" />
                  <Input value={editForm.salary} onChange={(e) => setEditForm({...editForm, salary: e.target.value})} placeholder="Salary" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-gray-100">
                      <img 
                        src={job.logo} 
                        alt={job.company} 
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                        {job.isExternal && (
                          <Badge variant="info" className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] py-0 px-1.5">Naukri</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-600">{job.company}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {job.posted}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={job.type === 'Full-time' ? 'success' : 'info'}>{job.type}</Badge>
                    <Button size="sm">Apply Now</Button>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(job)}><Edit2 size={16} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)} className="text-red-500"><Trash2 size={16} /></Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
