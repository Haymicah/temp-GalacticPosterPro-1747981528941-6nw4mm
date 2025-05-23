import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Trash2, Edit, Calendar, Clock, 
  Share2, Video, Image, FileText,
  Play, Heart, Bookmark, CalendarPlus,
  ArrowLeft, Link, Filter, X, Check,
  Maximize
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

interface EditPostModalProps {
  post: any;
  onClose: () => void;
  onSave: (post: any) => void;
}

function EditPostModal({ post, onClose, onSave }: EditPostModalProps) {
  const [editedPost, setEditedPost] = useState(post);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-terminal-black rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Edit Post</h3>
          <button onClick={onClose} className="p-2 hover:bg-terminal-darkGreen rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Title</label>
            <input
              type="text"
              value={editedPost.title || ''}
              onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
              className="w-full bg-terminal-darkGreen p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Content</label>
            <textarea
              value={editedPost.content}
              onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
              className="w-full h-32 bg-terminal-darkGreen p-2 rounded resize-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Scheduled Time</label>
            <input
              type="datetime-local"
              value={format(new Date(editedPost.scheduledTime || editedPost.timestamp), "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setEditedPost({ ...editedPost, scheduledTime: new Date(e.target.value) })}
              className="w-full bg-terminal-darkGreen p-2 rounded"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-terminal-green rounded hover:bg-terminal-darkGreen"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(editedPost);
                onClose();
              }}
              className="px-4 py-2 bg-terminal-green text-black rounded font-bold hover:bg-terminal-green/90"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-terminal-black rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
        <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-terminal-green rounded hover:bg-terminal-darkGreen"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface ScheduleDashboardProps {
  onBack: () => void;
}

function ScheduleDashboard({ onBack }: ScheduleDashboardProps) {
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [contentFilter, setContentFilter] = useState<'all' | 'video' | 'image' | 'blog'>('all');
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [deletingPost, setDeletingPost] = useState<string | null>(null);
  const { scheduledPosts, removeScheduledPost, updateScheduledPost } = useStore();

  const filteredPosts = scheduledPosts
    .filter(post => !post.isDeleted)
    .filter(post => contentFilter === 'all' || post.type === contentFilter)
    .sort((a, b) => {
      const timeA = new Date(a.scheduledTime || a.timestamp).getTime();
      const timeB = new Date(b.scheduledTime || b.timestamp).getTime();
      return timeA - timeB;
    });

  const handleSelectAll = useCallback(() => {
    if (selectedPosts.size === filteredPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(filteredPosts.map(post => post.id)));
    }
  }, [selectedPosts.size, filteredPosts]);

  const handleSelectPost = useCallback((postId: string) => {
    setSelectedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }, []);

  const handleBulkDelete = useCallback(() => {
    selectedPosts.forEach(id => removeScheduledPost(id));
    setSelectedPosts(new Set());
  }, [selectedPosts, removeScheduledPost]);

  return (
    <div className="bg-terminal-black text-terminal-green p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-terminal-darkGreen rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">Schedule Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className={cn(
                "px-4 py-2 rounded border-2 border-terminal-green",
                selectedPosts.size === filteredPosts.length
                  ? "bg-terminal-green text-black"
                  : "hover:bg-terminal-darkGreen"
              )}
            >
              {selectedPosts.size === filteredPosts.length ? 'Deselect All' : 'Select All'}
            </button>
            
            {selectedPosts.size > 0 && (
              <button
                onClick={() => setDeletingPost('bulk')}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Selected ({selectedPosts.size})
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <span className="font-bold">Filter:</span>
          <div className="flex space-x-2">
            {(['all', 'video', 'image', 'blog'] as const).map(type => (
              <button
                key={type}
                onClick={() => setContentFilter(type)}
                className={cn(
                  "px-4 py-2 rounded",
                  contentFilter === type
                    ? "bg-terminal-green text-black"
                    : "border-2 border-terminal-green hover:bg-terminal-darkGreen"
                )}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className={cn(
                "bg-terminal-darkGreen rounded-lg overflow-hidden",
                "border-2 transition-colors",
                selectedPosts.has(post.id)
                  ? "border-terminal-green"
                  : "border-terminal-green/30 hover:border-terminal-green"
              )}
              onClick={() => handleSelectPost(post.id)}
            >
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
                  >
                    <source src={post.video.url} type="video/mp4" />
                  </video>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold mb-2">{post.title || 'Untitled Post'}</h3>
                <p className="text-sm opacity-75 mb-2 line-clamp-2">{post.description}</p>
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="text-xs opacity-75 mb-2 line-clamp-1">
                    {post.hashtags.join(' ')}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs opacity-75">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(post.scheduledTime || post.timestamp), 'PPp')}</span>
                  </div>
                  {post.platform && (
                    <div className="flex items-center space-x-1 bg-terminal-green/20 px-2 py-1 rounded-full">
                      <Share2 className="w-3 h-3" />
                      <span>{post.platform}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPost(post);
                    }}
                    className="p-2 hover:bg-terminal-black rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingPost(post.id);
                    }}
                    className="p-2 hover:bg-terminal-black rounded text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {editingPost && (
          <EditPostModal
            post={editingPost}
            onClose={() => setEditingPost(null)}
            onSave={(updatedPost) => {
              updateScheduledPost(updatedPost);
              setEditingPost(null);
            }}
          />
        )}

        {deletingPost && (
          <DeleteConfirmModal
            onConfirm={() => {
              if (deletingPost === 'bulk') {
                handleBulkDelete();
              } else {
                removeScheduledPost(deletingPost);
              }
              setDeletingPost(null);
            }}
            onCancel={() => setDeletingPost(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export { ScheduleDashboard };