export interface AffiliateStats {
  id: string;
  userId: string;
  referralCode: string;
  referralLink: string;
  clicks: number;
  signups: number;
  earnings: number;
  lastPayout: Date | null;
  createdAt: Date;
}

export interface AffiliatePayment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paypalEmail: string;
  createdAt: Date;
  processedAt: Date | null;
}