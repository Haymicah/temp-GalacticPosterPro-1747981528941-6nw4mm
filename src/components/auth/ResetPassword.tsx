import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://zigiai.com/update-password',
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terminal-black text-terminal-green p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-terminal-darkGreen p-6 rounded-lg"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 mb-6 hover:text-terminal-green/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </button>

        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-terminal-black rounded-lg flex items-center space-x-2"
          >
            <Check className="w-5 h-5 text-terminal-green" />
            <div>
              <p className="font-bold">Check your email</p>
              <p className="text-sm opacity-75">
                We've sent you a password reset link. Please check your inbox.
              </p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded bg-red-500/20 border border-red-500 text-red-500 flex items-center space-x-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full bg-terminal-black pl-10 pr-4 py-2 rounded",
                    "border border-terminal-green focus:ring-2 focus:ring-terminal-green"
                  )}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-2 rounded font-bold",
                "bg-terminal-green text-black",
                "hover:bg-terminal-green/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}