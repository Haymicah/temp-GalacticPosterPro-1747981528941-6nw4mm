import { DraggableData } from '@dnd-kit/core';

export type ImageStyle =
  | 'photographic'
  | 'digital-art'
  | 'pop-art'
  | 'minimalist'
  | 'watercolor'
  | 'oil-painting'
  | 'sketch'
  | 'anime'
  | 'pixel-art'
  | 'abstract'
  | 'vintage'
  | 'comic';

export type ImageSize =
  | 'square-1080'
  | 'landscape-hd'
  | 'portrait-story'
  | 'wide'
  | 'pinterest'
  | 'twitter'
  | 'facebook'
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
  gradient?: {
    enabled: boolean;
    colors: string[];
    angle: number;
  };
  outline?: {
    enabled: boolean;
    color: string;
    width: number;
  };
}

export interface ImageGenerationSettings {
  count: number;
  creativity: number;
  style: ImageStyle;
  size: ImageSize;
  imageCount: number;
  platforms: string[];
  customDimensions?: {
    width: number;
    height: number;
  };
  textOverlay: TextOverlay;
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
  scheduling: {
    randomized: boolean;
    timeWindow: {
      start: string;
      end: string;
    };
    dailyLimit: number;
  };
}

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

export interface PreviewDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export const IMAGE_DIMENSIONS: Record<ImageSize, PreviewDimensions> = {
  'square-1080': {
    width: 1080,
    height: 1080,
    aspectRatio: 1
  },
  'landscape-hd': {
    width: 1920,
    height: 1080,
    aspectRatio: 16/9
  },
  'portrait-story': {
    width: 1080,
    height: 1920,
    aspectRatio: 9/16
  },
  'wide': {
    width: 1200,
    height: 630,
    aspectRatio: 1.91
  },
  'pinterest': {
    width: 1000,
    height: 1500,
    aspectRatio: 2/3
  },
  'twitter': {
    width: 1600,
    height: 900,
    aspectRatio: 16/9
  },
  'facebook': {
    width: 1200,
    height: 630,
    aspectRatio: 1.91
  },
  'custom': {
    width: 1080,
    height: 1080,
    aspectRatio: 1
  }
};

export const STYLE_PREVIEWS: Record<ImageStyle, string> = {
  'photographic': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&auto=format',
  'digital-art': 'https://images.unsplash.com/photo-1563207153-f403bf289096?q=80&w=400&auto=format',
  'pop-art': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=400&auto=format',
  'minimalist': 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=400&auto=format',
  'watercolor': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format',
  'oil-painting': 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=400&auto=format',
  'sketch': 'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?q=80&w=400&auto=format',
  'anime': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format',
  'pixel-art': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format',
  'abstract': 'https://images.unsplash.com/photo-1507908708918-778587c9e563?q=80&w=400&auto=format',
  'vintage': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=400&auto=format',
  'comic': 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=400&auto=format'
};