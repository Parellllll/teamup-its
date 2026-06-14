"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Bookmark, Calendar, MapPin, Users } from 'lucide-react';
import api from '@/lib/axios';

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.get('/saved-posts');
        setPosts(res.data.posts);
      } catch (err: any) {
        if (err.response?.status === 401) router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [router]);

  const handleUnsave = async (postId: string) => {
    try {
      await api.post(`/posts/${postId}/save`);
      setPosts(posts.filter((p: any) => p.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">Saved Posts</h1>
        <p className="text-gray-400">Your bookmarked recruitments.</p>
      </div>

      {loading ? (
        <div className="text-indigo-400">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 glass-panel">
          <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Saved Posts</h3>
          <p className="text-gray-400 mb-6">You haven't bookmarked any recruitments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post: any) => (
            <div key={post.id} className="glass-panel p-6 flex flex-col hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs text-indigo-400 mb-1 block">{post.category}</span>
                  <Link href={`/posts/${post.id}`}>
                    <h3 className="text-xl font-bold text-white hover:text-indigo-400 transition-colors">{post.title}</h3>
                  </Link>
                </div>
                <button 
                  onClick={() => handleUnsave(post.id)}
                  className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                >
                  <Bookmark className="w-5 h-5 fill-indigo-400" />
                </button>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-700/50 flex flex-wrap gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.deadline).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {post.location_type}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
