export interface User {
  id: string;
  email: string;
  name: string;
  referralCode: string;
  credits: number;
}

export interface DashboardStats {
  totalReferrals: number;
  convertedReferrals: number;
  totalCreditsEarned: number;
  referralLink: string;
}

export interface DashboardData {
  user: User;
  stats: DashboardStats;
}

export interface Referral {
  _id: string;
  referrer: string;
  referred: {
    name: string;
    email: string;
    createdAt: string;
  };
  status: 'pending' | 'converted';
  createdAt: string;
  convertedAt?: string;
}

export interface Purchase {
  id: string;
  productName: string;
  amount: number;
  isFirstPurchase: boolean;
}