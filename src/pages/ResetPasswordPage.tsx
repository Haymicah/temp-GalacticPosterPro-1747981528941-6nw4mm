import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;
      setMessage('Check your email for password reset instructions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-terminal-black text-terminal-green flex items-center justify-center">
      <div className="w-full max-w-md bg-terminal-darkGreen p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        {message && (
          <div className="bg-green-500/20 border border-green-500 text-green-500 p-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-terminal-black p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-terminal-green text-black rounded font-bold hover:bg-terminal-green/90"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}