import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Users, DollarSign, Activity,
  AlertTriangle, CheckCircle, XCircle, Clock,
  Cpu, Server, Database, Network
} from 'lucide-react';
import { NetworkMetrics, DashboardMetrics } from '../../types/admin';
import { fetchDashboardMetrics, fetchNetworkMetrics } from '../../lib/admin';
import { NetworkSpeedometer } from './NetworkSpeedometer';
import { MetricsGrid } from './MetricsGrid';
import { TransactionsList } from './TransactionsList';
import { NotificationCenter } from './NotificationCenter';
import { PredictionsList } from './PredictionsList';
import { SystemStatus } from './SystemStatus';
import { AffiliateManagement } from './AffiliateManagement';
import { cn } from '../../lib/utils';

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'network' | 'users' | 'finance' | 'affiliates'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardMetrics, networkStats] = await Promise.all([
          fetchDashboardMetrics(),
          fetchNetworkMetrics()
        ]);
        setMetrics(dashboardMetrics);
        setNetworkMetrics(networkStats);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-terminal-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-black text-terminal-green p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <SystemStatus />
            <NotificationCenter notifications={metrics?.notifications || []} />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'network', label: 'Network', icon: Activity },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'finance', label: 'Finance', icon: DollarSign },
            { id: 'affiliates', label: 'Affiliates', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg",
                "border-2 border-terminal-green",
                activeTab === tab.id
                  ? "bg-terminal-green text-black"
                  : "hover:bg-terminal-darkGreen"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        {activeTab === 'affiliates' ? (
          <AffiliateManagement />
        ) : (
          <>
            {/* Network Status Banner */}
            {networkMetrics && (
              <div className={cn(
                "p-4 rounded-lg mb-8",
                networkMetrics.status === 'normal' && "bg-green-900/20 border-2 border-green-500",
                networkMetrics.status === 'warning' && "bg-yellow-900/20 border-2 border-yellow-500",
                networkMetrics.status === 'critical' && "bg-red-900/20 border-2 border-red-500"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {networkMetrics.status === 'normal' && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {networkMetrics.status === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-500" />}
                    {networkMetrics.status === 'critical' && <XCircle className="w-6 h-6 text-red-500" />}
                    <div>
                      <h3 className="font-bold">Network Status: {networkMetrics.status.toUpperCase()}</h3>
                      <p className="text-sm opacity-75">
                        Current difficulty: {networkMetrics.difficulty.toFixed(2)} | 
                        Active nodes: {networkMetrics.activeNodes} | 
                        Network latency: {networkMetrics.networkLatency}ms
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm opacity-75">Last updated</div>
                      <div className="font-mono">
                        <Clock className="w-4 h-4 inline-block mr-1" />
                        {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Content */}
            <div className="grid grid-cols-12 gap-6">
              {/* Network Speedometer */}
              <div className="col-span-4 bg-terminal-darkGreen p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Network Difficulty</h3>
                <NetworkSpeedometer
                  value={networkMetrics?.difficulty || 0}
                  maxValue={100}
                  size={300}
                />
              </div>

              {/* System Metrics */}
              <div className="col-span-8 grid grid-cols-4 gap-4">
                <MetricsCard
                  title="CPU Usage"
                  value={`${networkMetrics?.cpuUsage.toFixed(1)}%`}
                  icon={Cpu}
                  trend="up"
                  trendValue={2.5}
                />
                <MetricsCard
                  title="Memory Usage"
                  value={`${networkMetrics?.memoryUsage.toFixed(1)}%`}
                  icon={Server}
                  trend="down"
                  trendValue={1.2}
                />
                <MetricsCard
                  title="Network Latency"
                  value={`${networkMetrics?.networkLatency}ms`}
                  icon={Network}
                  trend="up"
                  trendValue={5.7}
                />
                <MetricsCard
                  title="Error Rate"
                  value={`${networkMetrics?.errorRate.toFixed(2)}%`}
                  icon={AlertTriangle}
                  trend="down"
                  trendValue={0.5}
                />
              </div>

              {/* Recent Transactions */}
              <div className="col-span-6 bg-terminal-darkGreen p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
                <TransactionsList transactions={metrics?.recentTransactions || []} />
              </div>

              {/* AI Predictions */}
              <div className="col-span-6 bg-terminal-darkGreen p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">AI Predictions</h3>
                <PredictionsList predictions={metrics?.predictions || []} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface MetricsCardProps {
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  trend: 'up' | 'down';
  trendValue: number;
}

function MetricsCard({ title, value, icon: Icon, trend, trendValue }: MetricsCardProps) {
  return (
    <div className="bg-terminal-darkGreen p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
        <div className={cn(
          "text-xs px-2 py-1 rounded",
          trend === 'up' ? "bg-green-900/20 text-green-500" : "bg-red-900/20 text-red-500"
        )}>
          {trend === 'up' ? '+' : '-'}{trendValue}%
        </div>
      </div>
      <h4 className="text-sm opacity-75">{title}</h4>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}