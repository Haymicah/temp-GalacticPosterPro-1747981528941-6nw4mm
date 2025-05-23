import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import { 
  Bot, Send, Mic, Menu, User,
  MessageSquare, Shield, Share2, Sliders,
  Clapperboard, Camera, BookOpen, Rocket,
  ImagePlus, Heart, Bookmark, ExternalLink,
  Download, Clock, Calendar, BarChart3,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { ContentType, Platform } from '../types/content';
import { VoiceRecognition } from '../lib/voice';
import { PLATFORM_SETTINGS } from '../lib/platforms';
import { VideoGenerator } from './VideoGenerator';
import { ImageGenerator } from './ImageGenerator';
import { BlogGenerator } from './BlogGenerator';
import { AutoPost } from './AutoPost';
import { ReportsModal } from './ReportsModal';
import { SideMenu } from './SideMenu';
import { Logo } from './Logo';
import { cn } from '../lib/utils';
import { ContentOutputGrid } from './ContentOutputGrid';
import { useNavigate } from 'react-router-dom';

interface TerminalProps {
  onShowSchedule: () => void;
  onShowCampaign: () => void;
  onShowAdmin?: () => void;
  isAdmin: boolean;
}

export function Terminal({ onShowSchedule, onShowCampaign, onShowAdmin, isAdmin }: TerminalProps) {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [activeSettings, setActiveSettings] = useState<ContentType | null>(null);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [showMarketingCampaign, setShowMarketingCampaign] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showContentTypes, setShowContentTypes] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voiceRecognition = useRef<VoiceRecognition | null>(null);
  
  const { 
    messages, 
    isProcessing, 
    selectedContentType,
    selectedPlatform,
    creativity,
    tone,
    currentOutputs,
    setSelectedContentType,
    setSelectedPlatform,
    setCreativity,
    setTone,
    generateContent,
    addToSchedule,
    addScheduledPost,
    addMessage
  } = useStore();

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();

    voiceRecognition.current = new VoiceRecognition(
      (text) => setInput(text),
      (error) => console.error('Voice recognition error:', error)
    );

    return () => {
      voiceRecognition.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Delay Prism highlighting to ensure content is rendered
    setTimeout(() => {
      Prism.highlightAll();
    }, 0);
  }, [messages, currentOutputs]);

  useEffect(() => {
    if (input.trim().length > 0) {
      setIsSettingsExpanded(false);
    }
  }, [input]);

  const handleVoiceInput = () => {
    if (voiceRecognition.current?.isListening) {
      voiceRecognition.current.stop();
    } else {
      voiceRecognition.current?.start();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedContentType) return;

    setIsSettingsExpanded(false);

    const request = {
      type: selectedContentType as ContentType,
      prompt: input,
      platform: selectedPlatform,
      settings: {
        creativity,
        tone,
        count: 1
      }
    };

    setInput('');
    await generateContent(request);
    
    onShowSchedule();
  };

  const handleContentTypeSelect = (type: ContentType) => {
    setSelectedContentType(type);
    setActiveSettings(type);
    setIsSettingsExpanded(true);
  };

  const handleSignOut = async () => {
    setIsSideMenuOpen(false);
  };

  const renderSettings = () => {
    if (!activeSettings) return null;

    switch (activeSettings) {
      case 'video':
        return <VideoGenerator />;
      case 'image':
        return <ImageGenerator />;
      case 'blog':
        return <BlogGenerator />;
      case 'post':
        return <AutoPost />;
      default:
        return null;
    }
  };

  // Handle key commands
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl+L to clear terminal
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      clearMessages();
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div 
      className="flex flex-col h-screen bg-terminal-black text-terminal-green p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setIsSideMenuOpen(true)}
          className="p-2 hover:bg-terminal-darkGreen rounded-full"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-terminal-darkGreen rounded hover:bg-terminal-green/20"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}
          <button
            onClick={onShowCampaign}
            className="hidden md:flex items-center space-x-2 px-4 py-2 bg-terminal-darkGreen rounded hover:bg-terminal-green/20"
          >
            <Rocket className="w-4 h-4" />
            <span>Campaign</span>
          </button>
          <button
            onClick={onShowSchedule}
            className="hidden md:flex items-center space-x-2 px-4 py-2 bg-terminal-darkGreen rounded hover:bg-terminal-green/20"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => setShowReports(true)}
            className="hidden md:flex items-center space-x-2 px-4 py-2 bg-terminal-darkGreen rounded hover:bg-terminal-green/20"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reports</span>
          </button>
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm opacity-75 hidden md:inline">{user.email}</span>
              <div className="w-8 h-8 rounded-full bg-terminal-green flex items-center justify-center">
                <User className="w-4 h-4 text-terminal-black" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden flex space-x-2 mb-4">
        <button
          onClick={onShowSchedule}
          className="flex-1 flex items-center justify-center space-x-1 p-2 bg-terminal-darkGreen rounded"
        >
          <Calendar className="w-3 h-3" />
          <span>Schedule</span>
        </button>
        <button
          onClick={onShowCampaign}
          className="flex-1 flex items-center justify-center space-x-1 p-2 bg-terminal-darkGreen rounded"
        >
          <Rocket className="w-3 h-3" />
          <span>Campaign</span>
        </button>
        <button
          onClick={() => setShowReports(true)}
          className="flex-1 flex items-center justify-center space-x-1 p-2 bg-terminal-darkGreen rounded"
        >
          <BarChart3 className="w-3 h-3" />
          <span>Reports</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { type: 'video', icon: Clapperboard, label: 'Video Post', description: 'Create engaging video content' },
          { type: 'image', icon: Camera, label: 'Image Post', description: 'Design and share visual content' },
          { type: 'blog', icon: BookOpen, label: 'Blog Post', description: 'Write long-form content' },
          { type: 'post', icon: Rocket, label: 'Auto Post', description: 'Schedule and automate posts' }
        ].map(({ type, icon: Icon, label, description }) => (
          <button
            key={type}
            onClick={() => handleContentTypeSelect(type as ContentType)}
            className={cn(
              "flex flex-col items-center p-4 rounded border-2",
              "border-terminal-green bg-terminal-black",
              "hover:bg-terminal-darkGreen transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-terminal-green",
              selectedContentType === type && "bg-terminal-darkGreen"
            )}
          >
            <Icon className="w-8 h-8 mb-2" />
            <span className="font-bold">{label}</span>
            <span className="text-sm text-center opacity-75 hidden md:block">{description}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isSettingsExpanded && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {renderSettings()}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
        className="flex items-center justify-center p-2 mb-4 text-sm opacity-75 hover:opacity-100"
      >
        {isSettingsExpanded ? (
          <>Hide Settings <ChevronUp className="ml-1" /></>
        ) : (
          <>Show Settings <ChevronDown className="ml-1" /></>
        )}
      </button>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        <AnimatePresence>
          {!input.trim() && !messages.length && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-center items-center h-[60vh]"
            >
              <Logo />
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((message) => (
          <div key={message.id}>
            {message.type === 'user' ? (
              <div className="p-3 rounded bg-terminal-darkGreen">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 mr-2 rounded-full bg-terminal-green" />
                  <span className="text-sm opacity-75">
                    {format(message.timestamp, 'HH:mm:ss')}
                  </span>
                </div>
                <p className="font-mono">{message.content}</p>
              </div>
            ) : message.type === 'ai' && !message.isError ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-terminal-darkGreen rounded-lg"
              >
                {currentOutputs.length > 0 ? (
                  <ContentOutputGrid 
                    outputs={currentOutputs}
                    onEdit={(content) => {
                      console.log('Edit content:', content);
                    }}
                    onDelete={(content) => {
                      console.log('Delete content:', content);
                    }}
                    onShare={(content) => {
                      console.log('Share content:', content);
                    }}
                    onPostNow={async (content) => {
                      try {
                        const scheduledPost = {
                          id: crypto.randomUUID(),
                          type: content.type,
                          content: content.content.split('\n').slice(1, -2).join('\n').trim(),
                          timestamp: new Date(),
                          scheduledTime: new Date(),
                          platform: content.platform,
                          image: content.images?.[0],
                          video: content.video,
                          title: content.content.split('\n')[0].replace(/🎯|🎥|📝|📸/g, '').trim(),
                          description: content.content.split('\n')[1],
                          link: content.link,
                          hashtags: content.hashtags
                        };

                        addScheduledPost(scheduledPost);

                        addMessage({
                          id: crypto.randomUUID(),
                          type: 'ai',
                          content: `Content has been posted successfully!`,
                          timestamp: new Date()
                        });
                      } catch (error) {
                        console.error('Error posting content:', error);
                        addMessage({
                          id: crypto.randomUUID(),
                          type: 'ai',
                          content: `Error posting content: ${error instanceof Error ? error.message : 'Unknown error'}`,
                          timestamp: new Date(),
                          isError: true
                        });
                      }
                    }}
                  />
                ) : (
                  <div className="p-6">
                    <div className="prose prose-invert max-w-none">
                      {message.content.split('\n').map((line, index) => (
                        <p key={index} className={cn(
                          "mb-4 last:mb-0",
                          line.startsWith('**') ? "font-bold text-xl" : "text-justify"
                        )}>
                          {line.replace(/\*\*/g, '')}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <p className="text-red-500">{message.content}</p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <button
          type="button"
          onClick={handleVoiceInput}
          className={cn(
            "p-2 hover:bg-terminal-darkGreen rounded transition-colors",
            voiceRecognition.current?.isListening && "bg-terminal-darkGreen"
          )}
          disabled={isProcessing}
        >
          <Mic className="w-5 h-5" />
        </button>
        <input
          ref={inputRef}
          type="text"
          id="prompt-input"
          name="prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedContentType 
            ? `Generate ${selectedContentType} content...` 
            : "Select a content type to begin..."
          }
          disabled={!selectedContentType || isProcessing}
          className={cn(
            "flex-1 bg-transparent border-2 border-terminal-green",
            "rounded px-4 py-2 font-mono",
            "focus:outline-none focus:ring-2 focus:ring-terminal-green",
            "placeholder-terminal-green placeholder-opacity-50",
            (!selectedContentType || isProcessing) && "opacity-50 cursor-not-allowed"
          )}
          autoComplete="off"
          autoFocus
        />
        <button
          type="submit"
          disabled={!selectedContentType || isProcessing || !input.trim()}
          className={cn(
            "p-2 hover:bg-terminal-darkGreen rounded transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-terminal-green",
            (!selectedContentType || isProcessing || !input.trim()) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-5 h-5" />
            </motion.div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      <AnimatePresence>
        <SideMenu
          isOpen={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
          user={user}
          onSignOut={handleSignOut}
        />

        {showReports && (
          <ReportsModal onClose={() => setShowReports(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}