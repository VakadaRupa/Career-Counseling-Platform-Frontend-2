import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card, Button, Input, Badge } from '../components/ui/BaseComponents';
import { BookOpen, Search, Plus, Edit2, Trash2, ExternalLink, PlayCircle, Sparkles, Loader2, GraduationCap, FileText, Filter, LayoutGrid, List, ArrowRight, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { searchWebResources, searchScholarlyResources } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { logActivity } from '../utils/activityLogger';

export default function Resources() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [searchType, setSearchType] = useState('general'); // 'general' or 'scholarly'
  const [viewMode, setViewMode] = useState('grid');

  const { data: resources, addItem, updateItem, deleteItem, loading: dataLoading } = useSupabaseData('resources', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const [isEditing, setIsEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', type: 'Course', category: 'General', description: '', image: '', link: '#' });

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAiSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const results = searchType === 'scholarly'
        ? await searchScholarlyResources(search)
        : await searchWebResources(search);
      setAiResults(results.map((r, i) => ({ ...r, id: `ai-${i}` })));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch real-time resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteItem(id);
      } catch (err) {
        alert('Error deleting resource: ' + err.message);
      }
    }
  };

  const handleEdit = (resource) => {
    setIsEditing(resource.id);
    setEditForm(resource);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateItem(isEditing, editForm);
      } else {
        await addItem({ ...editForm, user_id: user.id });
        await logActivity(user.id, 'course', `Added resource: ${editForm.title}`);
      }
      setIsEditing(null);
      setIsAdding(false);
      setEditForm({ title: '', type: 'Course', category: 'General', description: '', image: '', link: '#' });
    } catch (err) {
      alert('Error saving resource: ' + err.message);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({
      title: '',
      type: 'Course',
      category: 'General',
      description: '',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=600',
      link: '#'
    });
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-6">
            <div className="glass-card p-6 rounded-3xl perfect-shadow sticky top-28">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Search Engine</h2>
                <p className="text-xs text-slate-500">Find the best career assets.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="pl-10 rounded-2xl border-slate-200 focus:ring-brand-500"
                    placeholder="Keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSearchType('general')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${searchType === 'general' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                  >
                    <Sparkles size={18} />
                    General Discovery
                  </button>
                  <button
                    onClick={() => setSearchType('scholarly')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${searchType === 'scholarly' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                  >
                    <GraduationCap size={18} />
                    Scholarly Search
                  </button>
                </div>

                <Button
                  onClick={handleAiSearch}
                  disabled={loading || !search.trim()}
                  className="w-full py-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} className="mr-2" />}
                  {searchType === 'scholarly' ? 'Find Documents' : 'AI Discover'}
                </Button>
              </div>


        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Knowledge Base</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Resource <span className="text-gradient italic font-serif font-normal">Vault</span>.
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={20} />
              </button>
            </div>
            {isAdmin && (
              <Button onClick={handleAdd} className="rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-6 border-none uppercase tracking-widest text-[10px]">
                <Plus size={18} className="mr-2" />
                Add Resource
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {aiResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-16"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
                    {searchType === 'scholarly' ? <GraduationCap size={24} /> : <Sparkles size={24} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">AI Analysis Complete</p>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {searchType === 'scholarly' ? 'Scholarly Insights' : 'AI Discoveries'}
                    </h2>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setAiResults([])} className="text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                  Clear results
                </Button>
              </div>

              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {aiResults.map((resource) => (
                  <Card key={resource.id} className={`group overflow-hidden rounded-3xl border-slate-200 perfect-shadow transition-all hover:border-brand-300 ${searchType === 'scholarly' ? 'bg-slate-50' : 'bg-white'}`}>
                    {searchType === 'scholarly' ? (
                      <div className="p-8 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                          <Badge className="bg-slate-200 text-slate-700 rounded-full px-4 py-1 border-none font-medium">
                            {resource.type}
                          </Badge>
                          <span className="text-xs font-bold text-slate-400 font-mono">{resource.year || '2024'}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-brand-600 transition-colors">{resource.title}</h3>
                        <p className="text-sm font-semibold text-brand-600 mb-4 flex items-center gap-2">
                          <User size={14} /> {resource.authors}
                        </p>
                        <p className="text-sm text-slate-500 mb-8 line-clamp-4 leading-relaxed italic">"{resource.description}"</p>
                        <div className="mt-auto pt-6 border-t border-slate-100">
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full gap-2 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all"
                          >
                            <FileText size={18} /> Access Full Paper
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className={viewMode === 'list' ? 'flex flex-row h-48' : 'flex flex-col'}>
                        <div className={`${viewMode === 'list' ? 'w-64' : 'h-48'} overflow-hidden shrink-0`}>
                          <img
                            src={resource.image?.startsWith('http') ? resource.image : `https://picsum.photos/seed/${resource.title}/800/600`}
                            alt={resource.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <Badge className="bg-brand-50 text-brand-600 rounded-full px-3 py-1 border-none font-medium text-[10px] uppercase tracking-wider">
                              {resource.type}
                            </Badge>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{resource.category}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{resource.title}</h3>
                          <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">{resource.description}</p>
                          <div className="mt-auto">
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:gap-3 transition-all"
                            >
                              View Resource <ArrowRight size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assessment Banner */}




        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Curated Library</h2>
          <div className="h-px flex-1 mx-8 bg-slate-100" />
        </div>

        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {isAdding && (
            <Card className="p-8 border-2 border-dashed border-brand-300 bg-brand-50/30 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">New Resource</h3>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="rounded-xl"
                />
                <Input
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="rounded-xl"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1 rounded-xl">Create</Button>
                  <Button variant="ghost" onClick={() => setIsAdding(false)} className="flex-1 rounded-xl">Cancel</Button>
                </div>
              </div>
            </Card>
          )}

          {dataLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center">
              <Loader2 size={40} className="animate-spin text-brand-500 mb-4" />
              <p className="text-slate-400 font-medium">Loading vault...</p>
            </div>
          ) : filteredResources.map((resource) => (
            <Card key={resource.id} className={`group overflow-hidden rounded-3xl border-slate-200 bg-white perfect-shadow transition-all hover:border-brand-300 ${viewMode === 'list' ? 'flex flex-row h-48' : 'flex flex-col'}`}>
              <div className={`${viewMode === 'list' ? 'w-64' : 'h-56'} overflow-hidden shrink-0`}>
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                {isEditing === resource.id ? (
                  <div className="space-y-4">
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Title"
                      className="rounded-xl"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave} className="rounded-xl">Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditing(null)} className="rounded-xl">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-slate-100 text-slate-600 rounded-full px-3 py-1 border-none font-medium text-[10px] uppercase tracking-wider">
                        {resource.type}
                      </Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{resource.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">{resource.title}</h3>
                    <p className="text-sm text-slate-500 mb-8 line-clamp-2 leading-relaxed">{resource.description}</p>

                    <div className="mt-auto flex items-center justify-between">
                      <Button variant="ghost" className="p-0 text-brand-600 hover:bg-transparent hover:text-brand-700 font-bold flex items-center gap-2">
                        {resource.type === 'Course' ? <PlayCircle size={20} /> : <ExternalLink size={20} />}
                        {resource.type === 'Course' ? 'Start Learning' : 'Open Resource'}
                      </Button>

                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(resource)} className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(resource.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
      </div >
    </div >
  );
}
