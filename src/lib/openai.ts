import { VideoGenerationSettings } from '../types/video';
import { ContentType } from '../types/content';
import { ImageGenerationSettings } from '../types/image';
import { BlogGenerationSettings } from '../types/blog';
import { generateVideo as generateVideoFFmpeg, addWatermark as addWatermarkFFmpeg } from './video';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key is missing! Make sure VITE_OPENAI_API_KEY is set in your .env file');
}

class RateLimitQueue {
  private queue: (() => Promise<any>)[] = [];
  private processing = false;
  private lastRequestTime = 0;
  private requestsThisMinute = 0;
  private readonly RATE_LIMIT = 5;
  private readonly RATE_LIMIT_WINDOW = 60000;
  private readonly MIN_DELAY = 12000;

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      
      if (now - this.lastRequestTime >= this.RATE_LIMIT_WINDOW) {
        this.requestsThisMinute = 0;
      }

      if (this.requestsThisMinute >= this.RATE_LIMIT) {
        const waitTime = this.RATE_LIMIT_WINDOW - (now - this.lastRequestTime);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.requestsThisMinute = 0;
        continue;
      }

      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.MIN_DELAY) {
        await new Promise(resolve => setTimeout(resolve, this.MIN_DELAY - timeSinceLastRequest));
      }

      const task = this.queue.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error('Error processing queue task:', error);
        }
        this.requestsThisMinute++;
        this.lastRequestTime = Date.now();
      }
    }

    this.processing = false;
  }
}

const imageQueue = new RateLimitQueue();

const BLOG_STYLE_MODIFIERS: Record<string, string[]> = {
  'article': ['informative', 'structured', 'comprehensive'],
  'tutorial': ['step-by-step', 'instructional', 'practical'],
  'review': ['analytical', 'evaluative', 'balanced'],
  'opinion': ['persuasive', 'argumentative', 'personal'],
  'news': ['factual', 'timely', 'objective'],
  'technical': ['detailed', 'precise', 'technical'],
  'story': ['narrative', 'engaging', 'descriptive'],
  'listicle': ['organized', 'scannable', 'actionable']
};

const CALL_TO_ACTIONS = [
  'Visit Now',
  'Shop Now',
  'Try Now',
  'Get Started',
  'Learn More',
  'Join Today',
  'Discover More',
  'Explore Now',
  'Sign Up Today',
  'Start Free'
];

function modifyPrompt(basePrompt: string, index: number): string {
  const modifiers = [
    'with a unique perspective',
    'from a different angle',
    'with an alternative approach',
    'with a fresh take',
    'with a distinct style'
  ];
  return `${basePrompt} ${modifiers[index % modifiers.length]}`;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function handleRateLimit<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError;
  let delayTime = initialDelay;

  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (error?.error?.code === 'rate_limit_exceeded') {
        console.log(`Rate limit hit, waiting ${delayTime}ms before retry ${i + 1}/${retries}`);
        await delay(delayTime);
        delayTime *= 2;
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function generateContent(
  type: ContentType,
  prompt: string,
  settings: { 
    creativity: number; 
    tone: string; 
    count?: number;
    blogSettings?: BlogGenerationSettings;
  }
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    console.log('Generating content with OpenAI...', { type, prompt, settings });

    const count = Math.min(settings.count || 1, 5);
    const prompts = Array.from({ length: count }, (_, i) => modifyPrompt(prompt, i));
    const cta = CALL_TO_ACTIONS[Math.floor(Math.random() * CALL_TO_ACTIONS.length)];

    const responses = [];
    for (const modifiedPrompt of prompts) {
      const response = await handleRateLimit(async () => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{
              role: "system",
              content: type === 'blog' 
                ? `You are a professional blog writer. Create a detailed, engaging blog post with 3-5 well-structured paragraphs.
                   Include a compelling title, clear sections, and 10-15 relevant hashtags at the end.
                   Format: [Title]\n\n[Content in paragraphs]\n\n[Hashtags separated by commas: #tag1, #tag2, etc.]`
                : `You are a professional content creator specializing in ${type} content. 
                   Create unique, catchy content with a ${settings.tone} tone and 
                   creativity level of ${settings.creativity * 100}%.
                   Include a compelling title, engaging description, and 20 relevant hashtags.
                   Format: [Title]\n[Description]\n\n${cta}: [Website URL]\n\n[#hashtags]
                   ${settings.blogSettings ? `Use the ${settings.blogSettings.style} style.` : ''}`
            }, {
              role: "user",
              content: type === 'blog'
                ? `Write a blog post about: ${modifiedPrompt}. Include relevant industry hashtags.`
                : modifiedPrompt
            }],
            temperature: settings.creativity,
            max_tokens: type === 'blog' ? 2000 : 500
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw error;
        }

        const data = await response.json();
        return data.choices[0].message.content;
      });

      responses.push(response);
      if (prompts.length > 1) {
        await delay(1000);
      }
    }

    const generatedContent = responses.join('\n\n---\n\n');

    // For blog content, return just the formatted post
    if (type === 'blog') {
      return generatedContent.trim();
    }

    // For other content types, keep existing format with CTA
    switch (type) {
      case 'video':
        return `🎥 ${generatedContent}\n\n${cta}: https://example.com\n\n#video #content #marketing`;
      case 'image':
        return `📸 ${generatedContent}\n\n${cta}: https://example.com\n\n#image #visual #design`;
      default:
        return `🎯 ${generatedContent}\n\n${cta}: https://example.com\n\n#content #marketing`;
    }
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export async function generateImage(
  prompt: string,
  settings?: ImageGenerationSettings
): Promise<string[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please check your .env file.');
  }

  try {
    console.log('Generating images with OpenAI...', { prompt, settings });

    const count = Math.min(settings?.count || 1, 5);
    const prompts = Array.from({ length: count }, (_, i) => modifyPrompt(prompt, i));

    const allImages = [];
    for (const modifiedPrompt of prompts) {
      const style = settings?.style || 'photographic';
      const styleModifiers = STYLE_MODIFIERS[style] || [];
      const enhancedPrompt = `${modifiedPrompt} in ${style} style, ${styleModifiers.join(', ')}`;

      console.log('Enhanced image prompt:', enhancedPrompt);

      const imageUrl = await imageQueue.add(async () => {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            n: 1,
            size: '1024x1024',
            response_format: 'url',
            quality: settings?.creativity ? 'hd' : 'standard'
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw error;
        }

        const data = await response.json();
        return data.data[0].url;
      });

      allImages.push(imageUrl);
    }

    console.log('Generated images:', allImages);
    return allImages;
  } catch (error) {
    console.error('Error generating images:', error);
    throw error;
  }
}

