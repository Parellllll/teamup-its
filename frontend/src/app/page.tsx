import Link from 'next/link';
import { ArrowRight, Layers, Users, Code, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Navbar placeholder */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-10">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 text-slate-900">
          <Layers className="text-blue-600" />
          <span>Team<span className="text-blue-600">Up</span></span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 rounded-full font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2 rounded-full font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center text-center max-w-4xl z-10 mt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-sm text-blue-700 mb-8 border border-blue-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Exclusive for ITS Students (@its.ac.id)
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
          Find the Perfect <br/>
          <span className="gradient-text">Dream Team</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
          Stop struggling to find members for your hackathons, research, or startup projects.
          Match skills instantly and start building together.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/posts" className="px-8 py-4 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-105 shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] flex items-center justify-center gap-2 group">
            Explore Open Roles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/register" className="px-8 py-4 rounded-full font-bold glass-panel text-slate-800 hover:bg-slate-50 transition-all hover:scale-105 flex items-center justify-center">
            Create a Recruitment Post
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-10">
          <FeatureCard 
            icon={<Code className="text-blue-500 w-8 h-8" />}
            title="Skill Matching"
            description="Our smart system ensures you only see candidates with at least a 50% match to your requirements."
          />
          <FeatureCard 
            icon={<Users className="text-indigo-500 w-8 h-8" />}
            title="Role Management"
            description="Define specific quotas for Hackers, Hipsters, and Hustlers. The system auto-closes when full."
          />
          <FeatureCard 
            icon={<Zap className="text-sky-500 w-8 h-8" />}
            title="Automated Triggers"
            description="Database-level automations instantly handle deadline closures so you don't have to."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-panel p-6 hover:-translate-y-2 transition-transform duration-300 group">
      <div className="mb-4 p-3 bg-slate-100 rounded-xl inline-block group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-800">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
