import { create } from 'zustand';
import { marked } from 'marked';
import { generateContent, generateImage, generateVideo } from '../lib/openai';
import { formatContentForPlatform, getBestPostingTime, validateContent } from '../lib/platforms';
import { ContentType, Platform } from '../types/content';
import { PromptHistory } from '../types/history';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface ContentResponse {
  id: string;
  type: ContentType;
  content: string;
  formattedContent?: string;
  images?: string[];
  video?: {
    url: string;
    ratio: string;
  };
  hashtags?: string[];
  timestamp: Date;
  platform?: Platform;
  scheduledTime?: Date;
  link?: string;
  videoSettings?: any;
  imageSettings?: any;
  blogSettings?: any;
  metadata?: any;
}

interface ScheduledPost {
  id: string;
  type: ContentType;
  content: string;
  timestamp: Date;
  scheduledTime?: Date;
  platform?: Platform;
  image?: string;
  video?: {
    url: string;
    ratio: string;
  };
  title?: string;
  description?: string;
  link?: string;
  hashtags?: string[];
  isDeleted?: boolean;
  metadata?: any;
}

interface Store {
  userId: string | null;
  messages: Message[];
  currentOutputs: ContentResponse[];
  isProcessing: boolean;
  selectedContentType: ContentType | null;
  selectedPlatform: Platform | null;
  creativity: number;
  tone: string;
  scheduledPosts: ScheduledPost[];
  promptHistory: PromptHistory[];
  setUserId: (id: string | null) => void;
  clearUserData: () => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  addOutput: (output: ContentResponse) => void;
  clearOutputs: () => void;
  setSelectedContentType: (type: ContentType | null) => void;
  setSelectedPlatform: (platform: Platform | null) => void;
  setCreativity: (value: number) => void;
  setTone: (value: string) => void;
  generateContent: (request: {
    type: ContentType;
    prompt: string;
    platform?: Platform;
    settings: {
      creativity: number;
      tone: string;
      count?: number;
      videoSettings?: any;
      imageSettings?: any;
      blogSettings?: any;
    };
  }) => Promise<void>;
  addScheduledPost: (post: ScheduledPost) => void;
  removeScheduledPost: (id: string) => void;
  updateScheduledPost: (post: ScheduledPost) => void;
  getScheduledPostsByType: (type: ContentType) => ScheduledPost[];
  addToHistory: (prompt: string, type: string) => void;
  getGroupedHistory: () => { date: string; prompts: PromptHistory[] }[];
  retrieveHistoryPrompt: (prompt: PromptHistory) => void;
  canDownloadVideos: () => boolean;
}

