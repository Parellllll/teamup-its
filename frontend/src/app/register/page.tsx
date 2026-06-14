"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, User, ArrowRight, ArrowLeft, CheckCircle, Code, GraduationCap, Star } from 'lucide-react';
import api from '@/lib/axios';

const SPECIALTIES = [
  'Full-stack developer', 'Front-end developer', 'Back-end developer', 'Mobile developer',
  'Data scientist', 'Designer', 'Product manager', 'Business', 'Other'
];

const INTERESTS = [
  'Lomba', 'Penelitian', 'Proyek Kelas', 'Startup', 'Game Dev', 'AI/Machine Learning', 'Cybersecurity', 'Web3'
];

export default function Register() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [department, setDepartment] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !email.endsWith('its.ac.id')) {
      setError('Registration is restricted to ITS emails (@its.ac.id or @student.its.ac.id).');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSkill = skillsStr.trim().replace(',', '');
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setSkillsStr('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        specialty,
        department,
        graduation_year: parseInt(graduationYear) || new Date().getFullYear() + 4,
        interests: JSON.stringify(selectedInterests),
        skills
      });
      // Optionally login automatically, but for now redirect
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="glass-panel p-8 w-full max-w-2xl relative z-10 transition-all duration-500">
        
        {/* Header & Progress Indicator */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
            <Sparkles className="text-indigo-400 w-6 h-6" />
            <span className="text-xl font-bold tracking-tighter">Team<span className="text-indigo-400">Up</span></span>
          </Link>
          
          <div className="flex items-center justify-between mt-2">
            {[1, 2, 3, 4].map(num => (
              <div key={num} className="flex items-center flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= num ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-800 text-gray-500'}`}>
                  {step > num ? <CheckCircle className="w-4 h-4" /> : num}
                </div>
                {num < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${step > num ? 'bg-indigo-600' : 'bg-slate-800'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold mb-1">Create Account</h2>
              <p className="text-gray-400 text-sm">Join the exclusive ITS collaboration network.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ITS Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input type="email" required placeholder="nrp@its.ac.id" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input type="password" required minLength={6} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Already have an account?</Link>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Specialty & Skills */}
        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold mb-1">Your Expertise</h2>
              <p className="text-gray-400 text-sm">Tell us what you're good at so teams can find you.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-3">What's your specialty? <span className="text-red-400">*</span></label>
                <div className="flex flex-wrap gap-3">
                  {SPECIALTIES.map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => setSpecialty(s)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${specialty === s ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-800/50 text-gray-400 border-slate-700 hover:border-gray-500 hover:text-gray-300'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">What are your skills?</label>
                <p className="text-xs text-gray-500 mb-3">Languages, frameworks, APIs, and tools. Type and press Enter or comma.</p>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500">
                  {skills.map(s => (
                    <span key={s} className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {s} <button type="button" onClick={() => removeSkill(s)} className="hover:text-white">&times;</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={skillsStr}
                    onChange={e => setSkillsStr(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder={skills.length === 0 ? "e.g. React, Python, Figma..." : ""}
                    className="flex-1 bg-transparent text-white text-sm outline-none min-w-[150px] p-1"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button type="button" onClick={handlePrev} className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" disabled={!specialty} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Academic Info */}
        {step === 3 && (
          <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold mb-1">Academic Status</h2>
              <p className="text-gray-400 text-sm">Where are you currently at ITS?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Department (Jurusan) <span className="text-red-400">*</span></label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input type="text" required placeholder="e.g. Teknik Informatika" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Expected Graduation Year <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Star className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <select required value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                    <option value="" disabled>Select Year</option>
                    {[0, 1, 2, 3, 4, 5].map(offset => {
                      const year = new Date().getFullYear() + offset;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button type="button" onClick={handlePrev} className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" disabled={!department || !graduationYear} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Preferences & Finish */}
        {step === 4 && (
          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold mb-1">Preferences</h2>
              <p className="text-gray-400 text-sm">What types of opportunities are you looking for?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">Select your interests</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INTERESTS.map(interest => (
                  <label key={interest} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${selectedInterests.includes(interest) ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800/50 border-slate-700 hover:border-gray-500'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={selectedInterests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                    />
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${selectedInterests.includes(interest) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                      {selectedInterests.includes(interest) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${selectedInterests.includes(interest) ? 'text-indigo-300 font-medium' : 'text-gray-400'}`}>{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-8 flex justify-between items-center">
              <button type="button" onClick={handlePrev} className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 hover:scale-105">
                {loading ? 'Setting up Profile...' : (
                  <>
                    <Sparkles className="w-5 h-5" /> Complete Profile
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
