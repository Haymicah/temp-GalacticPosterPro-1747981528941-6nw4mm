// Test data for content generation
export const TEST_PROMPTS = {
  video: [
    'Create an engaging product demonstration video',
    'Design a social media promotional video',
    'Generate a tutorial video about our platform'
  ],
  image: [
    'Design a modern tech-themed social media post',
    'Create an infographic about AI benefits',
    'Generate a professional business banner'
  ],
  blog: [
    'Write an article about digital transformation trends',
    'Create a blog post about AI in marketing',
    'Generate content about social media strategy'
  ]
};

export const TEST_IMAGES = [
  'https://images.unsplash.com/photo-1485988412941-77a35537dae4?q=80&w=1024',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1024',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1024',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1024'
];

export const TEST_VIDEO_SETTINGS = {
  length: 30,
  resolution: '1080x1920',
  style: 'modern',
  images: [],
  transitionStyle: 'fade',
  transitionDuration: 0.5,
  isGenerating: false,
  progress: 0
};

export const TEST_BLOG_SETTINGS = {
  count: 1,
  style: 'article',
  textLength: 1000,
  imageCount: 1,
  platforms: [],
  viewMode: 'preview',
  textPlacement: 'random',
  creativity: 0.8,
  scheduling: {
    randomized: false,
    timeWindow: {
      start: '09:00',
      end: '17:00'
    },
    dailyLimit: 5
  }
};