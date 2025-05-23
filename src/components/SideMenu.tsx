import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  User, History, LogOut, LogIn, 
  UserPlus, Settings, ChevronLeft,
  Video, Image, FileText, Rocket,
  CreditCard, Shield, FileQuestion,
  Scale, BookOpen, Heart, X, Check,
  Users, MessageSquare, HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { LegalModal } from './legal/LegalModal';
import { SubscriptionPlan } from '../types/subscription';
import { AffiliateModal } from './AffiliateModal';
import { SupportChat } from './support/SupportChat';
import { SUBSCRIPTION_PLANS } from '../types/subscription';

const legalPages = [
  { id: 'terms', title: 'Terms of Service', icon: Scale },
  { id: 'privacy', title: 'Privacy Policy', icon: Shield },
  { id: 'disclaimer', title: 'Disclaimer', icon: FileQuestion },
  { id: 'cookie', title: 'Cookie Policy', icon: BookOpen },
  { id: 'acceptable-use', title: 'Acceptable Use', icon: FileQuestion }
];

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
  onSignOut: () => void;
}

function SubscriptionPlansModal({ 
  onClose, 
  selectedPlan, 
  setSelectedPlan 
}: { 
  onClose: () => void;
  selectedPlan: string | null;
  setSelectedPlan: (plan: string | null) => void;
}) {
  const [selectedCampaignManager, setSelectedCampaignManager] = useState<string[]>([]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-terminal-black p-6 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Subscription Plans</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-terminal-darkGreen rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
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
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm opacity-75 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-sm opacity-75">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
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
                  <div className="mb-6 p-4 bg-terminal-darkGreen rounded-lg">
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
                        <span className="text-sm text-terminal-green">
                          {plan.campaignManager.description}
                        </span>
                      </label>
                    </div>
                    {selectedCampaignManager.includes(plan.id) && (
                      <ul className="mt-3 space-y-2">
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
                    // Handle subscription with campaign manager if selected
                    const withCampaignManager = selectedCampaignManager.includes(plan.id);
                    const totalPrice = plan.price + (withCampaignManager ? 199 : 0);
                    console.log(`Selected plan: ${plan.id}, Total price: $${totalPrice}`);
                  }}
                  className={cn(
                    "w-full p-3 rounded font-bold",
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
      </motion.div>
    </motion.div>
  );
}

export function SideMenu({ isOpen, onClose, user, onSignOut }: SideMenuProps) {
  const [showPlans, setShowPlans] = useState(false);
  const [showAffiliate, setShowAffiliate] = useState(false);
  const [activeLegalPage, setActiveLegalPage] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const { getGroupedHistory, retrieveHistoryPrompt } = useStore();
  const groupedHistory = getGroupedHistory();

  const handlePromptClick = (prompt: any) => {
    retrieveHistoryPrompt(prompt);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
        />
      )}

      {/* Side Menu */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed top-0 left-0 h-full w-80 bg-terminal-black border-r-2 border-terminal-green z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-terminal-green">
          <h2 className="text-xl font-bold text-terminal-green">Dashboard</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-terminal-darkGreen rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {user ? (
            <>
              <div className="flex items-center space-x-4 m-4 p-4 bg-terminal-darkGreen rounded-lg">
                <div className="w-12 h-12 rounded-full bg-terminal-green flex items-center justify-center">
                  <User className="w-6 h-6 text-terminal-black" />
                </div>
                <div>
                  <div className="font-bold">{user.email}</div>
                  <div className="text-sm opacity-75">Pro User</div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <button
                  onClick={() => setShowPlans(true)}
                  className="w-full flex items-center space-x-2 p-3 hover:bg-terminal-darkGreen rounded text-terminal-green"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Subscription Plans</span>
                </button>

                <button
                  onClick={() => setShowAffiliate(true)}
                  className="w-full flex items-center space-x-2 p-3 hover:bg-terminal-darkGreen rounded text-terminal-green"
                >
                  <Users className="w-5 h-5" />
                  <span>Affiliate Program</span>
                </button>

                <button
                  onClick={() => setShowSupport(true)}
                  className="w-full flex items-center space-x-2 p-3 hover:bg-terminal-darkGreen rounded text-terminal-green"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>Support & Help</span>
                </button>

                <div className="border-t-2 border-terminal-green/20 my-4" />

                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Prompt History
                </h3>
                <div className="space-y-6">
                  {groupedHistory.map(group => (
                    <div key={group.date}>
                      <h4 className="text-sm opacity-75 mb-2">
                        {format(new Date(group.date), 'MMMM d, yyyy')}
                      </h4>
                      <div className="space-y-2">
                        {group.prompts.map(prompt => {
                          const Icon = prompt.type === 'video' ? Video :
                                     prompt.type === 'image' ? Image :
                                     prompt.type === 'blog' ? FileText : Rocket;
                          return (
                            <motion.div
                              key={prompt.id}
                              className="p-3 rounded bg-terminal-darkGreen/50 hover:bg-terminal-darkGreen cursor-pointer transition-colors"
                              onClick={() => handlePromptClick(prompt)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <Icon className="w-4 h-4" />
                                <span className="text-sm capitalize">{prompt.type}</span>
                                <span className="text-xs opacity-75 ml-auto">
                                  {format(new Date(prompt.timestamp), 'HH:mm')}
                                </span>
                              </div>
                              <p className="text-sm line-clamp-2">{prompt.prompt}</p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-terminal-green/20 my-4" />

                <div className="space-y-2">
                  {legalPages.map(page => (
                    <button
                      key={page.id}
                      onClick={() => setActiveLegalPage(page.id)}
                      className="w-full flex items-center space-x-2 p-3 hover:bg-terminal-darkGreen rounded text-terminal-green"
                    >
                      <page.icon className="w-5 h-5" />
                      <span>{page.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 space-y-4">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#00FF00',
                        brandAccent: '#004400',
                      },
                    },
                  },
                }}
                providers={[]}
                theme="dark"
              />
            </div>
          )}
        </div>

        {user && (
          <div className="p-4 border-t-2 border-terminal-green">
            <button 
              onClick={onSignOut}
              className="w-full flex items-center justify-center space-x-2 p-3 hover:bg-terminal-darkGreen rounded text-red-500"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showPlans && (
          <SubscriptionPlansModal
            onClose={() => setShowPlans(false)}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />
        )}
        {showAffiliate && (
          <AffiliateModal onClose={() => setShowAffiliate(false)} />
        )}
        {activeLegalPage && (
          <LegalModal
            pageId={activeLegalPage}
            onClose={() => setActiveLegalPage(null)}
          />
        )}
        {showSupport && (
          <SupportChat onClose={() => setShowSupport(false)} />
        )}
      </AnimatePresence>
    </>
  );
}