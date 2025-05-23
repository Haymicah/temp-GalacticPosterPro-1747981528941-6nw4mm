import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-terminal-darkGreen border-b border-terminal-green/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-terminal-green">ZigiAI</h1>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-terminal-black/20 rounded-full">
            <Bell className="w-5 h-5" />
          </button>
          
          <button className="p-2 hover:bg-terminal-black/20 rounded-full">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm">{user?.email}</span>
            <div className="w-8 h-8 bg-terminal-green rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-terminal-black" />
            </div>
          </div>
          
          <button 
            onClick={() => signOut()}
            className="p-2 hover:bg-terminal-black/20 rounded-full"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}