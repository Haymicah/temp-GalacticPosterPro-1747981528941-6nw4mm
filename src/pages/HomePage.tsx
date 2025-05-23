import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-terminal-black text-terminal-green flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ZigiAI</h1>
        <p className="mb-8">AI-Powered Content Creation & Automation</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-terminal-green text-black rounded-lg font-bold hover:bg-terminal-green/90"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}