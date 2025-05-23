import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Rocket, Globe, Target, Briefcase, 
  Calendar, Video, Image as ImageIcon, 
  FileText, Share2, ChevronRight, Lock,
  Check, X, ArrowLeft, Eye, Image,
  Users, MessageSquare, HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { SubscriptionPlan, SubscriptionTier } from '../types/subscription';
import { generateContent, generateImage } from '../lib/openai';
import { CampaignManagerModal } from './CampaignManagerModal';
import { SUBSCRIPTION_PLANS } from '../types/subscription';

interface MarketingCampaignProps {
  onClose: () => void;
  onShowSchedule: () => void;
}

export function MarketingCampaign({ onClose, onShowSchedule }: MarketingCampaignProps) {
  const [step, setStep] = useState<'website' | 'goals' | 'business' | 'plan'>('website');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [businessDescription, setBusinessDescription] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>('free');
  const [showPreview, setShowPreview] = useState(false);
  const [showCampaignManager, setShowCampaignManager] = useState<'ai' | 'human' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({
    videos: 0,
    images: 0,
    blogs: 0
  });
  const [selectedCampaignManager, setSelectedCampaignManager] = useState<string[]>([]);
  const { addScheduledPost } = useStore();

  const GOALS = [
    'Increase brand awareness',
    'Drive website traffic',
    'Generate leads',
    'Boost sales',
    'Improve engagement',
    'Build community',
    'Establish authority',
    'Expand reach'
  ];

  // Load saved campaign data
  useEffect(() => {
    const savedData = localStorage.getItem('campaignData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setWebsiteUrl(data.websiteUrl);
      setGoals(data.goals);
      setBusinessDescription(data.businessDescription);
      setSelectedPlan(data.selectedPlan);
      setSelectedCampaignManager(data.selectedCampaignManager || []);
      
      // If this is an affiliate campaign, automatically start content generation
      if (data.isAffiliateCampaign) {
        setShowPreview(true);
        generateTestContent();
      }
    }
  }, []);

  const generateVideoContent = async (index: number) => {
    try {
      const prompt = `Create an engaging marketing video about ${businessDescription} that helps ${goals.join(' and ')}. Video #${index + 1} of 8.`;
      const content = await generateContent('video', prompt, { creativity: 0.7, tone: 'professional' });
      
      addScheduledPost({
        id: crypto.randomUUID(),
        type: 'video',
        content: content,
        timestamp: new Date(),
        video: {
          url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
          ratio: '16:9'
        },
        title: `Marketing Video ${index + 1}`,
        description: content.split('\n')[0],
        platform: 'youtube'
      });

      setGenerationProgress(prev => ({ ...prev, videos: prev.videos + 1 }));
    } catch (error) {
      console.error('Error generating video:', error);
    }
  };

  const generateImageContent = async (index: number) => {
    try {
      const prompt = `Create a marketing image for ${businessDescription} that showcases ${goals[index % goals.length]}. Image #${index + 1} of 8.`;
      const content = await generateContent('image', prompt, { creativity: 0.7, tone: 'professional' });
      const imageUrl = await generateImage(prompt);

      addScheduledPost({
        id: crypto.randomUUID(),
        type: 'image',
        content: content,
        timestamp: new Date(),
        image: imageUrl,
        title: `Marketing Image ${index + 1}`,
        description: content.split('\n')[0],
        platform: 'instagram'
      });

      setGenerationProgress(prev => ({ ...prev, images: prev.images + 1 }));
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const generateBlogContent = async (index: number) => {
    try {
      const prompt = `Write a blog post about ${businessDescription} focusing on ${goals[index % goals.length]}. Blog #${index + 1} of 4.`;
      const content = await generateContent('blog', prompt, { creativity: 0.7, tone: 'professional' });
      const imageUrl = await generateImage(prompt);

      addScheduledPost({
        id: crypto.randomUUID(),
        type: 'blog',
        content: content,
        timestamp: new Date(),
        title: `Blog Post ${index + 1}`,
        description: content.split('\n').slice(1, 3).join('\n'),
        platform: 'wordpress',
        image: imageUrl
      });

      setGenerationProgress(prev => ({ ...prev, blogs: prev.blogs + 1 }));
    } catch (error) {
      console.error('Error generating blog:', error);
    }
  };

  const generateTestContent = async () => {
    setIsGenerating(true);
    setGenerationProgress({ videos: 0, images: 0, blogs: 0 });

    try {
      // Generate content in parallel with delays to avoid rate limits
      const videoPromises = Array(8).fill(null).map((_, i) => 
        new Promise(resolve => setTimeout(() => resolve(generateVideoContent(i)), i * 2000))
      );
      
      const imagePromises = Array(8).fill(null).map((_, i) => 
        new Promise(resolve => setTimeout(() => resolve(generateImageContent(i)), i * 2000))
      );
      
      const blogPromises = Array(4).fill(null).map((_, i) => 
        new Promise(resolve => setTimeout(() => resolve(generateBlogContent(i)), i * 2000))
      );

      await Promise.all([
        ...videoPromises,
        ...imagePromises,
        ...blogPromises
      ]);

      // Store campaign data
      localStorage.setItem('campaignData', JSON.stringify({
        websiteUrl,
        goals,
        businessDescription,
        selectedPlan,
        selectedCampaignManager
      }));

      // Close the campaign modal and show the schedule
      onClose();
      onShowSchedule();
    } catch (error) {
      console.error('Error generating campaign content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPreview = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-terminal-black p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Campaign Preview</h2>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-terminal-darkGreen rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Website</h3>
              <div className="bg-terminal-darkGreen p-4 rounded">
                <p className="text-lg break-all">{websiteUrl}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Goals</h3>
              <div className="flex flex-wrap gap-2">
                {goals.map(goal => (
                  <span
                    key={goal}
                    className="bg-terminal-darkGreen px-4 py-2 rounded-full text-sm"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Business Description</h3>
              <div className="bg-terminal-darkGreen p-4 rounded">
                <p className="whitespace-pre-wrap">{businessDescription}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Selected Plan</h3>
              <div className="bg-terminal-darkGreen p-4 rounded">
                <h4 className="text-xl font-bold mb-2">
                  {SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.name}
                </h4>
                <p className="text-sm opacity-75">
                  {SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.description}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-terminal-green mt-1" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 mt-1" />
                      )}
                      <div>
                        <div className="text-sm font-bold">{feature.name}</div>
                        <div className="text-xs opacity-75">
                          {feature.description}
                          {feature.limit && ` (${feature.limit})`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedCampaignManager.includes(selectedPlan) && (
                  <div className="mt-4 p-4 bg-terminal-black rounded-lg">
                    <h5 className="text-sm font-bold mb-2">Campaign Manager Added (+$199/mo)</h5>
                    <ul className="space-y-1">
                      {SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.campaignManager?.features.map((feature, index) => (
                        <li key={index} className="text-xs flex items-center space-x-1">
                          <Check className="w-3 h-3 text-terminal-green" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Content Generation</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-terminal-darkGreen p-4 rounded">
                  <Video className="w-8 h-8 mb-2 text-terminal-green" />
                  <p className="font-bold text-lg">8 Videos</p>
                  <p className="text-sm opacity-75">Engaging video content</p>
                  <div className="mt-2 text-xs">
                    <p>• Professional editing</p>
                    <p>• Custom thumbnails</p>
                    <p>• Platform optimization</p>
                  </div>
                  {isGenerating && (
                    <div className="mt-2">
                      <div className="h-1 bg-terminal-black rounded overflow-hidden">
                        <div 
                          className="h-full bg-terminal-green transition-all duration-300"
                          style={{ width: `${(generationProgress.videos / 8) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 text-center">{generationProgress.videos}/8</p>
                    </div>
                  )}
                </div>
                <div className="bg-terminal-darkGreen p-4 rounded">
                  <Image className="w-8 h-8 mb-2 text-terminal-green" />
                  <p className="font-bold text-lg">8 Images</p>
                  <p className="text-sm opacity-75">Visual content</p>
                  <div className="mt-2 text-xs">
                    <p>• High resolution</p>
                    <p>• Brand consistency</p>
                    <p>• Multiple formats</p>
                  </div>
                  {isGenerating && (
                    <div className="mt-2">
                      <div className="h-1 bg-terminal-black rounded overflow-hidden">
                        <div 
                          className="h-full bg-terminal-green transition-all duration-300"
                          style={{ width: `${(generationProgress.images / 8) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 text-center">{generationProgress.images}/8</p>
                    </div>
                  )}
                </div>
                <div className="bg-terminal-darkGreen p-4 rounded">
                  <FileText className="w-8 h-8 mb-2 text-terminal-green" />
                  <p className="font-bold text-lg">4 Blog Posts</p>
                  <p className="text-sm opacity-75">Written content</p>
                  <div className="mt-2 text-xs">
                    <p>• SEO optimized</p>
                    <p>• Engaging headlines</p>
                    <p>• Custom images</p>
                  </div>
                  {isGenerating && (
                    <div className="mt-2">
                      <div className="h-1 bg-terminal-black rounded overflow-hidden">
                        <div 
                          className="h-full bg-terminal-green transition-all duration-300"
                          style={{ width: `${(generationProgress.blogs / 4) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 text-center">{generationProgress.blogs}/4</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-terminal-green/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-75">Campaign Start Date</p>
                  <p className="font-bold">{format(new Date(), 'PPP')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">Total Monthly Cost</p>
                  <p className="font-bold text-xl">
                    ${SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.price}
                    {selectedCampaignManager.includes(selectedPlan) && (
                      <span> + $199</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={generateTestContent}
                  disabled={isGenerating}
                  className={cn(
                    "px-6 py-3 bg-terminal-green text-black rounded-lg font-bold",
                    "hover:bg-terminal-green/90 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isGenerating ? (
                    <span className="flex items-center space-x-2">
                      <ArrowLeft className="w-5 h-5 animate-spin" />
                      <span>Generating Content...</span>
                    </span>
                  ) : (
                    'Launch Campaign'
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="bg-terminal-black text-terminal-green p-3 md:p-6 rounded-lg max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={onClose}
            className="p-1 md:p-2 hover:bg-terminal-darkGreen rounded-full"
          >
            <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <h1 className="text-lg md:text-3xl font-bold">Launch AI Marketing Campaign</h1>
        </div>
        {step === 'plan' && (
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-1 md:space-x-2 px-2 py-1 md:px-4 md:py-2 bg-terminal-darkGreen rounded hover:bg-terminal-green/20 text-mobile-sm md:text-base"
          >
            <Eye className="w-3 h-3 md:w-4 md:h-4" />
            <span>Preview</span>
          </button>
        )}
      </div>

      <div className="flex justify-center mb-4 md:mb-8 overflow-x-auto pb-2">
        <div className="flex items-center space-x-2 md:space-x-4">
          {[
            { id: 'website', icon: Globe, label: 'Website' },
            { id: 'goals', icon: Target, label: 'Goals' },
            { id: 'business', icon: Briefcase, label: 'Business' },
            { id: 'plan', icon: Rocket, label: 'Launch' }
          ].map((s, index) => (
            <React.Fragment key={s.id}>
              <div
                className={cn(
                  "flex items-center space-x-1 md:space-x-2 p-1 md:p-2 rounded",
                  step === s.id ? "bg-terminal-darkGreen" : "opacity-50"
                )}
              >
                <div className={cn(
                  "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center",
                  step === s.id ? "bg-terminal-green text-black" : "bg-terminal-darkGreen"
                )}>
                  <s.icon className="w-3 h-3 md:w-4 md:h-4" />
                </div>
                <span className="text-mobile-xs md:text-sm">{s.label}</span>
              </div>
              {index < 3 && (
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-terminal-darkGreen p-6 rounded-lg">
        {step === 'website' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-4">Enter Your Website</h2>
            <div>
              <label className="block mb-2">Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-terminal-black text-terminal-green p-3 rounded"
              />
            </div>
            <button
              onClick={() => setStep('goals')}
              disabled={!websiteUrl}
              className={cn(
                "w-full p-3 rounded font-bold",
                websiteUrl
                  ? "bg-terminal-green text-black hover:bg-terminal-green/90"
                  : "bg-terminal-darkGreen/50 cursor-not-allowed"
              )}
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 'goals' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-4">Select Your Goals</h2>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map(goal => (
                <button
                  key={goal}
                  onClick={() => setGoals(g => 
                    g.includes(goal) ? g.filter(g => g !== goal) : [...g, goal]
                  )}
                  className={cn(
                    "p-3 rounded border-2 text-left",
                    goals.includes(goal)
                      ? "border-terminal-green bg-terminal-darkGreen"
                      : "border-terminal-green/50"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    {goals.includes(goal) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-terminal-green/50 rounded" />
                    )}
                    <span>{goal}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setStep('website')}
                className="flex-1 p-3 rounded border-2 border-terminal-green hover:bg-terminal-darkGreen"
              >
                Back
              </button>
              <button
                onClick={() => setStep('business')}
                disabled={goals.length === 0}
                className={cn(
                  "flex-1 p-3 rounded font-bold",
                  goals.length > 0
                    ? "bg-terminal-green text-black hover:bg-terminal-green/90"
                    : "bg-terminal-darkGreen/50 cursor-not-allowed"
                )}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 'business' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-4">Describe Your Business</h2>
            <div>
              <label className="block mb-2">Business Description</label>
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Tell us about your business..."
                className="w-full h-32 bg-terminal-black text-terminal-green p-3 rounded resize-none"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setStep('goals')}
                className="flex-1 p-3 rounded border-2 border-terminal-green hover:bg-terminal-darkGreen"
              >
                Back
              </button>
              <button
                onClick={() => setStep('plan')}
                disabled={!businessDescription}
                className={cn(
                  "flex-1 p-3 rounded font-bold",
                  businessDescription
                    ? "bg-terminal-green text-black hover:bg-terminal-green/90"
                    : "bg-terminal-darkGreen/50 cursor-not-allowed"
                )}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 'plan' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-xl font-bold mb-4">Choose Your Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "relative bg-terminal-black rounded-lg overflow-hidden",
                    "border-2",
                    selectedPlan === plan.id
                      ? "border-terminal-green"
                      : "border-terminal-green/30"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-terminal-green text-black px-3 py-1 text-sm">
                      Popular
                    </div>
                  )}
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm opacity-75 mb-4">{plan.description}</p>
                    <div className="mb-4 md:mb-6">
                      <span className="text-2xl md:text-3xl font-bold">${plan.price}</span>
                      <span className="text-sm opacity-75">/{plan.period}</span>
                    </div>
                    <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature.name} className="flex items-start space-x-2">
                          {feature.included ? (
                            <Check className="w-4 h-4 text-terminal-green mt-1" />
                          ) : (
                            <X className="w-4 h-4 text-red-500 mt-1" />
                          )}
                          <div>
                            <div className="text-sm font-bold">{feature.name}</div>
                            <div className="text-xs opacity-75">
                              {feature.description}
                              {feature.limit && ` (${feature.limit})`}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {plan.campaignManager && (
                      <div className="mb-4 md:mb-6 p-3 md:p-4 bg-terminal-darkGreen rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold">Campaign Manager</h4>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCampaignManager.includes(plan.id)}
                              onChange={(e) => {
                                setSelectedCampaignManager(prev => 
                                  e.target.checked 
                                    ? [...prev, plan.id]
                                    : prev.filter(id => id !== plan.id)
                                );
                              }}
                              className="w-4 h-4 rounded border-terminal-green"
                            />
                            <span className="text-xs md:text-sm text-terminal-green">
                              Add Campaign Manager (+$199/mo)
                            </span>
                          </label>
                        </div>
                        {selectedCampaignManager.includes(plan.id) && (
                          <ul className="mt-2 md:mt-3 space-y-1 md:space-y-2">
                            {plan.campaignManager.features.map((feature, index) => (
                              <li key={index} className="text-xs flex items-center space-x-1">
                                <Check className="w-3 h-3 text-terminal-green" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setShowPreview(true);
                      }}
                      className={cn(
                        "w-full p-2 md:p-3 rounded font-bold",
                        selectedPlan === plan.id
                          ? "bg-terminal-green text-black"
                          : "bg-terminal-darkGreen hover:bg-terminal-darkGreen/70"
                      )}
                    >
                      {plan.buttonText}
                      {selectedCampaignManager.includes(plan.id) && (
                        <span className="block text-xs mt-1">
                          Total: ${plan.price + 199}/mo
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep('business')}
                className="flex-1 p-3 rounded border-2 border-terminal-green hover:bg-terminal-darkGreen"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showPreview && renderPreview()}
        {showCampaignManager && (
          <CampaignManagerModal
            type={showCampaignManager}
            onClose={() => setShowCampaignManager(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}