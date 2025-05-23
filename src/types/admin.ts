import { User } from '@supabase/supabase-js';

export interface AdminUser extends User {
  role: 'admin' | 'user' | 'viewer';
  subscription_tier: string;
  subscription_status: string;
  settings: Record<string, any>;
  metadata: Record<string, any>;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'incoming' | 'outgoing' | 'subscription' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  type: string;
  prediction: Record<string, any>;
  confidence: number;
  status: 'active' | 'expired' | 'fulfilled';
  created_at: string;
  valid_until: string;
  metadata: Record<string, any>;
}

export interface NetworkStats {
  id: string;
  metric_name: string;
  metric_value: number;
  difficulty: number;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
  metadata: Record<string, any>;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  details: Record<string, any>;
  ip_address: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
  read_at: string | null;
}

export interface Report {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: Record<string, any>;
  status: 'draft' | 'published';
  created_at: string;
  published_at: string | null;
  metadata: Record<string, any>;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  networkDifficulty: number;
  networkStatus: 'normal' | 'warning' | 'critical';
  predictions: Prediction[];
  recentTransactions: Transaction[];
  notifications: Notification[];
}

export interface NetworkMetrics {
  difficulty: number;
  hashrate: number;
  activeNodes: number;
  blockTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  errorRate: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  churnRate: number;
  userGrowth: number;
  subscriptionTiers: Record<string, number>;
}

export interface FinancialMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  averageOrderValue: number;
  revenueGrowth: number;
  transactionVolume: number;
  refundRate: number;
  subscriptionRevenue: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  lastIncident: string | null;
  services: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    latency: number;
  }[];
}