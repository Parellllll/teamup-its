"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Briefcase, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '@/lib/axios';

export default function MyApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        const res = await api.get('/applications/me');
        setApplications(res.data.applications || []);
      } catch (err: any) {
        if (err.response?.status === 401) router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchMyApps();
  }, [router]);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <nav className="flex justify-between items-center mb-8">
        <Link href="/posts" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <Sparkles className="text-indigo-400" />
          <span>Team<span className="text-indigo-400">Up</span></span>
        </Link>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Riwayat Lamaran Saya</h1>
        <p className="text-gray-400">Pantau status lamaran Anda ke berbagai tim.</p>
      </div>

      {loading ? (
        <div className="text-indigo-400">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 glass-panel">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Belum Ada Lamaran</h3>
          <p className="text-gray-400 mb-6">Anda belum melamar ke tim manapun. Cari tim sekarang!</p>
          <Link href="/posts" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-colors">
            Cari Tim
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app: any) => (
            <div key={app.id_app} className="glass-panel p-6 flex flex-col hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">ID Posisi: {app.id_pos}</h3>
                  <span className="text-sm text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {app.position?.nama_pos || 'Posisi'}
                  </span>
                </div>
                
                {app.status === 'Menunggu' && <Clock className="w-6 h-6 text-yellow-500" />}
                {app.status === 'Diterima' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                {app.status === 'Ditolak' && <XCircle className="w-6 h-6 text-red-500" />}
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-700/50 flex justify-between items-center">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Daftar: {new Date(app.tgl_daftar).toLocaleDateString('id-ID')}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  ${app.status === 'Menunggu' ? 'bg-yellow-500/20 text-yellow-500' : 
                    app.status === 'Diterima' ? 'bg-emerald-500/20 text-emerald-400' : 
                    'bg-red-500/20 text-red-400'}`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
