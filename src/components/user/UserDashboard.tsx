import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Users, DollarSign, Activity,
  Calendar, Video, Image as ImageIcon, FileText,
  Clock, Share2, Settings2, LogOut, User, Mail,
  Globe, MapPin, Phone, Save, X, Check
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface UserProfile {
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  location: string | null;
  phone: string | null;
  bio: string | null;
}

export function UserDashboard() {
  const { user, signOut, updateProfile } = useAuth();
  const { scheduledPosts } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    full_name: user?.full_name || null,
    avatar_url: user?.avatar_url || null,
    website: user?.website || null,
    location: user?.location || null,
    phone: user?.phone || null,
    bio: user?.bio || null
  });

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || null,
        avatar_url: user.avatar_url || null,
        website: user.website || null,
        location: user.location || null,
        phone: user.phone || null,
        bio: user.bio || null
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await updateProfile(profile);
      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsEditing(false);
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const stats = {
    totalPosts: scheduledPosts.length,
    videos: scheduledPosts.filter(post => post.type === 'video').length,
    images: scheduledPosts.filter(post => post.type === 'image').length,
    blogs: scheduledPosts.filter(post => post.type === 'blog').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-terminal-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-black text-terminal-green p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-terminal-green flex items-center justify-center">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || ''} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-black" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.full_name || 'Welcome'}</h1>
              <p className="text-sm opacity-75">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-terminal-darkGreen rounded-full"
            >
              <Settings2 className="w-6 h-6" />
            </button>
            <button
              onClick={() => signOut()}
              className="p-2 hover:bg-terminal-darkGreen rounded-full"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Profile Edit Modal */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-terminal-black w-full max-w-lg rounded-lg p-6 relative"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-terminal-darkGreen rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-terminal-green/20 border border-terminal-green rounded flex items-center space-x-2"
                >
                  <Check className="w-5 h-5 text-terminal-green" />
                  <span>Profile updated successfully!</span>
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile(p => ({ ...p, full_name: e.target.value }))}
                    className="w-full bg-terminal-darkGreen p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Website</label>
                  <input
                    type="url"
                    value={profile.website || ''}
                    onChange={(e) => setProfile(p => ({ ...p, website: e.target.value }))}
                    className="w-full bg-terminal-darkGreen p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                    className="w-full bg-terminal-darkGreen p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-terminal-darkGreen p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Bio</label>
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                    className="w-full h-32 bg-terminal-darkGreen p-2 rounded resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-terminal-green rounded hover:bg-terminal-darkGreen"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 bg-terminal-green text-black rounded font-bold hover:bg-terminal-green/90 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span className="font-bold">Total Posts</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.totalPosts}</div>
          </div>
          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span className="font-bold">Videos</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.videos}</div>
          </div>
          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span className="font-bold">Images</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.images}</div>
          </div>
          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span className="font-bold">Blog Posts</span>
              </div>
            </div>
            <div className="text-3xl font-bold">{stats.blogs}</div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-terminal-darkGreen p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {scheduledPosts.slice(0, 8).map(post => (
              <div key={post.id} className="bg-terminal-black rounded-lg overflow-hidden">
                {post.image && (
                  <div className="aspect-video relative">
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {post.video && (
                  <div className="aspect-video relative">
                    <video
                      src={post.video.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold mb-2">{post.title || 'Untitled Post'}</h3>
                  <p className="text-sm opacity-75 mb-2 line-clamp-2">
                    {post.description || post.content}
                  </p>
                  <div className="flex items-center justify-between text-xs opacity-75">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{format(post.scheduledTime || post.timestamp, 'PPp')}</span>
                    </div>
                    {post.platform && (
                      <div className="flex items-center space-x-1 bg-terminal-green/20 px-2 py-1 rounded-full">
                        <Share2 className="w-3 h-3" />
                        <span>{post.platform}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Calendar */}
        <div className="bg-terminal-darkGreen p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Upcoming Schedule</h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const posts = scheduledPosts.filter(post => {
                const postDate = new Date(post.scheduledTime || post.timestamp);
                return postDate.toDateString() === date.toDateString();
              });

              return (
                <div
                  key={i}
                  className={cn(
                    "bg-terminal-black p-4 rounded-lg",
                    i === 0 && "border-2 border-terminal-green"
                  )}
                >
                  <div className="text-sm font-bold mb-2">
                    {format(date, 'EEE, MMM d')}
                  </div>
                  <div className="text-xs opacity-75">
                    {posts.length} posts scheduled
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}