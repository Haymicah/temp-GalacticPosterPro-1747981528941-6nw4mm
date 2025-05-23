import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { 
  Video, Clock, Settings2, Upload, 
  Play, Pause, X, Download, Share2,
  Calendar, RefreshCw, Trash2, Type,
  Palette, Maximize, Image, Mic,
  Music, Volume2
} from 'lucide-react';
import { VideoGenerationSettings } from '../types/video';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { VideoPreview } from './video/VideoPreview';
import { AudioRecorder } from './video/AudioRecorder';
import { VideoGenerator as VideoGen } from '../lib/video/generator';

export function VideoGenerator() {
  const [settings, setSettings] = useState<VideoGenerationSettings>({
    count: 1,
    creativity: 0.7,
    category: 'how-to',
    style: 'digital-art',
    language: 'en',
    videoSize: 'landscape-hd',
    customVideo: null,
    duration: 10, // Set default duration
    prompt: '', // Add prompt field
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

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({
    phase: 'generating' as const,
    progress: 0,
    currentStep: ''
  });
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const { addScheduledPost } = useStore();

  const handleAudioSave = (audioBlob: Blob) => {
    const file = new File([audioBlob], 'narration.wav', { type: 'audio/wav' });
    setAudioFile(file);
    setShowAudioRecorder(false);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleGenerate = async () => {
    if (!settings.prompt) {
      alert('Please enter a video prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const generator = new VideoGen((progress) => {
        setGenerationProgress(progress);
      });

      const videoUrl = await generator.generateVideo({
        ...settings,
        audio: audioFile ? { file: audioFile } : undefined
      });

      setPreviewUrl(videoUrl);
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Error generating video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveVideo = () => {
    if (!previewUrl) return;

    addScheduledPost({
      id: crypto.randomUUID(),
      type: 'video',
      content: settings.textOverlay.text || 'Generated Video',
      timestamp: new Date(),
      video: {
        url: previewUrl,
        ratio: settings.videoSize === 'portrait-tiktok' ? '9:16' : '16:9'
      },
      scheduledTime: new Date(),
      platform: settings.platforms[0]
    });

    setPreviewUrl(null);
  };

  return (
    <div className="max-h-[calc(100vh-16rem)] overflow-y-auto space-y-4 pr-2">
      <div className="bg-terminal-darkGreen p-4 rounded-lg space-y-4">
        {/* Add prompt input */}
        <div>
          <label className="block text-sm mb-2">Video Prompt</label>
          <textarea
            value={settings.prompt}
            onChange={(e) => setSettings(s => ({ ...s, prompt: e.target.value }))}
            placeholder="Describe the video you want to generate..."
            className="w-full h-24 bg-terminal-black text-terminal-green p-2 rounded resize-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Video Duration: {settings.duration} seconds</label>
          <input
            type="range"
            min="5"
            max="30"
            value={settings.duration}
            onChange={(e) => setSettings(s => ({ ...s, duration: parseInt(e.target.value) }))}
            className="w-full h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Video Quality: {Math.round(settings.creativity * 100)}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(settings.creativity * 100)}
            onChange={(e) => setSettings(s => ({ ...s, creativity: parseInt(e.target.value) / 100 }))}
            className="w-full h-1 bg-terminal-black rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Style</label>
            <select
              value={settings.style}
              onChange={(e) => setSettings(s => ({ ...s, style: e.target.value as any }))}
              className="w-full bg-terminal-black p-2 rounded"
            >
              <option value="digital-art">Digital Art</option>
              <option value="photographic">Photographic</option>
              <option value="anime">Anime</option>
              <option value="neon-punk">Neon Punk</option>
              <option value="comic">Comic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Size</label>
            <select
              value={settings.videoSize}
              onChange={(e) => setSettings(s => ({ ...s, videoSize: e.target.value as any }))}
              className="w-full bg-terminal-black p-2 rounded"
            >
              <option value="landscape-hd">Landscape HD (16:9)</option>
              <option value="portrait-tiktok">Portrait/TikTok (9:16)</option>
              <option value="square-1080">Square (1:1)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Text Overlay</label>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={settings.textOverlay.enabled}
              onChange={(e) => setSettings(s => ({
                ...s,
                textOverlay: { ...s.textOverlay, enabled: e.target.checked }
              }))}
              className="w-4 h-4"
            />
            <span className="text-sm">Enable text overlay</span>
          </div>

          {settings.textOverlay.enabled && (
            <div className="space-y-4">
              <input
                type="text"
                value={settings.textOverlay.text}
                onChange={(e) => setSettings(s => ({
                  ...s,
                  textOverlay: { ...s.textOverlay, text: e.target.value }
                }))}
                placeholder="Enter overlay text..."
                className="w-full bg-terminal-black p-2 rounded"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1">Text Color</label>
                  <HexColorPicker
                    color={settings.textOverlay.color}
                    onChange={(color) => setSettings(s => ({
                      ...s,
                      textOverlay: { ...s.textOverlay, color }
                    }))}
                  />
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
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2">Audio</label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAudioRecorder(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-terminal-black rounded hover:bg-terminal-black/70"
            >
              <Mic className="w-4 h-4" />
              <span>Record Audio</span>
            </button>

            <button
              onClick={() => audioInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 bg-terminal-black rounded hover:bg-terminal-black/70"
            >
              <Music className="w-4 h-4" />
              <span>Upload Audio</span>
            </button>

            {audioFile && (
              <button
                onClick={() => setAudioFile(null)}
                className="p-2 hover:bg-terminal-black rounded-full text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !settings.prompt}
            className={cn(
              "px-6 py-3 rounded-lg font-bold",
              "flex items-center space-x-2",
              (isGenerating || !settings.prompt)
                ? "bg-terminal-darkGreen/50 cursor-not-allowed"
                : "bg-terminal-green text-black hover:bg-terminal-green/90"
            )}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{generationProgress.currentStep}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Generate Video</span>
              </>
            )}
          </button>
        </div>
      </div>

      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        className="hidden"
      />

      <AnimatePresence>
        {showAudioRecorder && (
          <AudioRecorder
            onSave={handleAudioSave}
            onCancel={() => setShowAudioRecorder(false)}
          />
        )}

        {previewUrl && (
          <VideoPreview
            videoUrl={previewUrl}
            onClose={() => setPreviewUrl(null)}
            onApprove={handleApproveVideo}
          />
        )}
      </AnimatePresence>
    </div>
  );
}