import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Clock, Settings2, Upload, 
  Play, Pause, X, Download, Share2,
  Calendar, RefreshCw, Trash2
} from 'lucide-react';
import { VideoGenerationSettings } from '../types/video';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { VideoPreview } from './VideoPreview';
import { format } from 'date-fns';

export function VideoPost() {
  const [settings, setSettings] = useState<VideoGenerationSettings>({
    count: 1,
    creativity: 0.7,
    category: 'how-to',
    style: 'digital-art',
    language: 'en',
    videoSize: 'landscape-hd',
    customVideo: null,
    textOverlay: {
      enabled: false,
      text: '',
      font: 'Arial',
      size: 48,
      color: '#FFFFFF',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'center',
      padding: 20
    },
    scheduling: {
      randomized: false,
      timeWindow: {
        start: '09:00',
        end: '17:00'
      },
      dailyLimit: 5
    },
    platforms: []
  });

  const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'style' | 'size' | 'text' | 'platforms' | 'schedule'>('style');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getScheduledPostsByType, removeScheduledPost } = useStore();
  const videoSchedule = getScheduledPostsByType('video');

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setVideoPreviews(prev => [...prev, ...newPreviews]);
    setUploadedVideos(prev => [...prev, ...files]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeVideo = (index: number) => {
    URL.revokeObjectURL(videoPreviews[index]);
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setIsProcessing(true);

    try {
      // Simulate video processing
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error processing video:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Settings */}
      <div className="bg-terminal-darkGreen p-6 rounded-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Number of Videos to Generate: {settings.count}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.count}
              onChange={(e) => setSettings(s => ({ ...s, count: parseInt(e.target.value) }))}
              className="w-full h-2 bg-terminal-black rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs mt-1">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Quality Level: {Math.round(settings.creativity * 100)}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(settings.creativity * 100)}
              onChange={(e) => setSettings(s => ({ ...s, creativity: parseInt(e.target.value) / 100 }))}
              className="w-full h-2 bg-terminal-black rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs mt-1">
              <span>Basic</span>
              <span>Standard</span>
              <span>Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Style Settings */}
      <div className="bg-terminal-darkGreen p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Video Style</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'digital-art', label: 'Digital Art' },
            { value: 'photographic', label: 'Photographic' },
            { value: 'pop', label: 'Pop' },
            { value: 'cyberpunk', label: 'Cyberpunk' },
            { value: 'anime', label: 'Anime' },
            { value: 'neon-punk', label: 'Neon Punk' },
            { value: 'realistic', label: 'Realistic' },
            { value: 'comic', label: 'Comic' },
            { value: 'tiktok', label: 'TikTok' }
          ].map(style => (
            <button
              key={style.value}
              onClick={() => setSettings(s => ({ ...s, style: style.value as any }))}
              className={cn(
                "p-3 rounded border-2 border-terminal-green text-left",
                settings.style === style.value
                  ? "bg-terminal-darkGreen"
                  : "hover:bg-terminal-black/20"
              )}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size Settings */}
      <div className="bg-terminal-darkGreen p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Video Size</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'landscape-hd', label: 'Landscape HD', size: '1920×1080' },
            { value: 'landscape-4k', label: '4K', size: '3840×2160' },
            { value: 'portrait-hd', label: 'Portrait', size: '1080×1920' },
            { value: 'square-1080', label: 'Square', size: '1080×1080' },
            { value: 'portrait-tiktok', label: 'TikTok', size: '1080×1920' },
            { value: 'landscape-youtube', label: 'YouTube', size: '2560×1440' }
          ].map(size => (
            <button
              key={size.value}
              onClick={() => setSettings(s => ({ ...s, videoSize: size.value as any }))}
              className={cn(
                "p-3 rounded border-2 border-terminal-green",
                settings.videoSize === size.value
                  ? "bg-terminal-darkGreen"
                  : "hover:bg-terminal-black/20"
              )}
            >
              <div className="font-bold">{size.label}</div>
              <div className="text-xs opacity-75">{size.size}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-terminal-darkGreen p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Preview</h3>
        <VideoPreview settings={settings} />
      </div>

      {/* Schedule */}
      <div className="bg-terminal-darkGreen p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Schedule</h3>
        <div className="grid grid-cols-8 gap-2">
          <AnimatePresence>
            {videoSchedule.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-terminal-black rounded-lg overflow-hidden"
              >
                {post.video && (
                  <div className="aspect-video relative">
                    <video
                      src={post.video.url}
                      className="w-full h-full object-cover"
                      controls
                    >
                      <source src={post.video.url} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  </div>
                )}
                <div className="p-2">
                  <p className="text-xs mb-1 line-clamp-2">{post.content}</p>
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
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => removeScheduledPost(post.id)}
                      className="p-1 hover:bg-terminal-black rounded text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 px-4 py-2 bg-terminal-darkGreen rounded hover:bg-terminal-green/20"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Video</span>
        </button>

        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className={cn(
            "px-6 py-3 rounded-lg font-bold",
            "flex items-center space-x-2",
            isProcessing
              ? "bg-terminal-darkGreen/50 cursor-not-allowed"
              : "bg-terminal-green text-black hover:bg-terminal-green/90"
          )}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Generate Video</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleVideoUpload}
        className="hidden"
      />
    </div>
  );
}