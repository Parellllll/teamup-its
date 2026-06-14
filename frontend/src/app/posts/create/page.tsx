"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tgl_tutup: '',
  });

  const [positions, setPositions] = useState([{ nama_pos: '', kuota: 1, skills: [''] }]);

  const handleAddPosition = () => {
    setPositions([...positions, { nama_pos: '', kuota: 1, skills: [''] }]);
  };

  const handleRemovePosition = (index: number) => {
    if (positions.length === 1) return;
    const newPos = [...positions];
    newPos.splice(index, 1);
    setPositions(newPos);
  };

  const handlePositionChange = (index: number, field: string, value: any) => {
    const newPos = [...positions];
    (newPos[index] as any)[field] = value;
    setPositions(newPos);
  };

  const handleSkillChange = (posIndex: number, skillIndex: number, value: string) => {
    const newPos = [...positions];
    newPos[posIndex].skills[skillIndex] = value;
    setPositions(newPos);
  };

  const handleAddSkill = (posIndex: number) => {
    const newPos = [...positions];
    newPos[posIndex].skills.push('');
    setPositions(newPos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanedPositions = positions.map(pos => ({
        ...pos,
        skills: pos.skills.filter(s => s.trim() !== '')
      }));

      await api.post('/posts', {
        ...formData,
        tgl_tutup: formData.tgl_tutup ? new Date(formData.tgl_tutup).toISOString() : new Date().toISOString(),
        positions: cleanedPositions
      });

      router.push('/posts');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal membuat postingan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/posts" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Buat <span className="text-indigo-400">Rekrutmen Baru</span></h1>
        <p className="text-gray-400 mb-8">Cari anggota tim dengan menentukan posisi dan keahlian yang dibutuhkan.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-panel p-8">
          <h2 className="text-xl font-bold mb-6">Informasi Dasar</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Judul Proyek</label>
              <input 
                type="text" 
                required
                value={formData.judul}
                onChange={e => setFormData({...formData, judul: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Contoh: Tim Gemastik 2026 Divisi Game Dev"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Proyek</label>
              <textarea 
                required
                rows={4}
                value={formData.deskripsi}
                onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="Jelaskan secara detail tentang proyek Anda..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Batas Waktu Pendaftaran</label>
              <input 
                type="date" 
                required
                value={formData.tgl_tutup}
                onChange={e => setFormData({...formData, tgl_tutup: e.target.value})}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Posisi yang Dibutuhkan</h2>
            <button 
              type="button" 
              onClick={handleAddPosition}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Tambah Posisi
            </button>
          </div>

          {positions.map((pos, pIndex) => (
            <div key={pIndex} className="glass-panel p-6 border-l-4 border-indigo-500 relative">
              {positions.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemovePosition(pIndex)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nama Posisi</label>
                  <input 
                    type="text" 
                    required
                    value={pos.nama_pos}
                    onChange={e => handlePositionChange(pIndex, 'nama_pos', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Contoh: Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Kuota</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={pos.kuota}
                    onChange={e => handlePositionChange(pIndex, 'kuota', parseInt(e.target.value))}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Keahlian (Skills)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {pos.skills.map((skill, sIndex) => (
                    <input 
                      key={sIndex}
                      type="text" 
                      value={skill}
                      onChange={e => handleSkillChange(pIndex, sIndex, e.target.value)}
                      className="bg-slate-800/50 border border-slate-700 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500 w-32"
                      placeholder="e.g. React"
                    />
                  ))}
                  <button 
                    type="button" 
                    onClick={() => handleAddSkill(pIndex)}
                    className="px-3 py-1.5 border border-dashed border-slate-600 rounded-lg text-sm text-gray-400 hover:text-white hover:border-slate-500 flex items-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? 'Memproses...' : (
            <>
              <CheckCircle className="w-5 h-5" />
              Publikasikan Rekrutmen
            </>
          )}
        </button>
      </form>
    </div>
  );
}
