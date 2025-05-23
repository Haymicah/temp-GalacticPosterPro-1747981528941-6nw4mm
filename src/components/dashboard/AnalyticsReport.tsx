import React from 'react';
import { BarChart, TrendingUp, Users, Eye } from 'lucide-react';

export function AnalyticsReport() {
  const metrics = [
    { icon: Eye, label: 'Views', value: '12.5K', trend: '+15%' },
    { icon: Users, label: 'Engagement', value: '2.4K', trend: '+24%' },
    { icon: TrendingUp, label: 'Growth', value: '32%', trend: '+8%' }
  ];

  return (
    <div className="bg-terminal-darkGreen rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Analytics Overview</h2>
        <BarChart className="w-5 h-5" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-terminal-black p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <metric.icon className="w-4 h-4" />
              <span className="text-sm">{metric.label}</span>
            </div>
            <div className="text-xl font-bold">{metric.value}</div>
            <div className="text-sm text-green-500">{metric.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}