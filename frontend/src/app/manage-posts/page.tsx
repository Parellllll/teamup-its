"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Users, Trash2, Target } from 'lucide-react';
import api from '@/lib/axios';

export default function ManagePosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await api.get('/posts/me');
        setPosts(res.data.posts || []);
      } catch (err: any) {
        if (err.response?.status === 401) router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus postingan ini secara permanen?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p: any) => p.id_post !== id));
    } catch (err) {
      alert('Gagal menghapus postingan');
    }
  };

  const isClosed = (tgl_tutup: string) => {
    return new Date(tgl_tutup) < new Date();
  };

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
        <h1 className="text-3xl font-bold mb-2">Kelola Postingan Anda</h1>
        <p className="text-gray-400">Lihat pelamar atau hapus postingan rekrutmen Anda.</p>
      </div>

      {loading ? (
        <div className="text-indigo-400">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 glass-panel">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Belum Ada Postingan</h3>
          <p className="text-gray-400 mb-6">Anda belum membuat rekrutmen apapun.</p>
          <Link href="/posts/create" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-colors">
            Buat Postingan Baru
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post: any) => (
            <div key={post.id_post} className="glass-panel p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{post.judul}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isClosed(post.tgl_tutup) ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {isClosed(post.tgl_tutup) ? 'Tutup' : 'Buka'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">Batas Waktu: {new Date(post.tgl_tutup).toLocaleDateString('id-ID')}</p>
                <div className="flex gap-2">
                  {post.positions?.map((pos: any) => (
                    <span key={pos.id_pos} className="text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded">
                      {pos.nama_pos} ({pos.kuota})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
                <Link href={`/manage-posts/${post.id_post}`} className="flex-1 sm:flex-none text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" /> Pelamar
                </Link>
                <button onClick={() => handleDelete(post.id_post)} className="flex-1 sm:flex-none px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
