import { Platform } from '../types/content';

// Social Media Platform SDK Interfaces
interface PlatformSDK {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  post(content: any): Promise<string>;
  schedule(content: any, date: Date): Promise<string>;
  delete(postId: string): Promise<void>;
}

// Platform-specific implementations
class FacebookSDK implements PlatformSDK {
  async connect() {
    // TODO: Implement Facebook OAuth
    throw new Error('Facebook integration not implemented');
  }

  async disconnect() {
    // TODO: Implement disconnect
    throw new Error('Facebook integration not implemented');
  }

  async post(content: any) {
    // TODO: Implement post
    throw new Error('Facebook integration not implemented');
  }

  async schedule(content: any, date: Date) {
    // TODO: Implement scheduling
    throw new Error('Facebook integration not implemented');
  }

  async delete(postId: string) {
    // TODO: Implement delete
    throw new Error('Facebook integration not implemented');
  }
}

class TwitterSDK implements PlatformSDK {
  async connect() {
    // TODO: Implement Twitter OAuth
    throw new Error('Twitter integration not implemented');
  }

  async disconnect() {
    // TODO: Implement disconnect
    throw new Error('Twitter integration not implemented');
  }

  async post(content: any) {
    // TODO: Implement post
    throw new Error('Twitter integration not implemented');
  }

  async schedule(content: any, date: Date) {
    // TODO: Implement scheduling
    throw new Error('Twitter integration not implemented');
  }

  async delete(postId: string) {
    // TODO: Implement delete
    throw new Error('Twitter integration not implemented');
  }
}

// Platform SDK factory
const platformSDKs: Record<Platform, () => PlatformSDK> = {
  facebook: () => new FacebookSDK(),
  twitter: () => new TwitterSDK(),
  // Add other platforms...
} as Record<Platform, () => PlatformSDK>;

