import React from 'react';
import { Link } from '@tanstack/react-router';

const DemiGod: React.FC = () => {
  return (
    <main className="flex-1">
      {/* Ghost Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ethereal Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(75,85,99,0.1)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(55,65,81,0.08)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(31,41,55,0.08)_0%,transparent_50%)]"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gray-500 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-gray-500 rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* High-Grade Skull */}
          <div className="mb-16 flex justify-center">
            <div className="relative">
              {/* Outer energy field */}
              <div className="absolute inset-0 w-96 h-96 bg-gradient-to-r from-red-600/30 via-orange-500/40 to-red-600/30 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Middle glow */}
              <div className="absolute inset-8 w-80 h-80 bg-gradient-to-r from-gray-200/20 via-white/30 to-gray-200/20 rounded-full blur-2xl animate-pulse delay-700"></div>
              
              {/* Skull Container */}
              <div className="relative bg-gradient-to-br from-black/90 via-gray-900/70 to-black/90 p-16 rounded-full shadow-2xl border-4 border-red-500/60 backdrop-blur-sm">
                {/* ASCII Art Style Skull */}
                <div className="relative text-center font-mono leading-none select-none">
                  {/* Skull rendered with text/symbols for high detail */}
                  <div className="text-gray-100 text-6xl sm:text-7xl lg:text-8xl drop-shadow-2xl animate-pulse">
                    <div className="mb-2">💀</div>
                  </div>
                  
                  {/* Enhanced skull overlay with CSS */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Main skull shape using CSS */}
                      <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 relative">
                        {/* Skull dome */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-20 sm:w-28 sm:h-24 lg:w-32 lg:h-28 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 rounded-t-full shadow-2xl border-2 border-gray-500/50"></div>
                        
                        {/* Eye sockets */}
                        <div className="absolute top-6 left-3 w-6 h-8 sm:w-7 sm:h-9 lg:w-8 lg:h-10 bg-black rounded-full shadow-inner border border-red-500/30"></div>
                        <div className="absolute top-6 right-3 w-6 h-8 sm:w-7 sm:h-9 lg:w-8 lg:h-10 bg-black rounded-full shadow-inner border border-red-500/30"></div>
                        
                        {/* Glowing eyes */}
                        <div className="absolute top-8 left-5 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                        <div className="absolute top-8 right-5 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                        
                        {/* Nasal cavity */}
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-3 h-6 sm:w-4 sm:h-7 lg:w-5 lg:h-8 bg-black rounded-b-full border border-gray-600/50"></div>
                        
                        {/* Jaw/teeth area */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-12 sm:w-24 sm:h-14 lg:w-28 lg:h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-2xl shadow-2xl border-2 border-gray-500/50"></div>
                        
                        {/* Teeth */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                          <div className="w-1 h-4 sm:w-1.5 sm:h-5 lg:w-2 lg:h-6 bg-white rounded-sm shadow-sm"></div>
                          <div className="w-1 h-3 sm:w-1.5 sm:h-4 lg:w-2 lg:h-5 bg-white rounded-sm shadow-sm"></div>
                          <div className="w-1 h-4 sm:w-1.5 sm:h-5 lg:w-2 lg:h-6 bg-white rounded-sm shadow-sm"></div>
                          <div className="w-1 h-3 sm:w-1.5 sm:h-4 lg:w-2 lg:h-5 bg-white rounded-sm shadow-sm"></div>
                          <div className="w-1 h-4 sm:w-1.5 sm:h-5 lg:w-2 lg:h-6 bg-white rounded-sm shadow-sm"></div>
                        </div>
                        
                        {/* Cracks and details */}
                        <div className="absolute top-4 left-8 w-8 h-0.5 bg-gray-600 transform rotate-12 opacity-60"></div>
                        <div className="absolute top-10 right-6 w-6 h-0.5 bg-gray-600 transform -rotate-12 opacity-60"></div>
                        <div className="absolute top-16 left-6 w-4 h-0.5 bg-gray-600 transform rotate-45 opacity-60"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating energy particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-8 left-12 w-2 h-2 bg-red-500 rounded-full animate-float opacity-80"></div>
                  <div className="absolute top-12 right-10 w-1.5 h-1.5 bg-orange-400 rounded-full animate-float delay-300 opacity-70"></div>
                  <div className="absolute bottom-12 left-8 w-2.5 h-2.5 bg-red-400 rounded-full animate-float delay-500 opacity-60"></div>
                  <div className="absolute bottom-8 right-12 w-1 h-1 bg-yellow-500 rounded-full animate-float delay-700 opacity-80"></div>
                  <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-red-300 rounded-full animate-float delay-900 opacity-70"></div>
                  <div className="absolute top-1/2 right-4 w-2 h-2 bg-orange-300 rounded-full animate-float delay-1100 opacity-60"></div>
                </div>
              </div>
              
              {/* Rotating energy rings */}
              <div className="absolute inset-0 w-96 h-96 border border-red-500/30 rounded-full animate-spin" style={{ animationDuration: '12s' }}></div>
              <div className="absolute inset-12 w-72 h-72 border border-orange-400/25 rounded-full animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}></div>
              <div className="absolute inset-24 w-48 h-48 border border-red-400/20 rounded-full animate-spin" style={{ animationDuration: '6s' }}></div>
            </div>
          </div>

          {/* Ghost CTAs */}
          <div className="space-y-6">
            <Link to="/strikehub">
              <button className="group relative w-full max-w-sm mx-auto bg-black/20 backdrop-blur-md border border-red-500/30 hover:border-red-400/50 text-gray-300 hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/20 overflow-hidden">
                {/* Subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center gap-3 tracking-wide text-lg">
                  🎯 STRIKEHUB V2
                </span>
                
                {/* Ghost shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </Link>

            <Link to="/ops">
              <button className="group relative w-full max-w-sm mx-auto bg-black/20 backdrop-blur-md border border-blue-500/30 hover:border-blue-400/50 text-gray-300 hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/20 overflow-hidden">
                {/* Subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center gap-3 tracking-wide text-lg">
                  🎛️ CONTROL ROOM
                </span>
                
                {/* Ghost shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </Link>

            <Link to="/DemiMind">
              <button className="group relative w-full max-w-sm mx-auto bg-black/20 backdrop-blur-md border border-purple-500/30 hover:border-purple-400/50 text-gray-300 hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/20 overflow-hidden">
                {/* Subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center gap-3 tracking-wide text-lg">
                  🧠 DEMIMIND
                </span>
                
                {/* Ghost shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </Link>
          </div>

          {/* Ghost status indicator */}
          <div className="mt-12 flex items-center justify-center gap-3 text-sm text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse opacity-60"></div>
            <span className="font-mono tracking-wider opacity-60">PHANTOM MODE: ACTIVE</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DemiGod;