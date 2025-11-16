'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, ShoppingCart, Users, Award, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/utils/api';
import { DashboardData } from '@/types';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { user, logout, updateUser } = useAuthStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await apiClient.get<DashboardData>('/user/dashboard');
      setDashboardData(data);
      updateUser(data.user);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const response = await apiClient.post<{
        success: boolean;
        creditsEarned: number;
        totalCredits: number;
      }>('/purchase/simulate', {
        productName: 'Digital Course Bundle',
        amount: 99.99,
      });

      if (response.success) {
        updateUser({ credits: response.totalCredits });
        await fetchDashboardData();
        
        if (response.creditsEarned > 0) {
          alert(`🎉 Purchase successful! You earned ${response.creditsEarned} credits!`);
        } else {
          alert('Purchase successful!');
        }
      }
    } catch (error: any) {
      alert(`Purchase failed: ${error.message}`);
    } finally {
      setPurchasing(false);
    }
  };

  const copyReferralLink = async () => {
    if (dashboardData?.stats.referralLink) {
      try {
        await navigator.clipboard.writeText(dashboardData.stats.referralLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share && dashboardData?.stats.referralLink) {
      try {
        await navigator.share({
          title: 'Join our referral program!',
          text: 'Sign up using my referral link and we both get 2 credits!',
          url: dashboardData.stats.referralLink,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 text-sm font-medium">Total Referrals</p>
                <p className="text-3xl font-bold text-primary-700">
                  {dashboardData?.stats.totalReferrals || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-600 text-sm font-medium">Converted Users</p>
                <p className="text-3xl font-bold text-success-700">
                  {dashboardData?.stats.convertedReferrals || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warning-600 text-sm font-medium">Total Credits</p>
                <p className="text-3xl font-bold text-warning-700">
                  {dashboardData?.stats.totalCreditsEarned || 0}
                </p>
              </div>
              <Award className="h-8 w-8 text-warning-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card"
          >
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="h-5 w-5" />
              {purchasing ? 'Processing...' : 'Buy Product ($99.99)'}
            </button>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Referral Link</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 break-all">
                {dashboardData?.stats.referralLink}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyReferralLink}
                className="btn-primary flex items-center gap-2 flex-1"
              >
                <Copy className="h-4 w-4" />
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </button>
              {navigator.share && (
                <button
                  onClick={shareReferralLink}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-medium">1</span>
                </div>
                <p className="text-gray-600">Share your unique referral link with friends</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-medium">2</span>
                </div>
                <p className="text-gray-600">They sign up using your link</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-medium">3</span>
                </div>
                <p className="text-gray-600">When they make their first purchase, you both earn 2 credits!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}