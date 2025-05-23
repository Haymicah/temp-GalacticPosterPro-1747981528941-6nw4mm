import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

export function ScheduleCalendar() {
  const scheduledPosts = [
    { time: '09:00', title: 'Product Launch Video', platform: 'YouTube' },
    { time: '11:30', title: 'Blog Post: AI Trends', platform: 'Medium' },
    { time: '14:00', title: 'Social Media Images', platform: 'Instagram' }
  ];

  return (
    <div className="bg-terminal-darkGreen rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Today's Schedule</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>{format(new Date(), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      <div className="space-y-4">
        {scheduledPosts.map((post, index) => (
          <div key={index} className="bg-terminal-black p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{post.time}</span>
              </div>
              <span className="text-sm bg-terminal-green/20 px-2 py-1 rounded">
                {post.platform}
              </span>
            </div>
            <div className="text-sm">{post.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}