// Platform settings
export const PLATFORM_SETTINGS = {
  // Priority platforms
  keckr: { name: 'Keckr', platform: 'keckr' as Platform, maxLength: 2000, maxImages: 10, maxVideos: 1, supportedTypes: ['text', 'image', 'video', 'link'] },
  momenters: { name: 'Momenters', platform: 'momenters' as Platform, maxLength: 2000, maxImages: 10, maxVideos: 1, supportedTypes: ['text', 'image', 'video', 'link'] },
  
  // Image platforms
  instagram: { name: 'Instagram', platform: 'instagram' as Platform, maxLength: 2200, maxImages: 10, supportedTypes: ['image', 'carousel'] },
  pinterest: { name: 'Pinterest', platform: 'pinterest' as Platform, maxLength: 500, maxImages: 1, supportedTypes: ['image'] },
  behance: { name: 'Behance', platform: 'behance' as Platform, maxLength: 3000, maxImages: 50, supportedTypes: ['image', 'portfolio'] },
  dribbble: { name: 'Dribbble', platform: 'dribbble' as Platform, maxLength: 1000, maxImages: 1, supportedTypes: ['image'] },
  flickr: { name: 'Flickr', platform: 'flickr' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  px500: { name: '500px', platform: 'px500' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  deviantart: { name: 'DeviantArt', platform: 'deviantart' as Platform, maxLength: 2000, maxImages: 50, supportedTypes: ['image'] },
  artstation: { name: 'ArtStation', platform: 'artstation' as Platform, maxLength: 3000, maxImages: 50, supportedTypes: ['image'] },
  unsplash: { name: 'Unsplash', platform: 'unsplash' as Platform, maxLength: 1000, maxImages: 1, supportedTypes: ['image'] },
  shutterstock: { name: 'Shutterstock', platform: 'shutterstock' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  getty: { name: 'Getty Images', platform: 'getty' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  adobe_stock: { name: 'Adobe Stock', platform: 'adobe_stock' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  smugmug: { name: 'SmugMug', platform: 'smugmug' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  zenfolio: { name: 'Zenfolio', platform: 'zenfolio' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  eyeem: { name: 'EyeEm', platform: 'eyeem' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  gurushots: { name: 'GuruShots', platform: 'gurushots' as Platform, maxLength: 1000, maxImages: 1, supportedTypes: ['image'] },
  viewbug: { name: 'ViewBug', platform: 'viewbug' as Platform, maxLength: 1000, maxImages: 1, supportedTypes: ['image'] },
  youpic: { name: 'YouPic', platform: 'youpic' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  fotomoto: { name: 'Fotomoto', platform: 'fotomoto' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  snapwire: { name: 'Snapwire', platform: 'snapwire' as Platform, maxLength: 1000, maxImages: 1, supportedTypes: ['image'] },
  twenty20: { name: 'Twenty20', platform: 'twenty20' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  stocksy: { name: 'Stocksy', platform: 'stocksy' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  offset: { name: 'Offset', platform: 'offset' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  alamy: { name: 'Alamy', platform: 'alamy' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  depositphotos: { name: 'Depositphotos', platform: 'depositphotos' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  dreamstime: { name: 'Dreamstime', platform: 'dreamstime' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  istock: { name: 'iStock', platform: 'istock' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  fotolia: { name: 'Fotolia', platform: 'fotolia' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  canva: { name: 'Canva', platform: 'canva' as Platform, maxLength: 2000, maxImages: 100, supportedTypes: ['image'] },
  
  // Video platforms
  youtube: { name: 'YouTube', platform: 'youtube' as Platform, maxLength: 5000, maxVideos: 1, supportedTypes: ['video', 'link'] },
  tiktok: { name: 'TikTok', platform: 'tiktok' as Platform, maxLength: 2200, maxVideos: 1, supportedTypes: ['video'] },
  instagram_reels: { name: 'Instagram Reels', platform: 'instagram_reels' as Platform, maxLength: 2200, maxVideos: 1, supportedTypes: ['video'] },
  facebook_reels: { name: 'Facebook Reels', platform: 'facebook_reels' as Platform, maxLength: 2200, maxVideos: 1, supportedTypes: ['video'] },
  snapchat: { name: 'Snapchat', platform: 'snapchat' as Platform, maxLength: 1000, maxVideos: 1, supportedTypes: ['video'] },
  vimeo: { name: 'Vimeo', platform: 'vimeo' as Platform, maxLength: 5000, maxVideos: 1, supportedTypes: ['video', 'link'] },
  dailymotion: { name: 'Dailymotion', platform: 'dailymotion' as Platform, maxLength: 5000, maxVideos: 1, supportedTypes: ['video', 'link'] },
  twitch: { name: 'Twitch', platform: 'twitch' as Platform, maxLength: 5000, maxVideos: 1, supportedTypes: ['video', 'link'] },
  bilibili: { name: 'Bilibili', platform: 'bilibili' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  douyin: { name: 'Douyin', platform: 'douyin' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  kwai: { name: 'Kwai', platform: 'kwai' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  triller: { name: 'Triller', platform: 'triller' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  likee: { name: 'Likee', platform: 'likee' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  byte: { name: 'Byte', platform: 'byte' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  kuaishou: { name: 'Kuaishou', platform: 'kuaishou' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  youku: { name: 'Youku', platform: 'youku' as Platform, maxLength: 5000, maxVideos: 1, supportedTypes: ['video'] },
  iqiyi: { name: 'iQIYI', platform: 'iqiyi' as Platform, maxLength: 5000, maxVideos: 1, supportedTypes: ['video'] },
  wechat_channels: { name: 'WeChat Channels', platform: 'wechat_channels' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  xiaohongshu: { name: 'Xiaohongshu', platform: 'xiaohongshu' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  pinterest_idea_pins: { name: 'Pinterest Idea Pins', platform: 'pinterest_idea_pins' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  linkedin_video: { name: 'LinkedIn Video', platform: 'linkedin_video' as Platform, maxLength: 3000, maxVideos: 1, supportedTypes: ['video'] },
  facebook_watch: { name: 'Facebook Watch', platform: 'facebook_watch' as Platform, maxLength: 5000, maxVideos: 1, supportedTypes: ['video'] },
  reddit_video: { name: 'Reddit Video', platform: 'reddit_video' as Platform, maxLength: 3000, maxVideos: 1, supportedTypes: ['video'] },
  tumblr_video: { name: 'Tumblr Video', platform: 'tumblr_video' as Platform, maxLength: 3000, maxVideos: 1, supportedTypes: ['video'] },
  ok_ru: { name: 'OK.ru', platform: 'ok_ru' as Platform, maxLength: 3000, maxVideos: 1, supportedTypes: ['video'] },
  rutube: { name: 'Rutube', platform: 'rutube' as Platform, maxLength: 3000, maxVideos: 1, supportedTypes: ['video'] },
  vk_video: { name: 'VK Video', platform: 'vk_video' as Platform, maxLength: 3000, maxVideos: 1, supportedTypes: ['video'] },
  coub: { name: 'Coub', platform: 'coub' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  chingari: { name: 'Chingari', platform: 'chingari' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  mitron: { name: 'Mitron', platform: 'mitron' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  moj: { name: 'Moj', platform: 'moj' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  mx_takatak: { name: 'MX TakaTak', platform: 'mx_takatak' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  roposo: { name: 'Roposo', platform: 'roposo' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  trell: { name: 'Trell', platform: 'trell' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  zili: { name: 'Zili', platform: 'zili' as Platform, maxLength: 2000, maxVideos: 1, supportedTypes: ['video'] },
  
  // Blog platforms
  blogger: { name: 'Blogger', platform: 'blogger' as Platform, maxLength: 100000, maxImages: 100, maxVideos: 10, supportedTypes: ['text', 'image', 'video', 'link', 'blog'] },
  wordpress_com: { name: 'WordPress.com', platform: 'wordpress_com' as Platform, maxLength: 100000, maxImages: 100, maxVideos: 10, supportedTypes: ['text', 'image', 'video', 'link', 'blog'] },
  wordpress_org: { name: 'WordPress.org', platform: 'wordpress_org' as Platform, maxLength: 100000, maxImages: 100, maxVideos: 10, supportedTypes: ['text', 'image', 'video', 'link', 'blog'] },
  medium: { name: 'Medium', platform: 'medium' as Platform, maxLength: 100000, maxImages: 50, maxVideos: 5, supportedTypes: ['text', 'image', 'video', 'link', 'blog'] },
  ghost: { name: 'Ghost', platform: 'ghost' as Platform, maxLength: 100000, maxImages: 50, maxVideos: 5, supportedTypes: ['text', 'image', 'video', 'link', 'blog'] },
  wix: { name: 'Wix', platform: 'wix' as Platform, maxLength: 100000, maxImages: 100, maxVideos: 10, supportedTypes: ['text', 'image', 'video', 'link', 'blog'] },
  squarespace: { name: 'Squarespace', platform: 'squarespace' as Platform, maxLength: 100000, maxImages: 100, maxVideos: 10, supportedTypes: ['text', 'image', 'video', 'link', 'blog'] },
  weibo: { name: 'Weibo', platform: 'weibo' as Platform, maxLength: 2000, maxImages: 9, maxVideos: 1, supportedTypes: ['text', 'image', 'video', 'blog'] },
  wikipedia: { name: 'Wikipedia', platform: 'wikipedia' as Platform, maxLength: 100000, maxImages: 100, supportedTypes: ['text', 'image', 'blog'] },
  rednote: { name: 'RedNote', platform: 'rednote' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  houstonchronicle: { name: 'Houston Chronicle', platform: 'houstonchronicle' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  lemon8: { name: 'Lemon8', platform: 'lemon8' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  strikingly: { name: 'Strikingly', platform: 'strikingly' as Platform, maxLength: 100000, maxImages: 100, supportedTypes: ['text', 'image', 'blog'] },
  jianshu: { name: 'Jianshu', platform: 'jianshu' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  pixnet: { name: 'Pixnet', platform: 'pixnet' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  udn: { name: 'UDN Blog', platform: 'udn' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  afribloggers: { name: 'Afribloggers', platform: 'afribloggers' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  blogger_kenya: { name: 'Blogger Kenya', platform: 'blogger_kenya' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  nairaland: { name: 'Nairaland', platform: 'nairaland' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  bonga: { name: 'Bonga', platform: 'bonga' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  substack: { name: 'Substack', platform: 'substack' as Platform, maxLength: 100000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  hashnode: { name: 'Hashnode', platform: 'hashnode' as Platform, maxLength: 100000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  dev_to: { name: 'DEV Community', platform: 'dev_to' as Platform, maxLength: 100000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  telegraph: { name: 'Telegraph', platform: 'telegraph' as Platform, maxLength: 100000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  tumblr: { name: 'Tumblr', platform: 'tumblr' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  blogger_africa: { name: 'Blogger Africa', platform: 'blogger_africa' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  blogger_india: { name: 'Blogger India', platform: 'blogger_india' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  blogger_indonesia: { name: 'Blogger Indonesia', platform: 'blogger_indonesia' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  blogger_malaysia: { name: 'Blogger Malaysia', platform: 'blogger_malaysia' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  blogger_philippines: { name: 'Blogger Philippines', platform: 'blogger_philippines' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  blogger_singapore: { name: 'Blogger Singapore', platform: 'blogger_singapore' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  blogger_thailand: { name: 'Blogger Thailand', platform: 'blogger_thailand' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] },
  blogger_vietnam: { name: 'Blogger Vietnam', platform: 'blogger_vietnam' as Platform, maxLength: 50000, maxImages: 50, supportedTypes: ['text', 'image', 'blog'] }
} as Record<Platform, any>;

// Content formatting and validation functions
export function formatContentForPlatform(content: string, platform: Platform, metadata?: any): string {
  const settings = PLATFORM_SETTINGS[platform];
  if (!settings) return content;

  let formatted = content;

  // Truncate content if needed
  if (formatted.length > settings.maxLength) {
    formatted = formatted.substring(0, settings.maxLength - 3) + '...';
  }

  return formatted;
}

export function validateContent(content: string, platform: Platform, metadata?: any, scheduledTime?: Date): { isValid: boolean; warnings: string[] } {
  const settings = PLATFORM_SETTINGS[platform];
  if (!settings) {
    return { isValid: false, warnings: ['Unsupported platform'] };
  }

  const warnings: string[] = [];

  // Check content length
  if (content.length > settings.maxLength) {
    warnings.push(`Content exceeds maximum length for ${settings.name}`);
  }

  // Check media limits
  if (metadata?.images?.length > settings.maxImages) {
    warnings.push(`Too many images for ${settings.name}`);
  }

  if (metadata?.videos?.length > settings.maxVideos) {
    warnings.push(`Too many videos for ${settings.name}`);
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}

export function getPlatformHashtags(platform: Platform): string[] {
  // Platform-specific hashtag suggestions
  const hashtags: Record<Platform, string[]> = {
    facebook: ['facebook', 'socialmedia', 'marketing'],
    twitter: ['twitter', 'tweet', 'socialmedia'],
    instagram: ['instagram', 'insta', 'photooftheday'],
    linkedin: ['linkedin', 'business', 'professional'],
    pinterest: ['pinterest', 'pins', 'inspiration'],
    youtube: ['youtube', 'video', 'subscribe'],
    tiktok: ['tiktok', 'fyp', 'viral'],
    // Add other platforms...
  } as Record<Platform, string[]>;

  return hashtags[platform] || [];
}

// Platform-specific optimal posting times (24-hour format)
const OPTIMAL_HOURS: Record<Platform, number[]> = {
  facebook: [9, 13, 15, 19],
  twitter: [8, 12, 17, 20],
  instagram: [11, 14, 19, 21],
  linkedin: [9, 11, 14, 17],
  pinterest: [14, 17, 20, 22],
  youtube: [15, 17, 19, 21],
  tiktok: [12, 15, 19, 21],
  // Add other platforms...
} as Record<Platform, number[]>;

export function getBestPostingTime(platform: Platform, baseTime: Date = new Date()): Date {
  const hours = OPTIMAL_HOURS[platform] || [9, 15];
  const now = new Date(baseTime);
  const currentHour = now.getHours();

  // Find the next optimal hour
  const nextHour = hours.find(h => h > currentHour) || hours[0];
  const tomorrow = nextHour <= currentHour;

  const scheduledTime = new Date(now);
  scheduledTime.setHours(nextHour, 0, 0, 0);
  
  if (tomorrow) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  return scheduledTime;
}