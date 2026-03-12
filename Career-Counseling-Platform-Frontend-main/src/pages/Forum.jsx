import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card, Button, Input, Badge } from '../components/ui/BaseComponents';
import { MessageSquare, ThumbsUp, MessageCircle, Search, Plus, Trash2, Loader2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { logActivity } from '../utils/activityLogger';

export default function Forum() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [search, setSearch] = useState('');
  
  const { data: posts, addItem, deleteItem, loading: dataLoading } = useSupabaseData('forum_posts', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [showAdd, setShowAdd] = useState(false);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      await addItem({
        author: user?.name || 'Anonymous',
        ...newPost,
        likes: 0,
        comments: 0,
        user_id: user.id
      });
      await logActivity(user.id, 'chat', `Posted in forum: ${newPost.title}`);
      setNewPost({ title: '', content: '', category: 'General' });
      setShowAdd(false);
    } catch (err) {
      alert('Error posting to forum: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this post?')) {
      try {
        await deleteItem(id);
      } catch (err) {
        alert('Error deleting post: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community Forum</h1>
            <p className="text-gray-600">Connect, share, and learn from fellow professionals.</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)}>
            <Plus size={18} className="mr-2" />
            New Post
          </Button>
        </header>

        {showAdd && (
          <Card className="mb-8 p-6">
            <form onSubmit={handleAddPost} className="space-y-4">
              <Input 
                placeholder="Topic Title" 
                value={newPost.title} 
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                required
              />
              <Input 
                placeholder="Category (e.g., Interview, Tech, Career)" 
                value={newPost.category} 
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              />
              <textarea 
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                required
              />
              <div className="flex gap-2">
                <Button type="submit">Post to Forum</Button>
                <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        <div className="mb-8 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </div>
          <Input
            className="pl-10"
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {dataLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 size={40} className="animate-spin text-brand-500 mb-4" />
              <p className="text-slate-400 font-medium">Loading discussions...</p>
            </div>
          ) : filteredPosts.map((post) => (
            <Card key={post.id} className="p-6 hover:border-indigo-200 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="info">{post.category}</Badge>
                <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.content}</p>
              
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} 
                        alt={post.author} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-700">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <span className="flex items-center gap-1 text-xs hover:text-indigo-600 transition-colors"><ThumbsUp size={14} /> {post.likes}</span>
                    <span className="flex items-center gap-1 text-xs hover:text-indigo-600 transition-colors"><MessageCircle size={14} /> {post.comments}</span>
                  </div>
                </div>
                {isAdmin && (
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }} className="text-red-500">
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
