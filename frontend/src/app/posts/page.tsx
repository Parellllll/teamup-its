"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, LogOut, Plus, Search, Calendar, Users, Target, Bookmark, Bell } from 'lucide-react';
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
        const res = await api.get(`/posts`);
        let allPosts = res.data.posts || [];
        
        if (status !== 'All') {
          allPosts = allPosts.filter((post: any) => {
            const closedByDate = isClosed(post.tgl_tutup);
            const noPositions = !post.positions || post.positions.length === 0;
            const allPositionsClosed = post.positions?.length > 0 && post.positions.every((p: any) => p.status === 'Tutup');
            const isPostClosed = closedByDate || noPositions || allPositionsClosed;
            
            if (status === 'Tutup') return isPostClosed;
            if (status === 'Buka') return !isPostClosed;
            return true;
          });
        }
        
        setPosts(allPosts);
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
    <div className="min-h-screen relative overflow-hidden px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-800">
      
      {/* Navbar */}
      <nav className="w-full py-6 flex justify-between items-center max-w-7xl mx-auto border-b border-slate-200 mb-8">
        <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <Layers className="text-blue-600" />
          <span>Team<span className="text-blue-600">Up</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/applications" className="px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors hidden md:block">
            Lamaran Saya
          </Link>
          <Link href="/manage-posts" className="px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors hidden md:block">
            Kelola Postingan
          </Link>
          <Link href="/analytics" className="px-3 py-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors hidden md:block">
            Analytics
          </Link>
          <Link href="/notifications" className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
          </Link>
          <Link href="/posts/create" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post</span>
          </Link>
          <Link href="/profile" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Profile
          </Link>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-slate-900">Open <span className="text-blue-600">Recruitments</span></h1>
            <p className="text-slate-500">Cari tim terbaik dan wujudkan inovasi.</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative">
              <select 
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="appearance-none bg-white border border-slate-300 rounded-full py-2 pl-4 pr-10 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
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
              <div key={i} className="glass-panel h-64 animate-pulse bg-slate-100"></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 glass-panel">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-slate-800">Tidak Ada Rekrutmen</h3>
            <p className="text-slate-500 mb-6">Belum ada postingan rekrutmen aktif saat ini.</p>
            <Link href="/posts/create" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-sm">
              <Plus className="w-5 h-5" />
              Buat Postingan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => {
              const closedByDate = isClosed(post.tgl_tutup);
              const noPositions = !post.positions || post.positions.length === 0;
              const allPositionsClosed = post.positions?.length > 0 && post.positions.every((p: any) => p.status === 'Tutup');
              const closed = closedByDate || noPositions || allPositionsClosed;
              
              let statusLabel = closed ? 'Tutup' : 'Buka';
              let statusColor = closed ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200';

              return (
              <div key={post.id_post} className="glass-panel p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-blue-400 group">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${statusColor} uppercase tracking-wider`}>
                        {statusLabel}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold line-clamp-1 group-hover:text-blue-600 transition-colors text-slate-800">{post.judul}</h3>
                  </div>
                </div>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">{post.deskripsi}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600 gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Batas Waktu: {new Date(post.tgl_tutup).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>{post.positions?.reduce((acc: number, p: any) => acc + p.kuota, 0) || 0} Total Kuota</span>
                  </div>
                </div>

                <Link href={`/posts/${post.id_post}`} className="w-full text-center py-2 bg-slate-50 hover:bg-blue-600 border border-slate-200 text-slate-700 hover:text-white hover:border-transparent rounded-lg font-medium transition-all">
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
