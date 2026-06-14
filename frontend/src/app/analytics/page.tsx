"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, BarChart2, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function Analytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/me');
        setAnalytics(res.data.analytics || []);
      } catch (err: any) {
        if (err.response?.status === 401) router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [router]);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <nav className="flex justify-between items-center mb-8">
        <Link href="/posts" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <Sparkles className="text-indigo-400" />
          <span>Team<span className="text-indigo-400">Up</span></span>
        </Link>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-indigo-400" />
          Recruitment Analytics
        </h1>
        <p className="text-gray-400">Aggregated statistics generated directly from raw database queries.</p>
      </div>

      {loading ? (
        <div className="text-indigo-400">Loading statistics...</div>
      ) : analytics.length === 0 ? (
        <div className="text-center py-20 glass-panel">
          <p className="text-gray-400">No data to display. Try creating a post and getting some applicants first!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {analytics.map((stat: any) => (
            <div key={stat.post_id} className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-6">{stat.post_title}</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-gray-400 text-sm mb-1 flex items-center gap-2"><Users className="w-4 h-4"/> Total</div>
                  <div className="text-3xl font-bold text-white">{stat.total_applicants}</div>
                </div>
                
                <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                  <div className="text-yellow-500 text-sm mb-1 flex items-center gap-2"><Clock className="w-4 h-4"/> Pending</div>
                  <div className="text-3xl font-bold text-yellow-400">{stat.pending_count}</div>
                </div>

                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <div className="text-emerald-500 text-sm mb-1 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Accepted</div>
                  <div className="text-3xl font-bold text-emerald-400">{stat.accepted_count}</div>
                </div>

                <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  <div className="text-red-500 text-sm mb-1 flex items-center gap-2"><XCircle className="w-4 h-4"/> Rejected</div>
                  <div className="text-3xl font-bold text-red-400">{stat.rejected_count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
