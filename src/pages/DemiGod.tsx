import React from 'react';
import { Zap } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const DemiGod: React.FC = () => {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(239,68,68,0.05)_50%,transparent_70%)]"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-red-600 to-orange-600 p-6 sm:p-8 rounded-2xl shadow-2xl border border-red-500/30">
                <Zap size={64} className="text-white sm:w-20 sm:h-20" />
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight" style={{ fontFamily: 'Orbitron, monospace' }}>
            <span className="block">COMMAND.</span>
            <span className="block text-red-500">STRIKE.</span>
            <span className="block text-orange-500">REPEAT.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Operate your outreach empire from one command system — 
            <span className="text-white font-bold"> DemiGod Ops.</span>
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link to="/strikehub">
              <button className="group relative bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black py-4 px-8 sm:py-5 sm:px-12 rounded-xl text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl border border-red-500/50 overflow-hidden">
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center gap-3 tracking-wide">
                  <Zap size={24} className="group-hover:animate-pulse" />
                  ENTER STRIKEHUB V2
                  <Zap size={24} className="group-hover:animate-pulse" />
                </span>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </Link>
          </div>

          {/* Status Indicator */}
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-mono tracking-wider">SYSTEM STATUS: OPERATIONAL</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DemiGod;