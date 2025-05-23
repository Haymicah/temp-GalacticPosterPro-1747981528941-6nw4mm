import React from 'react';
import { Video, Image, FileText } from 'lucide-react';

export function RecentContent() {
  const recentContent = [
    { type: 'video', title: 'Product Demo', platform: 'YouTube', time: '2h ago' },
    { type: 'image', title: 'Brand Assets', platform: 'Instagram', time: '4h ago' },
    { type: 'blog', title: 'Tech Trends', platform: 'Medium', time: '6h ago' }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'image': return Image;
      case 'blog': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="bg-terminal-darkGreen rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Recent Content</h2>

      <div className="space-y-4">
        {recentContent.map((content, index) => {
          const Icon = getIcon(content.type);
          return (
            <div key={index} className="bg-terminal-black p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="capitalize">{content.type}</span>
                </div>
                <span className="text-sm opacity-75">{content.time}</span>
              </div>
              <div className="text-sm font-bold mb-1">{content.title}</div>
              <div className="text-xs bg-terminal-green/20 inline-block px-2 py-1 rounded">
                {content.platform}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}