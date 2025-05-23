import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.user) {
        // Check if user is admin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        // Navigate based on role
        if (userData?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }

        onSuccess?.();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
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
          <label htmlFor="email" className="block text-sm mb-2">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "w-full bg-terminal-darkGreen pl-10 pr-4 py-2 rounded",
                "border border-terminal-green focus:ring-2 focus:ring-terminal-green"
              )}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full bg-terminal-darkGreen pl-10 pr-4 py-2 rounded",
                "border border-terminal-green focus:ring-2 focus:ring-terminal-green"
              )}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
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
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => navigate('/reset-password')}
            className="text-sm opacity-75 hover:opacity-100"
          >
            Forgot your password?
          </button>
          <div className="text-sm opacity-75">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-terminal-green hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}