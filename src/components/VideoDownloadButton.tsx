import React from 'react';
import { Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

interface VideoDownloadButtonProps {
  videoUrl: string;
  className?: string;
}

export function VideoDownloadButton({ videoUrl, className }: VideoDownloadButtonProps) {
  const canDownloadVideos = useStore(state => state.canDownloadVideos);

  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  if (!canDownloadVideos()) {
    return (
      <div className={cn(
        "flex items-center space-x-1 px-2 py-1 bg-terminal-darkGreen/50 rounded text-xs cursor-not-allowed",
        className
      )}>
        <Download className="w-3 h-3 opacity-50" />
        <span className="opacity-50">Pro Feature</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className={cn(
        "flex items-center space-x-1 px-2 py-1 bg-terminal-green/20 rounded text-xs",
        "hover:bg-terminal-green/30 transition-colors",
        className
      )}
    >
      <Download className="w-3 h-3" />
      <span>Download</span>
    </button>
  );
}