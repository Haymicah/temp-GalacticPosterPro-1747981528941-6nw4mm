import React from 'react';
import { CampaignOverview } from '../components/dashboard/CampaignOverview';
import { ScheduleCalendar } from '../components/dashboard/ScheduleCalendar';
import { AnalyticsReport } from '../components/dashboard/AnalyticsReport';
import { RecentContent } from '../components/dashboard/RecentContent';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-terminal-green">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignOverview />
        <ScheduleCalendar />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsReport />
        <RecentContent />
      </div>
    </div>
  );
}