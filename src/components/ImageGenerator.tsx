import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import Select from 'react-select';
import { format } from 'date-fns';
import { 
  Image, Calendar, Settings2, Palette, 
  RefreshCw, Type, Upload, Maximize, 
  Share2, Clock, Download, Trash2,
  Heart, Bookmark, ExternalLink, Filter,
  ImagePlus
} from 'lucide-react';
import { ImageGenerationSettings, ImageStyle, ImageSize } from '../types/image';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { ImagePreview } from './ImagePreview';
import { PLATFORM_SETTINGS } from '../lib/platforms';

const IMAGE_STYLES: { value: ImageStyle; label: string; description: string }[] = [
  { value: 'photographic', label: 'Photographic', description: 'Realistic photo style' },
  { value: 'digital-art', label: 'Digital Art', description: 'Modern digital artwork' },
  { value: 'pop-art', label: 'Pop Art', description: 'Vibrant pop art style' },
  { value: 'minimalist', label: 'Minimalist', description: 'Clean and simple' },
  { value: 'watercolor', label: 'Watercolor', description: 'Artistic watercolor' },
  { value: 'oil-painting', label: 'Oil Painting', description: 'Classical painting' },
  { value: 'sketch', label: 'Sketch', description: 'Hand-drawn look' },
  { value: 'anime', label: 'Anime', description: 'Japanese anime style' },
  { value: 'pixel-art', label: 'Pixel Art', description: 'Retro pixel style' },
  { value: 'abstract', label: 'Abstract', description: 'Abstract artwork' },
  { value: 'vintage', label: 'Vintage', description: 'Retro vintage look' },
  { value: 'comic', label: 'Comic', description: 'Comic book style' }
];

const IMAGE_SIZES: { value: ImageSize; label: string; description: string }[] = [
  { value: 'square-1080', label: '1080×1080', description: 'Instagram' },
  { value: 'landscape-hd', label: '1920×1080', description: 'HD' },
  { value: 'portrait-story', label: '1080×1920', description: 'Story' },
  { value: 'wide', label: '1200×630', description: 'Social' },
  { value: 'pinterest', label: '1000×1500', description: 'Pinterest' },
  { value: 'twitter', label: '1600×900', description: 'Twitter' },
  { value: 'facebook', label: '1200×630', description: 'Facebook' },
  { value: 'custom', label: 'Custom', description: 'Custom size' }
];

