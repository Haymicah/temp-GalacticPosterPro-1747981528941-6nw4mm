import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen bg-terminal-black text-terminal-green flex items-center justify-center">
      <div className="w-full max-w-md bg-terminal-darkGreen p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        
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

          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-terminal-black p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-terminal-green text-black rounded font-bold hover:bg-terminal-green/90"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/reset-password')}
            className="text-sm hover:underline"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}