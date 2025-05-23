import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Video, Image, FileText, 
  Calendar, BarChart, Settings,
  Rocket
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const links = [
    { to: '/dashboard', icon: Home, label: 'Overview' },
    { to: '/dashboard/video-generator', icon: Video, label: 'Video Generator' },
    { to: '/dashboard/image-generator', icon: Image, label: 'Image Generator' },
    { to: '/dashboard/blog-generator', icon: FileText, label: 'Blog Generator' },
    { to: '/dashboard/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/dashboard/campaigns', icon: Rocket, label: 'Campaigns' },
    { to: '/dashboard/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="w-64 bg-terminal-darkGreen min-h-screen border-r border-terminal-green/20 p-4">
      <nav className="space-y-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn(
              "flex items-center space-x-3 px-4 py-2 rounded-lg",
              "hover:bg-terminal-black/20 transition-colors",
              isActive && "bg-terminal-black/20"
            )}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}