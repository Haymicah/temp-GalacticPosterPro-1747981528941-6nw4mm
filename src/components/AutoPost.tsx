import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Image, Calendar, Settings2, Palette, 
  RefreshCw, Type, Upload, Table, 
  FileSpreadsheet, Clock, Share2,
  Trash2, Download, Video, Image as ImageIcon,
  FileText, Play, Heart, Bookmark,
  ExternalLink, Filter, Link
} from 'lucide-react';
import { AutoPostSettings, ContentSource, ScheduleFilter } from '../types/auto-post';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { PLATFORM_SETTINGS } from '../lib/platforms';

export function AutoPost() {
  const [settings, setSettings] = useState<AutoPostSettings>({
    source: 'generated',
    platforms: [],
    contentTypes: ['video', 'image', 'blog'],
    scheduling: {
      randomized: false,
      timeWindow: {
        start: '09:00',
        end: '17:00'
      },
      dailyLimit: 10
    }
  });

  const { scheduledPosts, removeScheduledPost } = useStore();
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'source' | 'platforms' | 'schedule'>('source');
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>('all');
  const observerTarget = useRef(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  // Group platforms by category
  const groupedPlatforms = Object.entries(PLATFORM_SETTINGS).reduce((acc, [key, platform]) => {
    let category = 'Other';
    
    if (platform.supportedTypes.includes('video')) {
      category = 'Video Platforms';
    } else if (platform.supportedTypes.includes('image')) {
      category = 'Image Platforms';
    } else if (platform.maxLength >= 50000) {
      category = 'Blog Platforms';
    } else if (platform.supportedTypes.includes('text')) {
      category = 'Social Platforms';
    }

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ id: key, ...platform });
    return acc;
  }, {} as Record<string, any[]>);

  const filteredPosts = scheduledPosts
    .filter(post => !post.isDeleted)
    .filter(post => scheduleFilter === 'all' || post.type === scheduleFilter)
    .sort((a, b) => {
      const timeA = new Date(a.scheduledTime || a.timestamp).getTime();
      const timeB = new Date(b.scheduledTime || b.timestamp).getTime();
      return timeA - timeB;
    });

  const paginatedPosts = filteredPosts.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginatedPosts.length < filteredPosts.length;

  const handleDeletePost = (postId: string) => {
    removeScheduledPost(postId);
  };

  const handleDownloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="bg-terminal-black text-terminal-green p-4 rounded-lg max-h-[calc(100vh-16rem)] overflow-y-auto">
      <h2 className="text-xl font-bold mb-3">Auto Post</h2>

      <div className="flex space-x-2 mb-3 overflow-x-auto pb-2 sticky top-0 bg-terminal-black z-10">
        <button
          onClick={() => setActiveTab('source')}
          className={cn(
            "flex items-center space-x-2 p-2 rounded whitespace-nowrap text-sm",
            activeTab === 'source' ? "bg-terminal-darkGreen text-white" : "text-terminal-green"
          )}
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span>Content Source</span>
        </button>
        <button
          onClick={() => setActiveTab('platforms')}
          className={cn(
            "flex items-center space-x-2 p-2 rounded whitespace-nowrap text-sm",
            activeTab === 'platforms' ? "bg-terminal-darkGreen text-white" : "text-terminal-green"
          )}
        >
          <Share2 className="w-5 h-5" />
          <span>Connect Platforms</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={cn(
            "flex items-center space-x-2 p-2 rounded whitespace-nowrap text-sm",
            activeTab === 'schedule' ? "bg-terminal-darkGreen text-white" : "text-terminal-green"
          )}
        >
          <Calendar className="w-5 h-5" />
          <span>Schedule</span>
        </button>
      </div>

      <div className="bg-terminal-darkGreen p-4 rounded-lg">
        {activeTab === 'source' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-3">Content Source</h3>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSettings(s => ({ ...s, source: 'sheets' }))}
                className={cn(
                  "p-4 rounded border-2 border-terminal-green",
                  "hover:bg-terminal-black/20 transition-colors",
                  settings.source === 'sheets' && "bg-terminal-black/20"
                )}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Table className="w-6 h-6" />
                  <span className="font-bold">Google Sheets</span>
                </div>
                <p className="text-sm opacity-75">Import content from a Google Sheets document</p>
              </button>

              <button
                onClick={() => setSettings(s => ({ ...s, source: 'generated' }))}
                className={cn(
                  "p-4 rounded border-2 border-terminal-green",
                  "hover:bg-terminal-black/20 transition-colors",
                  settings.source === 'generated' && "bg-terminal-black/20"
                )}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Type className="w-6 h-6" />
                  <span className="font-bold">Generated Content</span>
                </div>
                <p className="text-sm opacity-75">Use AI to generate content automatically</p>
              </button>

              <button
                onClick={() => setSettings(s => ({ ...s, source: 'hybrid' }))}
                className={cn(
                  "p-4 rounded border-2 border-terminal-green",
                  "hover:bg-terminal-black/20 transition-colors",
                  settings.source === 'hybrid' && "bg-terminal-black/20"
                )}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Settings2 className="w-6 h-6" />
                  <span className="font-bold">Hybrid Mode</span>
                </div>
                <p className="text-sm opacity-75">Combine sheets data with generated media</p>
              </button>
            </div>

            {(settings.source === 'sheets' || settings.source === 'hybrid') && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block mb-2">Google Sheets URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={sheetsUrl}
                      onChange={(e) => setSheetsUrl(e.target.value)}
                      placeholder="Paste your Google Sheets URL here"
                      className="flex-1 bg-terminal-black text-terminal-green p-2 rounded"
                    />
                    <button
                      onClick={() => setSettings(s => ({ ...s, sheetsUrl }))}
                      className="px-4 py-2 bg-terminal-black rounded hover:bg-terminal-black/70"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Content Types</label>
                  <div className="flex flex-wrap gap-2">
                    {['video', 'image', 'blog'].map(type => (
                      <button
                        key={type}
                        onClick={() => setSettings(s => ({
                          ...s,
                          contentTypes: s.contentTypes.includes(type as any)
                            ? s.contentTypes.filter(t => t !== type)
                            : [...s.contentTypes, type as any]
                        }))}
                        className={cn(
                          "px-3 py-1 rounded border border-terminal-green text-sm",
                          "hover:bg-terminal-black/20 transition-colors",
                          settings.contentTypes.includes(type as any) 
                            ? "bg-terminal-darkGreen text-white" 
                            : "text-terminal-green"
                        )}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'platforms' && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <h3 className="text-lg font-bold mb-3 sticky top-0 bg-terminal-darkGreen z-10 py-2">Connect Platforms</h3>
            {Object.entries(groupedPlatforms).map(([category, platforms]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-bold opacity-75 sticky top-12 bg-terminal-darkGreen z-10 py-2">{category}</h4>
                <div className="grid grid-cols-4 gap-2">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => {
                        setSettings(s => ({
                          ...s,
                          platforms: s.platforms.includes(platform.id)
                            ? s.platforms.filter(p => p !== platform.id)
                            : [...s.platforms, platform.id]
                        }));
                      }}
                      className={cn(
                        "p-2 rounded border-2 border-terminal-green text-xs",
                        "hover:bg-terminal-black/20 transition-colors",
                        settings.platforms.includes(platform.id) 
                          ? "bg-terminal-darkGreen text-white" 
                          : "text-terminal-green"
                      )}
                    >
                      <div className="text-left">
                        <div className="font-bold">{platform.name}</div>
                        <div className="text-[10px] opacity-75">
                          {platform.supportedTypes.join(', ')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.scheduling.randomized}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    scheduling: {
                      ...s.scheduling,
                      randomized: e.target.checked
                    }
                  }))}
                  className="w-3 h-3"
                />
                <label className="text-xs flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3" />
                  <span>Randomize posting times</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs mb-1">Start Time</label>
                  <input
                    type="time"
                    value={settings.scheduling.timeWindow.start}
                    onChange={(e) => setSettings(s => ({
                      ...s,
                      scheduling: {
                        ...s.scheduling,
                        timeWindow: {
                          ...s.scheduling.timeWindow,
                          start: e.target.value
                        }
                      }
                    }))}
                    className="w-full bg-terminal-black text-terminal-green p-1 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">End Time</label>
                  <input
                    type="time"
                    value={settings.scheduling.timeWindow.end}
                    onChange={(e) => setSettings(s => ({
                      ...s,
                      scheduling: {
                        ...s.scheduling,
                        timeWindow: {
                          ...s.scheduling.timeWindow,
                          end: e.target.value
                        }
                      }
                    }))}
                    className="w-full bg-terminal-black text-terminal-green p-1 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1">Daily Post Limit: {settings.scheduling.dailyLimit}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.scheduling.dailyLimit}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    scheduling: {
                      ...s.scheduling,
                      dailyLimit: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-8 gap-2">
              <AnimatePresence>
                {paginatedPosts.map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-terminal-black rounded-lg overflow-hidden"
                  >
                    {post.image && (
                      <div className="aspect-square relative">
                        <img 
                          src={post.image} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDownloadImage(post.image!)}
                            className="p-1 bg-terminal-green/80 rounded-full hover:bg-terminal-green"
                          >
                            <Download className="w-3 h-3 text-black" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 bg-red-500/80 rounded-full hover:bg-red-500"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
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
                          <div className="flex items-center space-x-1 bg-terminal-green/20 px-1 py-0.5 rounded-full text-[10px]">
                            <Share2 className="w-2 h-2" />
                            <span>{post.platform}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {hasMore && (
                <div
                  ref={observerTarget}
                  className="col-span-full h-8 flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}