export async function generateVideo(prompt: string, settings: VideoGenerationSettings): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please check your .env file.');
  }

  try {
    console.log('Generating video with OpenAI...', { prompt, settings });

    const sceneCount = Math.min(8, 5);
    const scenes = Array.from({ length: sceneCount }, (_, i) => {
      const sceneType = i === 0 ? 'opening' 
        : i === sceneCount - 1 ? 'closing'
        : 'main';
      
      const modifiedPrompt = modifyPrompt(prompt, i);
      return `${modifiedPrompt} - ${sceneType} scene - in ${settings.style} style with ${settings.category} focus`;
    });

    console.log('Generating video scenes:', scenes);

    const images = [];
    for (const scenePrompt of scenes) {
      const imageUrl = await handleRateLimit(async () => {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            prompt: scenePrompt,
            n: 1,
            size: '1024x1024',
            response_format: 'url'
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw error;
        }

        const data = await response.json();
        return data.data[0].url;
      });

      images.push(imageUrl);
      await delay(12000);
    }

    console.log('Generated scene images:', images);

    let audioUrl: string | undefined;
    if (settings.music?.genre) {
      audioUrl = 'https://example.com/audio/background.mp3';
    }

    const videoUrl = await generateVideoFFmpeg(settings, images, audioUrl);
    
    if (settings.textOverlay?.enabled) {
      return await addWatermarkFFmpeg(videoUrl, settings.textOverlay.text);
    }

    return videoUrl;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}

export async function addWatermark(videoUrl: string, watermarkText: string): Promise<string> {
  return addWatermarkFFmpeg(videoUrl, watermarkText);
}

const STYLE_MODIFIERS: Record<string, string[]> = {
  'photographic': ['photography', 'professional', 'high-quality'],
  'digital-art': ['digital-art', 'illustration', 'graphic-design'],
  'pop-art': ['pop-art', 'colorful', 'vibrant'],
  'minimalist': ['minimalist', 'simple', 'clean'],
  'watercolor': ['watercolor', 'painting', 'artistic'],
  'oil-painting': ['oil-painting', 'fine-art', 'classical'],
  'sketch': ['sketch', 'drawing', 'pencil-art'],
  'anime': ['anime', 'manga', 'japanese-art'],
  'pixel-art': ['pixel-art', '8-bit', 'retro'],
  'abstract': ['abstract', 'modern', 'contemporary'],
  'vintage': ['vintage', 'retro', 'classic'],
  'comic': ['comic', 'cartoon', 'illustration']
};