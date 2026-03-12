import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Badge } from '../components/ui/BaseComponents';
import { User, Mail, Shield, Save, Camera, Video, VideoOff } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionate professional looking for new opportunities.',
    location: 'San Francisco, CA'
  });

  const [showCameraTest, setShowCameraTest] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCameraTest(true);
    } catch (err) {
      alert('Could not access camera: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCameraTest(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="h-48 w-full bg-indigo-600 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" 
          alt="Profile Banner" 
          className="h-full w-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <header className="mb-8 flex items-end justify-between">
          <div className="flex items-end gap-6">
            <div className="h-32 w-32 rounded-3xl bg-white p-2 shadow-xl">
              <div className="h-full w-full rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-50 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                  alt={user?.name} 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="pb-2">
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Badge variant="info" className="capitalize">{user?.role}</Badge>
                • {formData.location}
              </p>
            </div>
          </div>
          <div className="pb-2">
            <Button variant="outline" onClick={showCameraTest ? stopCamera : startCamera} className="bg-white">
              {showCameraTest ? <VideoOff size={18} className="mr-2" /> : <Video size={18} className="mr-2" />}
              {showCameraTest ? 'Stop Camera Test' : 'Test Camera'}
            </Button>
          </div>
        </header>

        {showCameraTest && (
          <Card className="mb-8 overflow-hidden bg-black aspect-video relative shadow-2xl ring-1 ring-gray-900/10">
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            <div className="absolute bottom-4 left-4">
              <Badge variant="success">Camera Working</Badge>
            </div>
          </Card>
        )}

        <Card className="p-8 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <Input 
                  value={formData.email} 
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Input 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Security</label>
                <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500">
                  <Shield size={16} />
                  <span>Verified Account</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
              <textarea 
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume / CV</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOCX or TXT (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => alert(`File "${e.target.files[0].name}" selected!`)} />
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">
                <Save size={18} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-8 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-8 py-4 bg-gray-50/50">
            <h2 className="font-semibold text-gray-900">Payment History</h2>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-8 py-3">Date</th>
                  <th className="px-8 py-3">Plan</th>
                  <th className="px-8 py-3">Amount</th>
                  <th className="px-8 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-8 py-4 text-gray-900">Mar 01, 2024</td>
                  <td className="px-8 py-4 text-gray-900 font-medium">Pro Monthly</td>
                  <td className="px-8 py-4 text-gray-900">$19.00</td>
                  <td className="px-8 py-4"><Badge variant="success">Paid</Badge></td>
                </tr>
                <tr>
                  <td className="px-8 py-4 text-gray-900">Feb 01, 2024</td>
                  <td className="px-8 py-4 text-gray-900 font-medium">Pro Monthly</td>
                  <td className="px-8 py-4 text-gray-900">$19.00</td>
                  <td className="px-8 py-4"><Badge variant="success">Paid</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
