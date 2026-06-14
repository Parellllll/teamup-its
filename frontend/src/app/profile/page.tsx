"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Code, GraduationCap, MapPin, Briefcase } from 'lucide-react';
import api from '@/lib/axios';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data.user);
      } catch (err) {
        if ((err as any).response?.status === 401) router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-400">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/posts" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </Link>

      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-indigo-500/30 flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <User className="w-16 h-16 text-indigo-400" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold mb-2">{profile.nama}</h1>
            <p className="text-indigo-400 font-medium mb-4">{profile.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300 mb-6">
              {profile.departemen && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-400" /> {profile.departemen}
                </div>
              )}
              {profile.angkatan !== 0 && (
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-orange-400" /> Angkatan {profile.angkatan}
                </div>
              )}
            </div>
            
            <p className="text-gray-400 leading-relaxed max-w-2xl">
              {profile.bio || 'Belum ada biodata singkat yang ditambahkan.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-700/50 pt-8">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-400" /> Keahlian (Skills)
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill: any) => (
                <span key={skill.id_skill} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-gray-300 shadow-sm">
                  {skill.nama_skill}
                </span>
              ))}
              {(!profile.skills || profile.skills.length === 0) && (
                <span className="text-sm text-gray-500 italic">Belum ada keahlian ditambahkan</span>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" /> Portofolio
            </h2>
            {profile.portofolios?.length > 0 ? (
              <ul className="space-y-2">
                {profile.portofolios.map((port: any) => (
                  <li key={port.id_port} className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 text-sm">
                    <a href={port.link_asset} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                      {port.judul}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Belum ada portofolio</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
