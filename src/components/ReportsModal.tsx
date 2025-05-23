import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  BarChart3, PieChart, LineChart, X,
  Facebook, Twitter, Instagram, Youtube,
  Linkedin, Globe, ArrowUp, ArrowDown,
  Video, Image, FileText, Share2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

interface ReportsModalProps {
  onClose: () => void;
}

export function ReportsModal({ onClose }: ReportsModalProps) {
  const { scheduledPosts } = useStore();

  // Calculate statistics
  const stats = {
    total: scheduledPosts.length,
    videos: scheduledPosts.filter(post => post.type === 'video').length,
    images: scheduledPosts.filter(post => post.type === 'image').length,
    blogs: scheduledPosts.filter(post => post.type === 'blog').length,
    platforms: {
      facebook: scheduledPosts.filter(post => post.platform === 'facebook').length,
      twitter: scheduledPosts.filter(post => post.platform === 'twitter').length,
      instagram: scheduledPosts.filter(post => post.platform === 'instagram').length,
      youtube: scheduledPosts.filter(post => post.platform === 'youtube').length,
      linkedin: scheduledPosts.filter(post => post.platform === 'linkedin').length,
      other: scheduledPosts.filter(post => !['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].includes(post.platform || '')).length
    },
    engagement: {
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 1000),
      shares: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 300)
    },
    growth: {
      followers: {
        value: 12.5,
        trend: 'up' as const
      },
      engagement: {
        value: 8.3,
        trend: 'up' as const
      },
      reach: {
        value: 15.7,
        trend: 'up' as const
      },
      clicks: {
        value: -2.4,
        trend: 'down' as const
      }
    }
  };

  const renderTrendIndicator = (value: number, trend: 'up' | 'down') => (
    <div className={cn(
      "flex items-center space-x-1",
      trend === 'up' ? "text-green-500" : "text-red-500"
    )}>
      {trend === 'up' ? (
        <ArrowUp className="w-4 h-4" />
      ) : (
        <ArrowDown className="w-4 h-4" />
      )}
      <span className="text-sm">{Math.abs(value)}%</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-terminal-black w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Campaign Reports</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-terminal-darkGreen rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span className="font-bold">Videos</span>
              </div>
              {renderTrendIndicator(stats.growth.engagement.value, stats.growth.engagement.trend)}
            </div>
            <div className="text-3xl font-bold mb-1">{stats.videos}</div>
            <div className="text-sm opacity-75">Total videos created</div>
          </div>

          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Image className="w-5 h-5" />
                <span className="font-bold">Images</span>
              </div>
              {renderTrendIndicator(stats.growth.reach.value, stats.growth.reach.trend)}
            </div>
            <div className="text-3xl font-bold mb-1">{stats.images}</div>
            <div className="text-sm opacity-75">Total images created</div>
          </div>

          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span className="font-bold">Blog Posts</span>
              </div>
              {renderTrendIndicator(stats.growth.followers.value, stats.growth.followers.trend)}
            </div>
            <div className="text-3xl font-bold mb-1">{stats.blogs}</div>
            <div className="text-sm opacity-75">Total blogs written</div>
          </div>

          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span className="font-bold">Total Posts</span>
              </div>
              {renderTrendIndicator(stats.growth.clicks.value, stats.growth.clicks.trend)}
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm opacity-75">Posts scheduled</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-terminal-darkGreen p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Content Distribution</span>
            </h3>
            <div className="flex items-end space-x-4 h-48">
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-terminal-green rounded-t"
                  style={{ height: `${(stats.videos / stats.total) * 100}%` }}
                />
                <span className="mt-2 text-sm">Videos</span>
                <span className="text-xs opacity-75">{Math.round((stats.videos / stats.total) * 100)}%</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-terminal-green rounded-t"
                  style={{ height: `${(stats.images / stats.total) * 100}%` }}
                />
                <span className="mt-2 text-sm">Images</span>
                <span className="text-xs opacity-75">{Math.round((stats.images / stats.total) * 100)}%</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-terminal-green rounded-t"
                  style={{ height: `${(stats.blogs / stats.total) * 100}%` }}
                />
                <span className="mt-2 text-sm">Blogs</span>
                <span className="text-xs opacity-75">{Math.round((stats.blogs / stats.total) * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-terminal-darkGreen p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Platform Distribution</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(stats.platforms).map(([platform, count]) => (
                <div key={platform} className="flex items-center space-x-2">
                  {platform === 'facebook' && <Facebook className="w-4 h-4" />}
                  {platform === 'twitter' && <Twitter className="w-4 h-4" />}
                  {platform === 'instagram' && <Instagram className="w-4 h-4" />}
                  {platform === 'youtube' && <Youtube className="w-4 h-4" />}
                  {platform === 'linkedin' && <Linkedin className="w-4 h-4" />}
                  {platform === 'other' && <Globe className="w-4 h-4" />}
                  <div>
                    <div className="capitalize">{platform}</div>
                    <div className="text-sm opacity-75">{count} posts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-terminal-darkGreen p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <LineChart className="w-5 h-5" />
            <span>Engagement Overview</span>
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-terminal-black rounded-lg">
              <div className="text-sm opacity-75 mb-1">Total Views</div>
              <div className="text-2xl font-bold">{stats.engagement.views.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-terminal-black rounded-lg">
              <div className="text-sm opacity-75 mb-1">Total Likes</div>
              <div className="text-2xl font-bold">{stats.engagement.likes.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-terminal-black rounded-lg">
              <div className="text-sm opacity-75 mb-1">Total Shares</div>
              <div className="text-2xl font-bold">{stats.engagement.shares.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-terminal-black rounded-lg">
              <div className="text-sm opacity-75 mb-1">Total Comments</div>
              <div className="text-2xl font-bold">{stats.engagement.comments.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}