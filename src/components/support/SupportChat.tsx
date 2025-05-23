import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Send, Bot, User, AlertTriangle,
  Mail, MessageSquare, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { generateContent } from '../../lib/openai';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

interface SupportChatProps {
  onClose: () => void;
}

export function SupportChat({ onClose }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'system',
      content: 'Welcome to AI Support! How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'normal' as 'low' | 'normal' | 'high'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await generateContent('post', input, {
        creativity: 0.7,
        tone: 'helpful'
      });

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again or contact support.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContactSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate sending email to support
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'system',
        content: 'Your message has been sent to our support team. We\'ll get back to you soon!',
        timestamp: new Date()
      }]);

      setShowContactForm(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'system',
        content: 'Error sending message. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-terminal-black w-full max-w-2xl rounded-lg overflow-hidden"
      >
        <div className="p-4 border-b border-terminal-green/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-terminal-green" />
            <h2 className="text-xl font-bold">AI Support</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-terminal-darkGreen rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  "flex space-x-2",
                  message.type === 'user' && "justify-end"
                )}
              >
                {message.type !== 'user' && (
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    message.type === 'ai' ? "bg-terminal-green" : "bg-terminal-darkGreen"
                  )}>
                    {message.type === 'ai' ? (
                      <Bot className="w-4 h-4 text-black" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.type === 'user' && "bg-terminal-green text-black",
                  message.type === 'ai' && "bg-terminal-darkGreen",
                  message.type === 'system' && "bg-terminal-black border border-terminal-green/20"
                )}>
                  <p className="text-sm">{message.content}</p>
                  <div className="text-[10px] opacity-75 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-terminal-green flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {showContactForm ? (
            <form onSubmit={handleContactSupport} className="p-4 border-t border-terminal-green/20">
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-terminal-darkGreen border border-terminal-green rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full h-32 bg-terminal-darkGreen border border-terminal-green rounded p-2 resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Priority</label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full bg-terminal-darkGreen border border-terminal-green rounded p-2"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-terminal-green rounded hover:bg-terminal-darkGreen"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-terminal-green text-black rounded font-bold hover:bg-terminal-green/90 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 border-t border-terminal-green/20">
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="px-4 py-2 border border-terminal-green rounded hover:bg-terminal-darkGreen flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Support</span>
                </button>
                <form onSubmit={handleSubmit} className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-terminal-darkGreen border border-terminal-green rounded px-4"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isProcessing}
                    className="px-4 py-2 bg-terminal-green text-black rounded font-bold hover:bg-terminal-green/90 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}