export type ContentSource = 'sheets' | 'generated' | 'hybrid';

export interface AutoPostSettings {
  source: ContentSource;
  sheetsUrl?: string;
  platforms: string[];
  contentTypes: ('video' | 'image' | 'blog')[];
  scheduling: {
    randomized: boolean;
    timeWindow: {
      start: string;
      end: string;
    };
    dailyLimit: number;
  };
}

export interface GeneratedContent {
  id: string;
  type: 'video' | 'image' | 'blog';
  content: string;
  timestamp: Date;
  link?: string;
  platform?: string;
  scheduledTime?: Date;
  image?: string;
  video?: {
    url: string;
    ratio: string;
  };
  title?: string;
  description?: string;
  hashtags?: string[];
}

export interface ScheduledPost extends GeneratedContent {
  isDeleted?: boolean;
}

export type ScheduleFilter = 'all' | 'video' | 'image' | 'blog';