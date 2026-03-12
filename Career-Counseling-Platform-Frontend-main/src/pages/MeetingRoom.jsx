import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { Card, Button, Badge, Input } from '../components/ui/BaseComponents';
import { Video, VideoOff, Mic, MicOff, Settings, ExternalLink, Camera, Monitor } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function MeetingRoom() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Session setup
  const { session } = location.state || {};
  const defaultSession = {
    id: 1,
    title: 'Career Consultation',
    expert: 'Sarah Miller',
    link: 'https://meet.google.com/hbd-bqco-cqe', // persistent link
  };
  const safeSession = session || defaultSession;

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [error, setError] = useState(null);

  const [isEditingLink, setIsEditingLink] = useState(false);
  const [editLinkValue, setEditLinkValue] = useState(safeSession.link);
  const [currentLink, setCurrentLink] = useState(safeSession.link);

  // Fetch latest session link for users periodically
  useEffect(() => {
    if (!isAdmin) {
      const interval = setInterval(async () => {
        try {
          const res = await axios.get(`/api/sessions/${safeSession.id}`);
          if (res.data?.link && res.data.link !== currentLink) {
            setCurrentLink(res.data.link);
          }
        } catch (err) {
          console.error("Failed to fetch session link:", err);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, safeSession.id, currentLink]);

  // Start camera and microphone
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsVideoOn(true);
      setIsMicOn(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setIsVideoOn(false);
      setIsMicOn(false);
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError("No camera or microphone found on this device.");
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Camera/Microphone access denied. Allow permissions in browser settings.");
      } else {
        setError("Could not access camera/microphone: " + err.message);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    } else if (error) startCamera();
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    } else if (error) startCamera();
  };

  const handleSaveLink = async () => {
    try {
      await axios.put(`/api/sessions/${safeSession.id}`, { link: editLinkValue });
      setCurrentLink(editLinkValue); // update link for everyone
      setIsEditingLink(false);
    } catch (err) {
      console.error("Failed to update link:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" 
          alt="Meeting Background" 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900" />
      </div>

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Camera Preview */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video rounded-2xl bg-black overflow-hidden shadow-2xl ring-1 ring-white/10">
              {stream ? (
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover mirror" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gray-800">
                  <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center">
                    <VideoOff size={48} className="text-gray-500" />
                  </div>
                  <p className="mt-4 text-gray-400">{error || "Camera is not available"}</p>
                  <Button onClick={startCamera} variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10">
                    Retry Camera
                  </Button>
                </div>
              )}

              {/* Overlay Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                <button onClick={toggleMic} className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${isMicOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'}`}>
                  {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                <button onClick={toggleVideo} className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${isVideoOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'}`}>
                  {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Meeting Info */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="bg-gray-800 border-white/10 p-8 text-white">
              <Badge variant="info" className="mb-4">Live Session</Badge>
              <h2 className="text-2xl font-bold mb-2">{safeSession.title}</h2>

              {/* Current link */}
              <p className="text-gray-400 mb-4">
                Meeting Link: <span className="text-white font-medium ml-1">{currentLink || "No link available"}</span>
              </p>

              {/* Admin edit */}
              {isAdmin && !isEditingLink && (
                <button onClick={() => setIsEditingLink(true)} className="text-sm text-gray-400 hover:text-white mb-4">
                  Edit Meeting Link
                </button>
              )}
              {isAdmin && isEditingLink && (
                <div className="flex gap-2 mb-4">
                  <Input
                    value={editLinkValue}
                    onChange={e => setEditLinkValue(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="flex-1 bg-gray-700 text-white"
                  />
                  <Button
                    onClick={handleSaveLink}
                    className="px-3 py-1 bg-indigo-600 rounded text-white"
                  >
                    Save
                  </Button>
                </div>
              )}

              {/* Status */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-400"><Camera size={16} /> <span>Camera: {isVideoOn ? 'Working' : 'Off'}</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-400"><Mic size={16} /> <span>Microphone: {isMicOn ? 'Working' : 'Off'}</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-400"><Monitor size={16} /> <span>Network: Stable</span></div>
              </div>

              {/* Join Button */}
              <Button
                onClick={() => window.open(currentLink, '_blank')}
                className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700 border-none"
              >
                Join Google Meet
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>

              <p className="mt-4 text-center text-xs text-gray-500">
                Clicking join will open Google Meet in a new tab.
              </p>
            </Card>

            <Card className="bg-gray-800/50 border-white/5 p-6 text-white">
              <h4 className="font-semibold mb-3">Meeting Tips</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Find a quiet place for the session</li>
                <li>• Use headphones for better audio</li>
                <li>• Ensure your background is professional</li>
                <li>• Have your resume ready for sharing</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}