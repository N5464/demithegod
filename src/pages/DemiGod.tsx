import React from 'react';
import { Link } from '@tanstack/react-router';

const DemiGod: React.FC = () => {
  return (
    <main className="flex-1">
      {/* Ghost Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ethereal Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.05)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.03)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.03)_0%,transparent_50%)]"></div>
        
        {/* Digital grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating data points */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* High-Tech Command Core */}
          <div className="mb-16 flex justify-center">
            <div className="relative">
              {/* Outer tech field */}
              <div className="absolute inset-0 w-96 h-96 bg-gradient-to-r from-blue-600/20 via-cyan-500/30 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Middle tech glow */}
              <div className="absolute inset-8 w-80 h-80 bg-gradient-to-r from-slate-200/10 via-blue-200/20 to-slate-200/10 rounded-full blur-2xl animate-pulse delay-700"></div>
              
              {/* Command Core Container */}
              <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90 p-16 rounded-full shadow-2xl border-4 border-blue-500/40 backdrop-blur-sm">
                {/* Central Command Core */}
                <div className="relative flex items-center justify-center">
                  {/* Core Hub - Concentric Circles */}
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-pulse"></div>
                    
                    {/* Middle ring */}
                    <div className="absolute inset-4 rounded-full border-2 border-cyan-400/40 animate-pulse delay-300"></div>
                    
                    {/* Inner ring */}
                    <div className="absolute inset-8 rounded-full border border-blue-300/50 animate-pulse delay-600"></div>
                    
                    {/* Central core */}
                    <div className="absolute inset-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/60 flex items-center justify-center">
                      {/* Network icon */}
                      <div className="relative">
                        {/* Central node */}
                        <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                        
                        {/* Connection lines */}
                        <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-transparent transform -translate-y-1/2 -translate-x-1/2 rotate-0"></div>
                        <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-transparent transform -translate-y-1/2 -translate-x-1/2 rotate-45"></div>
                        <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-transparent transform -translate-y-1/2 -translate-x-1/2 rotate-90"></div>
                        <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-transparent transform -translate-y-1/2 -translate-x-1/2 rotate-135"></div>
                        
                        {/* Outer nodes */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-400"></div>
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-600"></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-800"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating data particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-8 left-12 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-80"></div>
                  <div className="absolute top-12 right-10 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float delay-300 opacity-70"></div>
                  <div className="absolute bottom-12 left-8 w-2.5 h-2.5 bg-blue-300 rounded-full animate-float delay-500 opacity-60"></div>
                  <div className="absolute bottom-8 right-12 w-1 h-1 bg-cyan-300 rounded-full animate-float delay-700 opacity-80"></div>
                  <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-blue-200 rounded-full animate-float delay-900 opacity-70"></div>
                  <div className="absolute top-1/2 right-4 w-2 h-2 bg-cyan-200 rounded-full animate-float delay-1100 opacity-60"></div>
                </div>
              </div>
              
              {/* Rotating tech rings */}
              <div className="absolute inset-0 w-96 h-96 border border-blue-500/20 rounded-full animate-spin" style={{ animationDuration: '12s' }}></div>
              <div className="absolute inset-12 w-72 h-72 border border-cyan-400/15 rounded-full animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}></div>
              <div className="absolute inset-24 w-48 h-48 border border-blue-400/10 rounded-full animate-spin" style={{ animationDuration: '6s' }}></div>
            </div>
          </div>

          {/* Command CTAs */}
          <div className="space-y-6">
            <Link to="/strikehub">
              <button className="group relative w-full max-w-sm mx-auto bg-black/20 backdrop-blur-md border border-blue-500/30 hover:border-blue-400/50 text-gray-300 hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/20 overflow-hidden">
                {/* Subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center gap-3 tracking-wide text-lg">
                  🎯 STRIKEHUB V2
                </span>
                
                {/* Tech shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </Link>


            <Link to="/DemiMind">
              <button className="group relative w-full max-w-sm mx-auto bg-black/20 backdrop-blur-md border border-purple-500/30 hover:border-purple-400/50 text-gray-300 hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/20 overflow-hidden">
                {/* Subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center gap-3 tracking-wide text-lg">
                  🧠 DEMIMIND
                </span>
                
                {/* Tech shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </Link>
          </div>

          {/* System status indicator */}
          <div className="mt-12 flex items-center justify-center gap-3 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
            <span className="font-mono tracking-wider opacity-60">SYSTEM STATUS: ONLINE</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DemiGod;