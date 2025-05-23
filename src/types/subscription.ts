export type SubscriptionTier = 'free' | 'personal' | 'enterprise';

export interface SubscriptionFeature {
  name: string;
  description: string;
  included: boolean;
  limit?: number;
  downloadable?: boolean;
}

export interface CampaignManagerFeature {
  name: string;
  description: string;
  included: boolean;
  price?: number;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  period: 'month' | 'year';
  description: string;
  features: SubscriptionFeature[];
  buttonText: string;
  popular?: boolean;
  allowDownloads?: boolean;
  campaignManager?: {
    available: boolean;
    price: number;
    description: string;
    features: string[];
  };
  marketingManager?: {
    available: boolean;
    price: number;
    description: string;
    features: string[];
  };
}

export interface MarketingCampaign {
  id: string;
  websiteUrl: string;
  goals: string[];
  businessDescription: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'paused' | 'completed';
  contentTypes: {
    videos: number;
    images: number;
    blogs: number;
  };
  platforms: string[];
  managedBy?: {
    id: string;
    name: string;
    role: 'ai' | 'human';
    expertise: string[];
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    period: 'month',
    description: 'Try our AI marketing tools free for 3 days',
    buttonText: 'Start Free Trial',
    features: [
      { name: 'Video Generation', description: 'Generate engaging video content', included: true, limit: 10 },
      { name: 'Image Generation', description: 'Create stunning visuals', included: true, limit: 20 },
      { name: 'Blog Posts', description: 'Write SEO-optimized articles', included: true, limit: 5 },
      { name: 'Social Media Accounts', description: 'Connect your platforms', included: true, limit: 5 },
      { name: 'Campaign Duration', description: 'Access period', included: true, limit: 3 },
      { name: 'AI Content Enhancement', description: 'Improve content quality', included: false },
      { name: 'Advanced Analytics', description: 'Track performance metrics', included: false },
      { name: 'Priority Support', description: '24/7 dedicated support', included: false }
    ],
    campaignManager: {
      available: true,
      price: 199,
      description: '+ $199/mo Dedicated Campaign Manager',
      features: [
        'Opens and manages 10 new social accounts monthly',
        'Professional content scheduling',
        'Cross-platform optimization',
        'Performance tracking',
        'Engagement monitoring',
        'Brand voice consistency',
        'Content calendar management',
        'Monthly strategy review'
      ]
    }
  },
  {
    id: 'personal',
    name: 'Personal',
    price: 49,
    period: 'month',
    description: 'Perfect for individuals and small businesses',
    buttonText: 'Start Personal Plan',
    popular: true,
    features: [
      { name: 'Video Generation', description: 'Generate engaging video content', included: true, limit: 100 },
      { name: 'Image Generation', description: 'Create stunning visuals', included: true, limit: 300 },
      { name: 'Blog Posts', description: 'Write SEO-optimized articles', included: true, limit: 100 },
      { name: 'Social Media Accounts', description: 'Connect your platforms', included: true, limit: 20 },
      { name: 'Campaign Duration', description: 'Access period', included: true, limit: 30 },
      { name: 'AI Content Enhancement', description: 'Improve content quality', included: true },
      { name: 'Advanced Analytics', description: 'Track performance metrics', included: true },
      { name: 'Priority Support', description: '24/7 dedicated support', included: false }
    ],
    campaignManager: {
      available: true,
      price: 199,
      description: '+ $199/mo Dedicated Campaign Manager',
      features: [
        'Opens and manages 10 new social accounts monthly',
        'Professional content scheduling',
        'Cross-platform optimization',
        'Performance tracking',
        'Engagement monitoring',
        'Brand voice consistency',
        'Content calendar management',
        'Monthly strategy review'
      ]
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149,
    period: 'month',
    description: 'For businesses that need unlimited content',
    buttonText: 'Start Enterprise Plan',
    features: [
      { name: 'Unlimited Video Generation', description: 'Generate unlimited video content', included: true },
      { name: 'Unlimited Image Generation', description: 'Create unlimited visuals', included: true },
      { name: 'Unlimited Blog Posts', description: 'Write unlimited articles', included: true },
      { name: 'Unlimited Social Media', description: 'Connect unlimited platforms', included: true },
      { name: 'Unlimited Campaign Duration', description: 'Unlimited access period', included: true },
      { name: 'Advanced AI Enhancement', description: 'Premium content quality', included: true },
      { name: 'Enterprise Analytics', description: 'Advanced performance metrics', included: true },
      { name: 'Priority Support', description: '24/7 dedicated support', included: true }
    ],
    campaignManager: {
      available: true,
      price: 199,
      description: '+ $199/mo Dedicated Campaign Manager',
      features: [
        'Opens and manages 10 new social accounts monthly',
        'Professional content scheduling',
        'Cross-platform optimization',
        'Performance tracking',
        'Engagement monitoring',
        'Brand voice consistency',
        'Content calendar management',
        'Monthly strategy review'
      ]
    }
  }
];