"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, X, User } from 'lucide-react';
import api from '@/lib/axios';

export default function PostApplicants() {
  const { id } = useParams();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/posts/${id}/applicants`);
        setApplications(res.data.applications || []);
      } catch (err: any) {
        if (err.response?.status === 401) router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id, router]);

  const handleReview = async (appId: number, status: string) => {
    if (!confirm(`Apakah Anda yakin ingin memberikan status ${status} untuk pelamar ini?`)) return;
    try {
      await api.post(`/applications/${appId}/review`, { status });
      setApplications(applications.map((app: any) => app.id_app === appId ? { ...app, status } : app));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mereview lamaran');
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Link href="/manage-posts" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Postingan Saya
      </Link>

      <div className="mb-8 border-b border-slate-700 pb-6">
        <h1 className="text-3xl font-bold mb-2">Daftar Pelamar</h1>
        <p className="text-gray-400">Review kandidat dan tentukan siapa yang akan bergabung dengan tim Anda.</p>
      </div>

      {loading ? (
        <div className="text-indigo-400">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 glass-panel">
          <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Belum Ada Pelamar</h3>
          <p className="text-gray-400 mb-6">Tunggu sebentar lagi hingga ada yang mendaftar.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app: any) => (
            <div key={app.id_app} className="glass-panel p-6 border-t-4 border-t-indigo-500">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Applicant Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-400" />
                      {app.user?.nama}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${app.status === 'Menunggu' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                        app.status === 'Diterima' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                        'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Mendaftar Posisi</p>
                      <p className="font-medium text-white bg-slate-800 px-2 py-1 rounded inline-block">
                        {app.position?.nama_pos}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Tanggal Daftar</p>
                      <p className="font-medium text-gray-300">
                        {new Date(app.tgl_daftar).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-bold">Profil Singkat</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed italic">
                      Departemen: {app.user?.departemen} (Angkatan {app.user?.angkatan})<br/>
                      Bio: {app.user?.bio || "-"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6 justify-center">
                  {app.status === 'Menunggu' && (
                    <>
                      <button onClick={() => handleReview(app.id_app, 'Diterima')} className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Terima
                      </button>
                      <button onClick={() => handleReview(app.id_app, 'Ditolak')} className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <X className="w-4 h-4" /> Tolak
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
