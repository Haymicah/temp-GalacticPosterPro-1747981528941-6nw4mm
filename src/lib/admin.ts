import { supabase } from './supabase';
import {
  AdminUser,
  Transaction,
  Prediction,
  NetworkStats,
  AdminLog,
  Notification,
  Report,
  DashboardMetrics,
  NetworkMetrics,
  UserMetrics,
  FinancialMetrics,
  SystemHealth
} from '../types/admin';

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const { data: users } = await supabase
    .from('users')
    .select('subscription_status')
    .eq('subscription_status', 'active');

  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const { data: networkStats } = await supabase
    .from('network_stats')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('status', 'unread')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    totalUsers: users?.length || 0,
    activeUsers: users?.filter(u => u.subscription_status === 'active').length || 0,
    totalRevenue: transactions?.reduce((sum, t) => sum + t.amount, 0) || 0,
    monthlyRevenue: transactions?.reduce((sum, t) => sum + t.amount, 0) || 0,
    networkDifficulty: networkStats?.difficulty || 0,
    networkStatus: networkStats?.status || 'normal',
    predictions: predictions || [],
    recentTransactions: recentTransactions || [],
    notifications: notifications || []
  };
}

export async function fetchNetworkMetrics(): Promise<NetworkMetrics> {
  const { data } = await supabase
    .from('network_stats')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  return {
    difficulty: data?.difficulty || 0,
    hashrate: data?.metadata?.hashrate || 0,
    activeNodes: data?.metadata?.activeNodes || 0,
    blockTime: data?.metadata?.blockTime || 0,
    memoryUsage: data?.metadata?.memoryUsage || 0,
    cpuUsage: data?.metadata?.cpuUsage || 0,
    networkLatency: data?.metadata?.networkLatency || 0,
    errorRate: data?.metadata?.errorRate || 0,
    status: data?.status || 'normal'
  };
}

export async function fetchUserMetrics(): Promise<UserMetrics> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data: users } = await supabase
    .from('users')
    .select('created_at, subscription_tier, subscription_status');

  const { data: newUsers } = await supabase
    .from('users')
    .select('id')
    .gte('created_at', thirtyDaysAgo);

  const subscriptionTiers = users?.reduce((acc, user) => {
    acc[user.subscription_tier] = (acc[user.subscription_tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return {
    totalUsers: users?.length || 0,
    activeUsers: users?.filter(u => u.subscription_status === 'active').length || 0,
    newUsers: newUsers?.length || 0,
    churnRate: 0, // Calculate based on subscription cancellations
    userGrowth: 0, // Calculate based on user growth rate
    subscriptionTiers
  };
}

export async function fetchFinancialMetrics(): Promise<FinancialMetrics> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .gte('created_at', thirtyDaysAgo);

  const totalRevenue = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
  const refunds = transactions?.filter(t => t.type === 'refund');
  const subscriptions = transactions?.filter(t => t.type === 'subscription');

  return {
    totalRevenue,
    monthlyRevenue: totalRevenue,
    averageOrderValue: totalRevenue / (transactions?.length || 1),
    revenueGrowth: 0, // Calculate based on previous period
    transactionVolume: transactions?.length || 0,
    refundRate: (refunds?.length || 0) / (transactions?.length || 1),
    subscriptionRevenue: subscriptions?.reduce((sum, t) => sum + t.amount, 0) || 0
  };
}

export async function fetchSystemHealth(): Promise<SystemHealth> {
  const { data: services } = await supabase
    .from('network_stats')
    .select('metric_name, status, metric_value')
    .order('timestamp', { ascending: false })
    .limit(10);

  const { data: incidents } = await supabase
    .from('admin_logs')
    .select('created_at')
    .eq('action', 'incident_reported')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    status: 'healthy', // Calculate based on service statuses
    uptime: 99.99, // Calculate based on monitoring data
    lastIncident: incidents?.created_at || null,
    services: services?.map(s => ({
      name: s.metric_name,
      status: s.status as 'operational' | 'degraded' | 'down',
      latency: s.metric_value
    })) || []
  };
}

export async function logAdminAction(
  action: string,
  details: Record<string, any>
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  await supabase.from('admin_logs').insert({
    admin_id: user.id,
    action,
    details,
    ip_address: 'system' // In production, get from request
  });
}

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string
): Promise<void> {
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    message
  });
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ status: 'read', read_at: new Date().toISOString() })
    .eq('id', id);
}

export async function generateReport(
  userId: string,
  type: string,
  title: string,
  content: Record<string, any>
): Promise<void> {
  await supabase.from('reports').insert({
    user_id: userId,
    type,
    title,
    content,
    status: 'draft'
  });
}

export async function publishReport(id: string): Promise<void> {
  await supabase
    .from('reports')
    .update({
      status: 'published',
      published_at: new Date().toISOString()
    })
    .eq('id', id);
}