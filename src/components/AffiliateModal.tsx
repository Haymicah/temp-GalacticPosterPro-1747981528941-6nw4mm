import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Copy, Check, DollarSign, Users, 
  MousePointer, ArrowUpRight, RefreshCw,
  Rocket, Gift, Star, TrendingUp, Coins
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { PlatformConnect } from './PlatformConnect';

interface AffiliateModalProps {
  onClose: () => void;
  onShowCampaign?: () => void;
}

export function AffiliateModal({ onClose, onShowCampaign }: AffiliateModalProps) {
  const [copied, setCopied] = useState(false);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [showPaypalInput, setShowPaypalInput] = useState(false);
  const [showPlatformConnect, setShowPlatformConnect] = useState(false);

  // Generate unique referral code and stats for each user
  const { generateAffiliateCode, getAffiliateStats } = useStore();
  const affiliateStats = getAffiliateStats();
  
  // Static affiliate data with dynamic stats
  const affiliateData = {
    referralCode: affiliateStats?.referralCode || generateAffiliateCode(),
    referralLink: `https://zigiai.com/signup?ref=${affiliateStats?.referralCode || generateAffiliateCode()}`,
    stats: {
      clicks: affiliateStats?.clicks || 0,
      signups: affiliateStats?.signups || 0,
      earnings: affiliateStats?.earnings || 0,
      pendingEarnings: affiliateStats?.earnings || 0,
      lastPayout: affiliateStats?.lastPayout || null
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = async () => {
    if (!paypalEmail) {
      setShowPaypalInput(true);
      return;
    }

    setIsProcessingPayout(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowPaypalInput(false);
      onClose();
    } catch (error) {
      console.error('Error processing payout:', error);
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const handleLaunchCampaign = () => {
    // Store campaign data with affiliate info
    localStorage.setItem('campaignData', JSON.stringify({
      websiteUrl: 'https://zigiai.com',
      goals: [
        'Increase brand awareness',
        'Drive website traffic',
        'Generate leads',
        'Boost social media presence',
        'Expand market reach'
      ],
      businessDescription: 'ZigiAI - Create and schedule content on over 60 social media platforms with one click automatically using AI. Generate images, videos, and press releases instantly. Try now at zigiai.com',
      selectedPlan: 'personal',
      selectedCampaignManager: ['personal'], // Enable campaign manager by default for affiliate campaigns
      isAffiliateCampaign: true,
      affiliateCode: affiliateData.referralCode,
      affiliateLink: affiliateData.referralLink,
      defaultPrompt: 'Transform your social media presence with ZigiAI - The ultimate AI-powered content creation and scheduling platform. Create stunning visuals, engaging videos, and professional content for 60+ platforms in seconds. Try now at zigiai.com',
      contentTypes: ['video', 'image', 'blog'],
      platforms: [
        'facebook', 'twitter', 'instagram', 'linkedin', 'youtube',
        'tiktok', 'pinterest', 'medium', 'wordpress_com', 'telegram',
        'reddit', 'tumblr', 'mastodon', 'threads'
      ]
    }));

    // Close affiliate modal and show campaign
    onClose();
    if (onShowCampaign) {
      onShowCampaign();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative z-50 bg-terminal-black w-full max-w-2xl rounded-lg overflow-hidden"
      >
        <div className="p-4 border-b border-terminal-green/20 flex items-center justify-between">
          <h2 className="text-xl font-bold">Affiliate Program</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-terminal-darkGreen rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Gift className="w-6 h-6 text-terminal-green" />
              <h3 className="text-lg font-bold">Special Promotion!</h3>
            </div>
            <p className="text-sm mb-2">
              Get <span className="text-terminal-green font-bold">3 days of premium access FREE</span> by promoting ZigiAI! 
            </p>
            <div className="space-y-2 text-sm opacity-75">
              <p>• Connect your social accounts</p>
              <p>• Share our ready-made content</p>
              <p>• Earn unlimited commissions</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-terminal-darkGreen p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MousePointer className="w-4 h-4" />
                <span className="text-sm opacity-75">Total Clicks</span>
              </div>
              <div className="text-2xl font-bold">{affiliateData.stats.clicks}</div>
            </div>
            <div className="bg-terminal-darkGreen p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm opacity-75">Signups</span>
              </div>
              <div className="text-2xl font-bold">{affiliateData.stats.signups}</div>
            </div>
            <div className="bg-terminal-darkGreen p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm opacity-75">Total Earnings</span>
              </div>
              <div className="text-2xl font-bold">${affiliateData.stats.earnings.toFixed(2)}</div>
            </div>
          </div>

          <div className="bg-terminal-darkGreen p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm mb-2">Your Referral Code</label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-terminal-black p-2 rounded font-mono">
                  {affiliateData.referralCode}
                </code>
                <button
                  onClick={() => handleCopy(affiliateData.referralCode)}
                  className="p-2 hover:bg-terminal-black rounded"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Referral Link</label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-terminal-black p-2 rounded font-mono text-xs">
                  {affiliateData.referralLink}
                </code>
                <button
                  onClick={() => handleCopy(affiliateData.referralLink)}
                  className="p-2 hover:bg-terminal-black rounded"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">Pending Earnings</h3>
                <p className="text-sm opacity-75">Available for withdrawal</p>
              </div>
              <div className="text-2xl font-bold">${affiliateData.stats.pendingEarnings.toFixed(2)}</div>
            </div>

            {showPaypalInput ? (
              <div className="space-y-2">
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="Enter your PayPal email"
                  className="w-full bg-terminal-black text-terminal-green p-2 rounded"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowPaypalInput(false)}
                    className="px-4 py-2 hover:bg-terminal-black rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={!paypalEmail || isProcessingPayout}
                    className={cn(
                      "px-4 py-2 bg-terminal-green text-black rounded font-bold",
                      "hover:bg-terminal-green/90",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isProcessingPayout ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'Confirm'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handlePayment}
                disabled={affiliateData.stats.pendingEarnings < 50}
                className={cn(
                  "w-full p-3 rounded font-bold",
                  affiliateData.stats.pendingEarnings >= 50
                    ? "bg-terminal-green text-black hover:bg-terminal-green/90"
                    : "bg-terminal-darkGreen/50 cursor-not-allowed"
                )}
              >
                {affiliateData.stats.pendingEarnings >= 50
                  ? 'Withdraw to PayPal'
                  : `$50 minimum required (${(50 - affiliateData.stats.pendingEarnings).toFixed(2)} more needed)`}
              </button>
            )}
          </div>

          <div className="bg-terminal-darkGreen p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">Marketing Campaign</h3>
                <p className="text-sm opacity-75">Promote ZigiAI effectively</p>
              </div>
              <button
                onClick={handleLaunchCampaign}
                className="px-4 py-2 bg-terminal-green text-black rounded font-bold hover:bg-terminal-green/90 flex items-center space-x-2"
              >
                <Rocket className="w-4 h-4" />
                <span>Launch Campaign</span>
              </button>
            </div>
            <div className="text-sm opacity-75">
              <p>• AI-powered campaign creation for ZigiAI</p>
              <p>• Ready-to-share content across 60+ platforms</p>
              <p>• Performance tracking and analytics</p>
              <p>• Professional marketing materials included</p>
            </div>
          </div>

          <div className="text-sm opacity-75">
            <p className="font-bold text-terminal-green">Earn unlimited subscription commissions!</p>
            <p>Get 25% recurring commission for every user who signs up using your referral link.</p>
            <p>Minimum payout threshold: $50</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPlatformConnect && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center"
          >
            <div className="fixed inset-0 bg-black/80" onClick={() => setShowPlatformConnect(false)} />
            <div className="relative bg-terminal-black w-full max-w-4xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Connect Your Social Media Accounts</h2>
                <button
                  onClick={() => setShowPlatformConnect(false)}
                  className="p-2 hover:bg-terminal-darkGreen rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <PlatformConnect
                onConnect={(platform) => {
                  console.log('Connected platform:', platform);
                  // Handle platform connection
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}