"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Code, CheckCircle, AlertTriangle, MessageSquare, Clock } from 'lucide-react';
import api from '@/lib/axios';

export default function PostDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<number | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.post);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, router]);

  const handleApply = async (posId: number) => {
    setApplying(posId);
    try {
      await api.post(`/posts/positions/${posId}/apply`);
      alert('Berhasil melamar!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal melamar');
    } finally {
      setApplying(null);
    }
  };

  const isClosed = (tgl_tutup: string) => {
    return new Date(tgl_tutup) < new Date();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-400">Loading...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Postingan tidak ditemukan</div>;

  const closedByDate = isClosed(post.tgl_tutup);
  const noPositions = !post.positions || post.positions.length === 0;
  const allPositionsClosed = post.positions?.length > 0 && post.positions.every((p: any) => p.status === 'Tutup');
  const closed = closedByDate || noPositions || allPositionsClosed;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Link href="/posts" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </Link>

      <div className="glass-panel p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none hidden"></div>
        
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-extrabold text-slate-900">{post.judul}</h1>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${closed ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
              {closed ? 'Tutup' : 'Buka'}
            </span>
            {post.user?.id_user && (
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-2">
                <Users className="w-4 h-4" /> Perekrut: {post.user.nama}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-600 mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Dibuat: <span className="text-slate-900 font-medium">{new Date(post.tgl_dibuat).toLocaleDateString('id-ID')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-500" />
            Batas Waktu: <span className="text-slate-900 font-medium">{new Date(post.tgl_tutup).toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none mb-8">
          <h3 className="text-xl font-bold mb-2 text-slate-900">Deskripsi Proyek</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{post.deskripsi}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900">
        Posisi yang Dibutuhkan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {post.positions?.map((pos: any) => (
          <div key={pos.id_pos} className="glass-panel p-6 border-t-4 border-t-blue-500 flex flex-col border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-900">{pos.nama_pos}</h3>
              {pos.status === 'Tutup' ? (
                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> PENUH
                </span>
              ) : (
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                  {pos.kuota} Kuota
                </span>
              )}
            </div>

            <div className="mb-6 flex-grow">
              <h4 className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" /> Keahlian yang Dibutuhkan
              </h4>
              <div className="flex flex-wrap gap-2">
                {pos.skills?.length > 0 ? pos.skills.map((skill: any) => (
                  <span key={skill.id_skill} className="px-3 py-1 bg-slate-100 rounded-lg text-sm text-slate-600 border border-slate-200">
                    {skill.nama_skill}
                  </span>
                )) : <span className="text-sm text-slate-400 italic">Tidak ada keahlian khusus</span>}
              </div>
            </div>

            <button
              onClick={() => handleApply(pos.id_pos)}
              disabled={closed || pos.status === 'Tutup' || applying === pos.id_pos}
              className={`w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors
                ${closed || pos.status === 'Tutup'
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`}
            >
              {applying === pos.id_pos ? 'Memproses...' : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {closed || pos.status === 'Tutup' ? 'Tidak Tersedia' : 'Lamar Sekarang'}
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
