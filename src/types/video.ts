import { PreviewDimensions } from './image';

export type VideoCategory = 
  | 'quotes'
  | 'how-to'
  | 'facts'
  | 'tips'
  | 'stories'
  | 'explainer';

export type VideoStyle =
  | 'digital-art'
  | 'photographic'
  | 'pop'
  | 'cyberpunk'
  | 'anime'
  | 'neon-punk'
  | 'realistic'
  | 'comic'
  | 'tiktok';

export type VideoSize =
  | 'landscape-hd'
  | 'landscape-4k'
  | 'portrait-hd'
  | 'square-1080'
  | 'portrait-tiktok'
  | 'landscape-youtube'
  | 'custom';

export interface TextOverlay {
  enabled: boolean;
  text: string;
  font: string;
  size: number;
  color: string;
  backgroundColor: string;
  position: 'top' | 'center' | 'bottom';
  padding: number;
  coordinates?: {
    x: number;
    y: number;
  };
  shadow?: {
    enabled: boolean;
    color: string;
    blur: number;
    offset: number;
  };
}

export interface VideoGenerationSettings {
  count: number;
  creativity: number;
  category: VideoCategory;
  style: VideoStyle;
  language: string;
  duration?: number;
  videoSize: VideoSize;
  customDimensions?: {
    width: number;
    height: number;
  };
  customVideo?: File | null;
  textOverlay: TextOverlay;
  music?: {
    genre?: string;
    mood?: string;
    customUrl?: string;
  };
  audio?: {
    file: File;
  };
  scheduling?: {
    randomized: boolean;
    timeWindow: {
      start: string;
      end: string;
    };
    interval?: {
      min: number;
      max: number;
    };
    dailyLimit: number;
  };
  platforms: string[];
  prompt?: string;
  onProgress?: (progress: {
    phase: 'generating' | 'processing';
    progress: number;
  }) => void;
  logo?: {
    enabled: boolean;
    file?: File;
    url?: string;
    size: number;
    coordinates?: {
      x: number;
      y: number;
    };
  };
}

export const VIDEO_DIMENSIONS: Record<VideoSize, PreviewDimensions> = {
  'landscape-hd': {
    width: 1920,
    height: 1080,
    aspectRatio: 16/9
  },
  'landscape-4k': {
    width: 3840,
    height: 2160,
    aspectRatio: 16/9
  },
  'portrait-hd': {
    width: 1080,
    height: 1920,
    aspectRatio: 9/16
  },
  'square-1080': {
    width: 1080,
    height: 1080,
    aspectRatio: 1
  },
  'portrait-tiktok': {
    width: 1080,
    height: 1920,
    aspectRatio: 9/16
  },
  'landscape-youtube': {
    width: 2560,
    height: 1440,
    aspectRatio: 16/9
  },
  'custom': {
    width: 1920,
    height: 1080,
    aspectRatio: 16/9
  }
};

export const STYLE_PREVIEWS: Record<VideoStyle, string> = {
  'digital-art': 'https://images.unsplash.com/photo-1563207153-f403bf289096?q=80&w=400&auto=format',
  'photographic': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&auto=format',
  'pop': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=400&auto=format',
  'cyberpunk': 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400&auto=format',
  'anime': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format',
  'neon-punk': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format',
  'realistic': 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=400&auto=format',
  'comic': 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=400&auto=format',
  'tiktok': 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=400&auto=format'
};

export const FONT_OPTIONS = [
  { value: 'Roboto', label: 'Roboto', preview: 'Aa', category: 'Sans Serif' },
  { value: 'Playfair Display', label: 'Playfair Display', preview: 'Aa', category: 'Serif' },
  { value: 'Montserrat', label: 'Montserrat', preview: 'Aa', category: 'Sans Serif' },
  { value: 'Lora', label: 'Lora', preview: 'Aa', category: 'Serif' },
  { value: 'Oswald', label: 'Oswald', preview: 'Aa', category: 'Display' },
  { value: 'Merriweather', label: 'Merriweather', preview: 'Aa', category: 'Serif' },
  { value: 'Poppins', label: 'Poppins', preview: 'Aa', category: 'Sans Serif' },
  { value: 'Raleway', label: 'Raleway', preview: 'Aa', category: 'Sans Serif' },
  { value: 'Dancing Script', label: 'Dancing Script', preview: 'Aa', category: 'Script' },
  { value: 'Pacifico', label: 'Pacifico', preview: 'Aa', category: 'Script' },
  { value: 'Bebas Neue', label: 'Bebas Neue', preview: 'Aa', category: 'Display' },
  { value: 'Anton', label: 'Anton', preview: 'Aa', category: 'Display' }
];

export const SAMPLE_TEXTS = [
  "Discover the extraordinary",
  "Experience the difference",
  "Unleash your potential",
  "Transform your world",
  "Elevate your lifestyle",
  "Create unforgettable moments",
  "Embrace the journey",
  "Make it happen",
  "Live your best life",
  "Dream bigger"
];