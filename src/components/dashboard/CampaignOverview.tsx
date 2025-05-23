import React from 'react';
import { Video, Image, FileText, ArrowUp } from 'lucide-react';

export function CampaignOverview() {
  const stats = [
    { icon: Video, label: 'Videos', count: 12, trend: '+24%' },
    { icon: Image, label: 'Images', count: 45, trend: '+15%' },
    { icon: FileText, label: 'Blog Posts', count: 8, trend: '+32%' }
  ];

  return (
    <div className="bg-terminal-darkGreen rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Campaign Overview</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-terminal-black p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5" />
              <div className="flex items-center text-green-500 text-sm">
                <ArrowUp className="w-3 h-3 mr-1" />
                {stat.trend}
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.count}</div>
            <div className="text-sm opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}