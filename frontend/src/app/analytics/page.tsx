"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, ArrowLeft, BarChart2, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
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
        <Link href="/posts" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <Layers className="text-blue-600" />
          <span>Team<span className="text-blue-600">Up</span></span>
        </Link>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-slate-800">
          <BarChart2 className="w-8 h-8 text-blue-600" />
          Recruitment Analytics
        </h1>
        <p className="text-slate-500">Aggregated statistics generated directly from raw database queries.</p>
      </div>

      {loading ? (
        <div className="text-blue-600">Loading statistics...</div>
      ) : analytics.length === 0 ? (
        <div className="text-center py-20 glass-panel">
          <p className="text-slate-500">No data to display. Try creating a post and getting some applicants first!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {analytics.map((stat: any) => (
            <div key={stat.post_id} className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-6 text-slate-800">{stat.post_title}</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-sm mb-1 flex items-center gap-2"><Users className="w-4 h-4"/> Total</div>
                  <div className="text-3xl font-bold text-slate-800">{stat.total_applicants}</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <div className="text-yellow-600 text-sm mb-1 flex items-center gap-2"><Clock className="w-4 h-4"/> Pending</div>
                  <div className="text-3xl font-bold text-yellow-600">{stat.pending_count}</div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="text-emerald-600 text-sm mb-1 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Accepted</div>
                  <div className="text-3xl font-bold text-emerald-600">{stat.accepted_count}</div>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="text-red-600 text-sm mb-1 flex items-center gap-2"><XCircle className="w-4 h-4"/> Rejected</div>
                  <div className="text-3xl font-bold text-red-600">{stat.rejected_count}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
