import { DraggableData } from '@dnd-kit/core';

export type BlogStyle = 
  | 'article'
  | 'tutorial'
  | 'review'
  | 'opinion'
  | 'news'
  | 'technical'
  | 'story'
  | 'listicle';

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

export interface BlogGenerationSettings {
  count: number;
  creativity: number;
  style: BlogStyle;
  textLength: number;
  imageCount: number;
  platforms: string[];
  viewMode: 'preview' | 'code';
  textPlacement: 'random' | 'fixed';
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

export const BLOG_DIMENSIONS = {
  width: 1200,
  height: 630,
  aspectRatio: 1.91
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

// Style preview images
export const STYLE_PREVIEWS: Record<BlogStyle, string> = {
  'article': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=400&auto=format',
  'tutorial': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format',
  'review': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format',
  'opinion': 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&auto=format',
  'news': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400&auto=format',
  'technical': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format',
  'story': 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400&auto=format',
  'listicle': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=400&auto=format'
};