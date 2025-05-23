import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, Twitter, Instagram, Linkedin,
  Youtube, Check, AlertTriangle, RefreshCw
} from 'lucide-react';
import { Platform } from '../types/content';
import { platformManager } from '../lib/platforms/manager';
import { cn } from '../lib/utils';

interface PlatformConnectProps {
  onConnect?: (platform: Platform) => void;
  onDisconnect?: (platform: Platform) => void;
}

const PLATFORM_ICONS: Record<string, React.FC<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube
};

export function PlatformConnect({ onConnect, onDisconnect }: PlatformConnectProps) {
  const [connecting, setConnecting] = useState<Platform | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (platform: Platform) => {
    setConnecting(platform);
    setError(null);

    try {
      await platformManager.connectPlatform(platform);
      onConnect?.(platform);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: Platform) => {
    try {
      await platformManager.disconnectPlatform(platform);
      onDisconnect?.(platform);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Connect Platforms</h3>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-500 text-red-500 p-3 rounded flex items-center space-x-2"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(PLATFORM_ICONS).map(([platform, Icon]) => {
          const isConnected = platformManager.isConnected(platform as Platform);
          
          return (
            <button
              key={platform}
              onClick={() => isConnected 
                ? handleDisconnect(platform as Platform)
                : handleConnect(platform as Platform)
              }
              disabled={connecting === platform}
              className={cn(
                "p-4 rounded border-2 border-terminal-green",
                "hover:bg-terminal-black/20 transition-colors",
                isConnected && "bg-terminal-black/20"
              )}
            >
              <Icon className="w-8 h-8" />
              <span className="text-sm capitalize">{platform}</span>
              {connecting === platform ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : isConnected ? (
                <Check className="w-5 h-5 text-terminal-green" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}