import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  return (
    <div className="min-h-screen bg-terminal-black text-terminal-green flex items-center justify-center">
      <div className="w-full max-w-md bg-terminal-darkGreen p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Update Password</h1>

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-500 p-3 rounded mb-4">
            Password updated successfully! Redirecting to login...
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-terminal-black p-2 rounded"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-terminal-black p-2 rounded"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-terminal-green text-black rounded font-bold hover:bg-terminal-green/90"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}