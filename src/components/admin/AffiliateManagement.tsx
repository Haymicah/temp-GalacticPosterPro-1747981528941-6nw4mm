import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, DollarSign, ArrowUpRight, 
  Search, Filter, Download, Trash2,
  Check, X, Edit2, Mail, Link,
  AlertTriangle, RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface Affiliate {
  id: string;
  userId: string;
  email: string;
  name: string;
  referralCode: string;
  status: 'active' | 'pending' | 'suspended';
  earnings: number;
  clicks: number;
  signups: number;
  conversionRate: number;
  joinedAt: Date;
  lastActive: Date;
  paymentMethod: {
    type: 'paypal';
    email: string;
  };
  campaigns: {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'completed';
    performance: number;
  }[];
}

export function AffiliateManagement() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([
    {
      id: '1',
      userId: 'user1',
      email: 'affiliate1@example.com',
      name: 'John Doe',
      referralCode: 'REF123',
      status: 'active',
      earnings: 1250.75,
      clicks: 2456,
      signups: 142,
      conversionRate: 5.78,
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date('2024-03-18'),
      paymentMethod: {
        type: 'paypal',
        email: 'john.doe@example.com'
      },
      campaigns: [
        {
          id: 'camp1',
          name: 'Spring Promotion',
          status: 'active',
          performance: 87
        }
      ]
    },
    // Add more mock data as needed
  ]);

  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePayment = async (affiliate: Affiliate) => {
    setIsProcessingPayment(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Update affiliate data
      setAffiliates(prev => 
        prev.map(a => 
          a.id === affiliate.id 
            ? { ...a, earnings: 0 }
            : a
        )
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleStatusChange = async (affiliate: Affiliate, newStatus: 'active' | 'pending' | 'suspended') => {
    setAffiliates(prev =>
      prev.map(a =>
        a.id === affiliate.id
          ? { ...a, status: newStatus }
          : a
      )
    );
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    if (statusFilter !== 'all' && affiliate.status !== statusFilter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        affiliate.name.toLowerCase().includes(searchLower) ||
        affiliate.email.toLowerCase().includes(searchLower) ||
        affiliate.referralCode.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const totalStats = affiliates.reduce(
    (acc, curr) => ({
      earnings: acc.earnings + curr.earnings,
      clicks: acc.clicks + curr.clicks,
      signups: acc.signups + curr.signups,
      activeAffiliates: acc.activeAffiliates + (curr.status === 'active' ? 1 : 0)
    }),
    { earnings: 0, clicks: 0, signups: 0, activeAffiliates: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Affiliate Management</h2>
        <button
          onClick={() => {/* TODO: Export data */}}
          className="flex items-center space-x-2 px-4 py-2 bg-terminal-darkGreen rounded hover:bg-terminal-green/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-terminal-darkGreen p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5" />
            <span className="text-xs opacity-75">Active Affiliates</span>
          </div>
          <div className="text-2xl font-bold">{totalStats.activeAffiliates}</div>
        </div>
        <div className="bg-terminal-darkGreen p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-xs opacity-75">Total Earnings</span>
          </div>
          <div className="text-2xl font-bold">${totalStats.earnings.toFixed(2)}</div>
        </div>
        <div className="bg-terminal-darkGreen p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <ArrowUpRight className="w-5 h-5" />
            <span className="text-xs opacity-75">Total Clicks</span>
          </div>
          <div className="text-2xl font-bold">{totalStats.clicks.toLocaleString()}</div>
        </div>
        <div className="bg-terminal-darkGreen p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5" />
            <span className="text-xs opacity-75">Total Signups</span>
          </div>
          <div className="text-2xl font-bold">{totalStats.signups.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-green/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search affiliates..."
            className="w-full pl-10 pr-4 py-2 bg-terminal-darkGreen border border-terminal-green rounded"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-terminal-darkGreen border border-terminal-green rounded px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-terminal-darkGreen rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-terminal-green/20">
              <th className="text-left p-4">Affiliate</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Earnings</th>
              <th className="text-right p-4">Clicks</th>
              <th className="text-right p-4">Signups</th>
              <th className="text-right p-4">Conv. Rate</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAffiliates.map(affiliate => (
              <tr 
                key={affiliate.id}
                className="border-b border-terminal-green/10 hover:bg-terminal-black/20"
              >
                <td className="p-4">
                  <div>
                    <div className="font-bold">{affiliate.name}</div>
                    <div className="text-sm opacity-75">{affiliate.email}</div>
                    <div className="text-xs opacity-50">Joined {format(affiliate.joinedAt, 'PP')}</div>
                  </div>
                </td>
                <td className="p-4">
                  <select
                    value={affiliate.status}
                    onChange={(e) => handleStatusChange(affiliate, e.target.value as any)}
                    className={cn(
                      "px-2 py-1 rounded text-xs",
                      affiliate.status === 'active' && "bg-green-500/20 text-green-500",
                      affiliate.status === 'pending' && "bg-yellow-500/20 text-yellow-500",
                      affiliate.status === 'suspended' && "bg-red-500/20 text-red-500"
                    )}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <div className="font-bold">${affiliate.earnings.toFixed(2)}</div>
                  <div className="text-xs opacity-75">Lifetime earnings</div>
                </td>
                <td className="p-4 text-right">
                  <div className="font-bold">{affiliate.clicks.toLocaleString()}</div>
                  <div className="text-xs opacity-75">Total clicks</div>
                </td>
                <td className="p-4 text-right">
                  <div className="font-bold">{affiliate.signups.toLocaleString()}</div>
                  <div className="text-xs opacity-75">Conversions</div>
                </td>
                <td className="p-4 text-right">
                  <div className="font-bold">{affiliate.conversionRate.toFixed(2)}%</div>
                  <div className="text-xs opacity-75">Conversion rate</div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setSelectedAffiliate(affiliate)}
                      className="p-2 hover:bg-terminal-black rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePayment(affiliate)}
                      disabled={isProcessingPayment || affiliate.earnings === 0}
                      className={cn(
                        "p-2 rounded",
                        affiliate.earnings > 0
                          ? "hover:bg-terminal-black"
                          : "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <DollarSign className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {/* TODO: Send email */}}
                      className="p-2 hover:bg-terminal-black rounded"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAffiliate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-terminal-black w-full max-w-2xl rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Edit Affiliate</h3>
              <button
                onClick={() => setSelectedAffiliate(null)}
                className="p-2 hover:bg-terminal-darkGreen rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={selectedAffiliate.name}
                  onChange={(e) => setSelectedAffiliate({ ...selectedAffiliate, name: e.target.value })}
                  className="w-full bg-terminal-darkGreen border border-terminal-green rounded px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={selectedAffiliate.email}
                  onChange={(e) => setSelectedAffiliate({ ...selectedAffiliate, email: e.target.value })}
                  className="w-full bg-terminal-darkGreen border border-terminal-green rounded px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">PayPal Email</label>
                <input
                  type="email"
                  value={selectedAffiliate.paymentMethod.email}
                  onChange={(e) => setSelectedAffiliate({
                    ...selectedAffiliate,
                    paymentMethod: {
                      ...selectedAffiliate.paymentMethod,
                      email: e.target.value
                    }
                  })}
                  className="w-full bg-terminal-darkGreen border border-terminal-green rounded px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Referral Code</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={selectedAffiliate.referralCode}
                    readOnly
                    className="flex-1 bg-terminal-darkGreen border border-terminal-green rounded px-4 py-2"
                  />
                  <button
                    onClick={() => {/* TODO: Generate new code */}}
                    className="px-4 py-2 bg-terminal-darkGreen border border-terminal-green rounded hover:bg-terminal-green/20"
                  >
                    Generate New
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Status</label>
                <select
                  value={selectedAffiliate.status}
                  onChange={(e) => setSelectedAffiliate({
                    ...selectedAffiliate,
                    status: e.target.value as any
                  })}
                  className="w-full bg-terminal-darkGreen border border-terminal-green rounded px-4 py-2"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {selectedAffiliate.status === 'suspended' && (
                <div className="p-4 bg-red-500/20 border border-red-500 rounded flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-500">
                    This affiliate's account is currently suspended
                  </span>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setSelectedAffiliate(null)}
                  className="px-4 py-2 border border-terminal-green rounded hover:bg-terminal-darkGreen"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Save changes
                    setSelectedAffiliate(null);
                  }}
                  className="px-4 py-2 bg-terminal-green text-black rounded font-bold hover:bg-terminal-green/90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}