'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, TrendingUp, Award, Flame } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { getStats, type Stats, type MantraStats } from '@/lib/api';

export function ChantingTracker() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ today: 0, week: 0, month: 0, streak: 0 });
  const [mantraStats, setMantraStats] = useState<MantraStats[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  const loadStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getStats(user.id);

      setStats(data.stats);
      setMantraStats(data.mantraStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [loadStats, user]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadStats}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 mb-4">
            Chanting Tracker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitor your spiritual journey and celebrate your progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-10 h-10" />
              <div className="text-4xl font-bold">{stats.today}</div>
            </div>
            <div className="text-lg font-semibold">Today</div>
            <div className="text-sm opacity-90">Chants completed</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10" />
              <div className="text-4xl font-bold">{stats.week}</div>
            </div>
            <div className="text-lg font-semibold">This Week</div>
            <div className="text-sm opacity-90">Total chants</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <Award className="w-10 h-10" />
              <div className="text-4xl font-bold">{stats.month}</div>
            </div>
            <div className="text-lg font-semibold">This Month</div>
            <div className="text-sm opacity-90">Total chants</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-10 h-10" />
              <div className="text-4xl font-bold">{stats.streak}</div>
            </div>
            <div className="text-lg font-semibold">Day Streak</div>
            <div className="text-sm opacity-90">Keep it going!</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'daily'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'weekly'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'monthly'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Monthly
            </button>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {activeTab === 'daily' && 'Today&apos;s Progress'}
              {activeTab === 'weekly' && 'This Week&apos;s Progress'}
              {activeTab === 'monthly' && 'This Month&apos;s Progress'}
            </h2>

            {mantraStats.map((stat) => {
              const count = activeTab === 'daily' ? stat.today : activeTab === 'weekly' ? stat.week : stat.month;
              const maxCount = Math.max(...mantraStats.map(s =>
                activeTab === 'daily' ? s.today : activeTab === 'weekly' ? s.week : s.month
              ), 1);
              const percentage = (count / maxCount) * 100;

              return (
                <div key={stat.mantra.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {stat.mantra.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.mantra.category}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {count}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {mantraStats.every(s => {
              const count = activeTab === 'daily' ? s.today : activeTab === 'weekly' ? s.week : s.month;
              return count === 0;
            }) && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  No chanting records for this period yet. Start chanting to see your progress!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