export const useStore = create<Store>((set, get) => ({
  userId: null,
  messages: [],
  currentOutputs: [],
  isProcessing: false,
  selectedContentType: null,
  selectedPlatform: null,
  creativity: 0.7,
  tone: 'professional',
  scheduledPosts: [],
  promptHistory: [],

  setUserId: (id) => set({ userId: id }),

  clearUserData: () => set({
    userId: null,
    messages: [],
    currentOutputs: [],
    scheduledPosts: [],
    promptHistory: []
  }),

  addMessage: (message) => set(state => ({
    messages: [...state.messages, message]
  })),

  clearMessages: () => set({ messages: [] }),

  addOutput: (output) => set(state => ({
    currentOutputs: [...state.currentOutputs, output]
  })),

  clearOutputs: () => set({ currentOutputs: [] }),

  setSelectedContentType: (type) => set({ selectedContentType: type }),

  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

  setCreativity: (value) => set({ creativity: value }),

  setTone: (value) => set({ tone: value }),

  generateContent: async (request) => {
    set({ isProcessing: true });
    get().clearOutputs();
    
    try {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        type: 'user',
        content: request.prompt,
        timestamp: new Date()
      };
      get().addMessage(userMessage);

      const count = request.settings.count || 1;
      for (let i = 0; i < count; i++) {
        const generatedContent = await generateContent(
          request.type,
          request.prompt,
          request.settings
        );

        let images: string[] | undefined;
        let video: { url: string; ratio: string } | undefined;

        if (request.type === 'blog' || request.type === 'image') {
          const imageUrls = await generateImage(request.prompt);
          images = imageUrls;
        }

        if (request.type === 'video' && request.settings.videoSettings) {
          try {
            const videoUrl = await generateVideo(request.prompt, request.settings.videoSettings);
            const ratio = request.settings.videoSettings.videoSize === 'portrait-tiktok' ? '9:16' : '16:9';
            video = { url: videoUrl, ratio };
          } catch (error) {
            console.error('Error generating video:', error);
            throw new Error('Failed to generate video. Please try again.');
          }
        }

        const metadata = { 
          images, 
          video, 
          videoSettings: request.settings.videoSettings,
          imageSettings: request.settings.imageSettings,
          blogSettings: request.settings.blogSettings
        };

        let scheduledTime: Date | undefined;
        let formattedContent = generatedContent;

        if (request.platform) {
          formattedContent = formatContentForPlatform(generatedContent, request.platform, metadata);
          scheduledTime = getBestPostingTime(request.platform);
          
          const validation = validateContent(formattedContent, request.platform, metadata, scheduledTime);
          
          if (!validation.isValid) {
            throw new Error(`Content validation failed: ${validation.warnings.join(', ')}`);
          }
        }

        const lines = formattedContent.split('\n').filter(line => line.trim());
        const title = lines[0].replace(/🎯|🎥|📝|📸/g, '').trim();
        const mainContent = lines.slice(1, -2).join('\n').trim();
        const websiteUrl = lines[lines.length - 2].trim();
        const hashtags = lines[lines.length - 1].split(' ').filter(tag => tag.startsWith('#'));

        const formattedOutput = `${mainContent}\n\n${websiteUrl}\n\n${hashtags.join(' ')}`;

        const response: ContentResponse = {
          id: crypto.randomUUID(),
          type: request.type,
          content: formattedContent,
          formattedContent: marked(formattedOutput),
          images,
          video,
          hashtags,
          timestamp: new Date(),
          platform: request.platform,
          scheduledTime,
          link: websiteUrl,
          videoSettings: request.settings.videoSettings,
          imageSettings: request.settings.imageSettings,
          blogSettings: request.settings.blogSettings
        };

        get().addOutput(response);

        get().addScheduledPost({
          id: response.id,
          type: response.type,
          content: response.content,
          timestamp: response.timestamp,
          scheduledTime: response.scheduledTime,
          platform: response.platform,
          image: response.images?.[0],
          video: response.video,
          title: title || 'Untitled Post',
          description: mainContent,
          link: websiteUrl,
          hashtags
        });

        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: `Generated ${count} pieces of content successfully!`,
        timestamp: new Date()
      };
      get().addMessage(aiMessage);

      get().addToHistory(request.prompt, request.type);

    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: error instanceof Error ? error.message : 'Error generating content. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      get().addMessage(errorMessage);
    } finally {
      set({ isProcessing: false });
    }
  },

  addScheduledPost: (post) => set(state => ({
    scheduledPosts: [...state.scheduledPosts, post]
  })),

  removeScheduledPost: (id) => set(state => ({
    scheduledPosts: state.scheduledPosts.map(post =>
      post.id === id ? { ...post, isDeleted: true } : post
    )
  })),

  updateScheduledPost: (updatedPost) => set(state => ({
    scheduledPosts: state.scheduledPosts.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    )
  })),

  getScheduledPostsByType: (type) => {
    const { scheduledPosts } = get();
    return scheduledPosts.filter(post => post.type === type && !post.isDeleted);
  },

  addToHistory: (prompt, type) => {
    const history: PromptHistory = {
      id: crypto.randomUUID(),
      prompt,
      type,
      timestamp: new Date()
    };
    set(state => ({
      promptHistory: [...state.promptHistory, history]
    }));
  },

  getGroupedHistory: () => {
    const { promptHistory } = get();
    const groups: { [key: string]: PromptHistory[] } = {};

    promptHistory.forEach(prompt => {
      const date = new Date(prompt.timestamp).toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(prompt);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, prompts]) => ({
        date,
        prompts: prompts.sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeB - timeA;
        })
      }));
  },

  retrieveHistoryPrompt: (prompt) => {
    const { selectedContentType, creativity, tone } = get();
    get().generateContent({
      type: selectedContentType || prompt.type as ContentType,
      prompt: prompt.prompt,
      settings: {
        creativity,
        tone
      }
    });
  },

  canDownloadVideos: () => {
    return true;
  }
}));