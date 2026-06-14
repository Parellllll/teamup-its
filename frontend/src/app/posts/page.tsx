"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, LogOut, Plus, Search, Calendar, Users, Target, Bookmark, Bell } from 'lucide-react';
import api from '@/lib/axios';

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('All');
  const router = useRouter();

  useEffect(() => {
    const fetchPostsAndNotifs = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/posts?status=${status}`);
        setPosts(res.data.posts || []);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPostsAndNotifs();
  }, [status, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const isClosed = (tgl_tutup: string) => {
    return new Date(tgl_tutup) < new Date();
  };

  return (
    <div className="min-h-screen relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      
      {/* Navbar */}
      <nav className="w-full py-6 flex justify-between items-center max-w-7xl mx-auto border-b border-slate-800 mb-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <Sparkles className="text-indigo-400" />
          <span>Team<span className="text-indigo-400">Up</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/applications" className="px-3 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors hidden md:block">
            Lamaran Saya
          </Link>
          <Link href="/manage-posts" className="px-3 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors hidden md:block">
            Kelola Postingan
          </Link>
          <Link href="/analytics" className="px-3 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors hidden md:block">
            Analytics
          </Link>
          <Link href="/notifications" className="relative p-2 text-gray-400 hover:text-yellow-400 transition-colors">
            <Bell className="w-5 h-5" />
          </Link>
          <Link href="/posts/create" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post</span>
          </Link>
          <Link href="/profile" className="px-4 py-2 glass-panel text-white rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
            Profile
          </Link>
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Open <span className="text-indigo-400">Recruitments</span></h1>
            <p className="text-gray-400">Cari tim terbaik dan wujudkan inovasi.</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative">
              <select 
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="appearance-none bg-slate-800/50 border border-slate-700 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="All">Semua Status</option>
                <option value="Buka">Buka</option>
                <option value="Tutup">Tutup</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel h-64 animate-pulse bg-slate-800/50"></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 glass-panel">
            <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Tidak Ada Rekrutmen</h3>
            <p className="text-gray-400 mb-6">Belum ada postingan rekrutmen aktif saat ini.</p>
            <Link href="/posts/create" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-colors">
              <Plus className="w-5 h-5" />
              Buat Postingan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => {
              const closed = isClosed(post.tgl_tutup);
              let statusLabel = closed ? 'Tutup' : 'Buka';
              let statusColor = closed ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

              return (
              <div key={post.id_post} className="glass-panel p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 border hover:border-indigo-500/50 group">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${statusColor} uppercase tracking-wider`}>
                        {statusLabel}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold line-clamp-1 group-hover:text-indigo-300 transition-colors">{post.judul}</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">{post.deskripsi}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-300 gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>Batas Waktu: {new Date(post.tgl_tutup).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-300 gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>{post.positions?.reduce((acc: number, p: any) => acc + p.kuota, 0) || 0} Total Kuota</span>
                  </div>
                </div>

                <Link href={`/posts/${post.id_post}`} className="w-full text-center py-2 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-transparent rounded-lg font-medium transition-all">
                  Lihat Detail
                </Link>
              </div>
            )})}
          </div>
        )}
      </main>
    </div>
  );
}
