import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, Check, Users, Globe, Calendar, 
  Settings, BarChart3, MessageSquare,
  Shield, Bot, User, Rocket
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CampaignManagerModalProps {
  onClose: () => void;
  type: 'ai' | 'human';
}

export function CampaignManagerModal({ onClose, type }: CampaignManagerModalProps) {
  const features = {
    ai: [
      {
        icon: Bot,
        title: 'AI-Powered Account Management',
        description: 'Our AI system automatically creates and manages your social media accounts across all major platforms.'
      },
      {
        icon: Calendar,
        title: 'Smart Content Scheduling',
        description: 'Optimal posting times are calculated based on your audience engagement patterns.'
      },
      {
        icon: Globe,
        title: 'Multi-Platform Management',
        description: 'Seamlessly manage content across Facebook, Twitter, Instagram, LinkedIn, and more.'
      },
      {
        icon: Settings,
        title: 'Automated Optimization',
        description: "Content is automatically optimized for each platform's requirements and best practices."
      }
    ],
    human: [
      {
        icon: User,
        title: 'Dedicated Account Manager',
        description: 'Your personal campaign manager handles everything from strategy to execution.'
      },
      {
        icon: Users,
        title: 'Full Account Setup',
        description: 'We create and optimize all your social media accounts from scratch.'
      },
      {
        icon: MessageSquare,
        title: 'Engagement Management',
        description: 'Professional response handling and community management across all platforms.'
      },
      {
        icon: Shield,
        title: 'Brand Protection',
        description: 'Proactive monitoring and crisis management to protect your brand reputation.'
      }
    ]
  };

  const benefits = {
    ai: [
      'Zero effort required from your side',
      'Consistent posting schedule 24/7',
      'Data-driven content optimization',
      'Automated performance tracking'
    ],
    human: [
      'Personalized content strategy',
      'Expert industry insights',
      'Priority support access',
      'Custom reporting and analytics'
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-terminal-black w-full max-w-4xl rounded-lg overflow-hidden"
      >
        <div className="p-6 border-b border-terminal-green/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center space-x-3">
              {type === 'ai' ? (
                <>
                  <Bot className="w-8 h-8 text-terminal-green" />
                  <span>AI Campaign Manager</span>
                </>
              ) : (
                <>
                  <User className="w-8 h-8 text-terminal-green" />
                  <span>Personal Campaign Manager</span>
                </>
              )}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-terminal-darkGreen rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Rocket className="w-6 h-6 text-terminal-green" />
              <span>Let Us Handle Everything</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold mb-4">What We Do</h4>
                <div className="space-y-4">
                  {features[type].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-terminal-darkGreen rounded-lg">
                        <feature.icon className="w-5 h-5 text-terminal-green" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm">{feature.title}</h5>
                        <p className="text-sm opacity-75">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4">Key Benefits</h4>
                <div className="bg-terminal-darkGreen p-4 rounded-lg">
                  <ul className="space-y-3">
                    {benefits[type].map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-terminal-green" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-6 border-t border-terminal-green/20">
                    <h5 className="font-bold text-sm mb-2">Getting Started</h5>
                    <p className="text-sm opacity-75">
                      {type === 'ai' 
                        ? "Our AI system will start managing your social media presence immediately after subscription. Just provide your brand guidelines, and we'll handle the rest."
                        : 'Your dedicated campaign manager will contact you within 24 hours of subscription to discuss your goals and develop a custom strategy.'}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-bold mb-4">Performance Tracking</h4>
                  <div className="bg-terminal-darkGreen p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <BarChart3 className="w-5 h-5 text-terminal-green mt-1" />
                      <div>
                        <h5 className="font-bold text-sm">Real-time Analytics</h5>
                        <p className="text-sm opacity-75">
                          {type === 'ai'
                            ? 'Track your social media performance with automated daily reports and AI-powered insights.'
                            : 'Get detailed weekly reports and strategic recommendations from your campaign manager.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-terminal-green text-black rounded-lg font-bold hover:bg-terminal-green/90"
            >
              Got It
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}