export function ImageGenerator() {
  const [settings, setSettings] = useState<ImageGenerationSettings>({
    count: 1,
    creativity: 0.7,
    style: 'photographic',
    size: 'square-1080',
    imageCount: 1,
    platforms: [],
    textOverlay: {
      enabled: false,
      text: '',
      font: 'Roboto',
      size: 20,
      color: '#FFFFFF',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'bottom',
      padding: 20,
      coordinates: { x: 50, y: 80 },
      shadow: {
        enabled: true,
        color: '#00FF00',
        blur: 4,
        offset: 2
      }
    },
    scheduling: {
      randomized: false,
      timeWindow: {
        start: '09:00',
        end: '17:00'
      },
      dailyLimit: 5
    }
  });

  const [activeTab, setActiveTab] = useState<'style' | 'size' | 'text' | 'platforms' | 'schedule'>('style');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { getScheduledPostsByType, removeScheduledPost } = useStore();
  const imageSchedule = getScheduledPostsByType('image');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSettings(s => ({
        ...s,
        logo: {
          ...s.logo!,
          enabled: true,
          file,
          url
        }
      }));
    }
  };

  const handleTextMove = (coordinates: { x: number; y: number }) => {
    setSettings(s => ({
      ...s,
      textOverlay: {
        ...s.textOverlay,
        coordinates
      }
    }));
  };

  const handleLogoMove = (coordinates: { x: number; y: number }) => {
    setSettings(s => ({
      ...s,
      logo: {
        ...s.logo!,
        coordinates
      }
    }));
  };

  return (
    <div className="max-h-[calc(100vh-16rem)] overflow-y-auto space-y-4 pr-2">
      <div className="bg-terminal-darkGreen p-4 rounded-lg space-y-4">
        <div>
          <label className="block text-sm mb-2">Number of Images: {settings.count}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.count}
            onChange={(e) => setSettings(s => ({ ...s, count: parseInt(e.target.value) }))}
            className="w-full h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Quality: {Math.round(settings.creativity * 100)}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(settings.creativity * 100)}
            onChange={(e) => setSettings(s => ({ ...s, creativity: parseInt(e.target.value) / 100 }))}
            className="w-full h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { id: 'style', icon: Palette, label: 'Style & Size' },
          { id: 'text', icon: Type, label: 'Text' },
          { id: 'platforms', icon: Share2, label: 'Platforms' },
          { id: 'schedule', icon: Calendar, label: 'Schedule' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center space-x-1 px-3 py-1 rounded text-xs whitespace-nowrap",
              activeTab === tab.id ? "bg-terminal-green text-black" : "text-terminal-green"
            )}
          >
            <tab.icon className="w-3 h-3" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-terminal-darkGreen p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold">Preview</h3>
            <button
              onClick={() => setSettings(s => ({
                ...s,
                textOverlay: {
                  ...s.textOverlay,
                  enabled: !s.textOverlay.enabled,
                  text: s.textOverlay.enabled ? '' : 'Sample Text'
                }
              }))}
              className={cn(
                "px-3 py-1 rounded text-xs border border-terminal-green",
                settings.textOverlay.enabled ? "bg-terminal-green text-black" : "hover:bg-terminal-black/20"
              )}
            >
              {settings.textOverlay.enabled ? 'Hide Text' : 'Show Text'}
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 border-2 border-white/20 rounded pointer-events-none" />
            <ImagePreview 
              settings={settings}
              onTextMove={handleTextMove}
              onLogoMove={handleLogoMove}
            />
          </div>
        </div>

        <div className="bg-terminal-darkGreen p-4 rounded-lg">
          {activeTab === 'style' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold mb-2">Style</h3>
                <div className="grid grid-cols-3 gap-2">
                  {IMAGE_STYLES.map(style => (
                    <button
                      key={style.value}
                      onClick={() => setSettings(s => ({ ...s, style: style.value }))}
                      className={cn(
                        "p-2 rounded border border-terminal-green text-xs",
                        "hover:bg-terminal-black/20 transition-colors",
                        settings.style === style.value ? "bg-terminal-darkGreen text-white" : "text-terminal-green"
                      )}
                    >
                      <div className="text-left">
                        <div className="font-bold">{style.label}</div>
                        <div className="text-[10px] opacity-75">{style.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-2">Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  {IMAGE_SIZES.map(size => (
                    <button
                      key={size.value}
                      onClick={() => setSettings(s => ({ ...s, size: size.value }))}
                      className={cn(
                        "p-2 rounded border border-terminal-green text-xs",
                        settings.size === size.value ? "bg-terminal-darkGreen text-white" : "hover:bg-terminal-black/20"
                      )}
                    >
                      <div className="font-bold">{size.label}</div>
                      <div className="opacity-75">{size.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {settings.size === 'custom' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={settings.customDimensions?.width || 1080}
                      onChange={(e) => setSettings(s => ({
                        ...s,
                        customDimensions: {
                          ...s.customDimensions,
                          width: parseInt(e.target.value)
                        }
                      }))}
                      min="100"
                      max="4096"
                      className="w-full bg-terminal-black text-terminal-green p-1 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={settings.customDimensions?.height || 1080}
                      onChange={(e) => setSettings(s => ({
                        ...s,
                        customDimensions: {
                          ...s.customDimensions,
                          height: parseInt(e.target.value)
                        }
                      }))}
                      min="100"
                      max="4096"
                      className="w-full bg-terminal-black text-terminal-green p-1 rounded text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.textOverlay.enabled}
                    onChange={(e) => setSettings(s => ({
                      ...s,
                      textOverlay: { 
                        ...s.textOverlay, 
                        enabled: e.target.checked,
                        color: '#FFFFFF',
                        shadow: {
                          enabled: true,
                          color: '#00FF00',
                          blur: 4,
                          offset: 2
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        coordinates: { x: 50, y: 80 }
                      }
                    }))}
                    className="w-4 h-4"
                  />
                  <label className="text-sm">Enable text overlay</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.logo?.enabled}
                    onChange={(e) => setSettings(s => ({
                      ...s,
                      logo: {
                        ...s.logo!,
                        enabled: e.target.checked,
                        size: 100,
                        coordinates: { x: 80, y: 20 }
                      }
                    }))}
                    className="w-4 h-4"
                  />
                  <label className="text-sm">Enable logo overlay</label>
                </div>

                {settings.logo?.enabled && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1 bg-terminal-black rounded text-xs hover:bg-terminal-black/70"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload Logo
                    </button>
                    {settings.logo.url && (
                      <>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">Size:</span>
                          <input
                            type="range"
                            min="20"
                            max="400"
                            value={settings.logo.size}
                            onChange={(e) => setSettings(s => ({
                              ...s,
                              logo: {
                                ...s.logo!,
                                size: parseInt(e.target.value)
                              }
                            }))}
                            className="w-24 h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs">{settings.logo.size}px</span>
                        </div>
                        <button
                          onClick={() => setSettings(s => ({
                            ...s,
                            logo: {
                              ...s.logo!,
                              file: undefined,
                              url: undefined
                            }
                          }))}
                          className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-xs hover:bg-red-500/30"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {settings.textOverlay.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs mb-1">Text</label>
                    <input
                      type="text"
                      value={settings.textOverlay.text}
                      onChange={(e) => setSettings(s => ({
                        ...s,
                        textOverlay: { ...s.textOverlay, text: e.target.value }
                      }))}
                      className="w-full bg-terminal-black text-terminal-green p-2 rounded text-xs"
                      placeholder="Enter overlay text..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.textOverlay.backgroundColor === 'rgba(0,0,0,0)'}
                      onChange={(e) => setSettings(s => ({
                        ...s,
                        textOverlay: {
                          ...s.textOverlay,
                          backgroundColor: e.target.checked ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)'
                        }
                      }))}
                      className="w-4 h-4"
                    />
                    <label className="text-sm">No background</label>
                  </div>

                  <div>
                    <label className="block text-xs mb-1">Font Size: {settings.textOverlay.size}px</label>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={settings.textOverlay.size}
                      onChange={(e) => setSettings(s => ({
                        ...s,
                        textOverlay: { ...s.textOverlay, size: parseInt(e.target.value) }
                      }))}
                      className="w-full h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1">Text Color</label>
                      <HexColorPicker
                        color={settings.textOverlay.color}
                        onChange={(color) => setSettings(s => ({
                          ...s,
                          textOverlay: { ...s.textOverlay, color }
                        }))}
                        style={{ width: '100%', height: '100px' }}
                      />
                    </div>

                    {!settings.textOverlay.backgroundColor.endsWith(',0)') && (
                      <div>
                        <label className="block text-xs mb-1">Background Color</label>
                        <HexColorPicker
                          color={settings.textOverlay.backgroundColor}
                          onChange={(color) => setSettings(s => ({
                            ...s,
                            textOverlay: { ...s.textOverlay, backgroundColor: color }
                          }))}
                          style={{ width: '100%', height: '100px' }}
                        />
                        <div className="flex items-center mt-2 space-x-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={parseInt(settings.textOverlay.backgroundColor.split(',')[3] || '1') * 100}
                            onChange={(e) => {
                              const alpha = parseInt(e.target.value) / 100;
                              setSettings(s => ({
                                ...s,
                                textOverlay: {
                                  ...s.textOverlay,
                                  backgroundColor: `rgba(0,0,0,${alpha})`
                                }
                              }));
                            }}
                            className="w-full h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs">Opacity</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.textOverlay.shadow?.enabled}
                        onChange={(e) => setSettings(s => ({
                          ...s,
                          textOverlay: {
                            ...s.textOverlay,
                            shadow: {
                              ...s.textOverlay.shadow,
                              enabled: e.target.checked,
                              color: '#00FF00',
                              blur: 4,
                              offset: 2
                            }
                          }
                        }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Enable text shadow</span>
                    </label>

                    {settings.textOverlay.shadow?.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs mb-1">Shadow Color</label>
                          <HexColorPicker
                            color={settings.textOverlay.shadow.color}
                            onChange={(color) => setSettings(s => ({
                              ...s,
                              textOverlay: {
                                ...s.textOverlay,
                                shadow: {
                                  ...s.textOverlay.shadow!,
                                  color
                                }
                              }
                            }))}
                            style={{ width: '100%', height: '100px' }}
                          />
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs mb-1">Shadow Blur: {settings.textOverlay.shadow.blur}px</label>
                            <input
                              type="range"
                              min="0"
                              max="20"
                              value={settings.textOverlay.shadow.blur}
                              onChange={(e) => setSettings(s => ({
                                ...s,
                                textOverlay: {
                                  ...s.textOverlay,
                                  shadow: {
                                    ...s.textOverlay.shadow!,
                                    blur: parseInt(e.target.value)
                                  }
                                }
                              }))}
                              className="w-full h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-xs mb-1">Shadow Offset: {settings.textOverlay.shadow.offset}px</label>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={settings.textOverlay.shadow.offset}
                              onChange={(e) => setSettings(s => ({
                                ...s,
                                textOverlay: {
                                  ...s.textOverlay,
                                  shadow: {
                                    ...s.textOverlay.shadow!,
                                    offset: parseInt(e.target.value)
                                  }
                                }
                              }))}
                              className="w-full h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'platforms' && (
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PLATFORM_SETTINGS)
                .filter(([_, platform]) => platform.supportedTypes.includes('image'))
                .map(([id, platform]) => (
                  <button
                    key={id}
                    onClick={() => setSettings(s => ({
                      ...s,
                      platforms: s.platforms.includes(id)
                        ? s.platforms.filter(p => p !== id)
                        : [...s.platforms, id]
                    }))}
                    className={cn(
                      "p-2 rounded border border-terminal-green text-xs",
                      settings.platforms.includes(id) ? "bg-terminal-green text-black" : "hover:bg-terminal-black/20"
                    )}
                  >
                    {platform.name}
                  </button>
                ))}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.scheduling.randomized}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    scheduling: { ...s.scheduling, randomized: e.target.checked }
                  }))}
                  className="w-4 h-4"
                />
                <label className="text-sm">Randomize posting times</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1">Start Time</label>
                  <input
                    type="time"
                    value={settings.scheduling.timeWindow.start}
                    onChange={(e) => setSettings(s => ({
                      ...s,
                      scheduling: {
                        ...s.scheduling,
                        timeWindow: { ...s.scheduling.timeWindow, start: e.target.value }
                      }
                    }))}
                    className="w-full bg-terminal-black text-terminal-green p-2 rounded text-xs"
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
                        timeWindow: { ...s.scheduling.timeWindow, end: e.target.value }
                      }
                    }))}
                    className="w-full bg-terminal-black text-terminal-green p-2 rounded text-xs"
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
                    scheduling: { ...s.scheduling, dailyLimit: parseInt(e.target.value) }
                  }))}
                  className="w-full h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-8 gap-2">
                <AnimatePresence>
                  {imageSchedule.map(post => (
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
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = post.image!;
                                link.download = `image-${Date.now()}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="p-1 bg-terminal-green/80 rounded-full hover:bg-terminal-green"
                            >
                              <Download className="w-3 h-3 text-black" />
                            </button>
                            <button
                              onClick={() => removeScheduledPost(post.id)}
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
              </div>
            </div>
          )}
        </div>
      </div>

      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
      />
    </div>
  );
}