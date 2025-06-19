import React from 'react';
import { Command, Shield, Radar, Satellite, Database } from 'lucide-react';
import DemiNotes from '../components/ops/DemiNotes';

const DemiOps: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Military Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-blue-500/30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg shadow-lg border border-blue-500/50">
                <Command size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>
                  CONTROL <span className="text-blue-500">ROOM</span>
                </h1>
                <p className="text-blue-400 text-sm font-semibold tracking-wide">OPERATIONAL INTELLIGENCE CENTER</p>
              </div>
            </div>
            <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-sm font-bold tracking-wide">STATUS: ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 sm:p-6">
            <div className="text-blue-400 text-sm font-bold mb-2 tracking-wide">⚡ MISSION BRIEFING</div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Welcome to the Control Room - your secure operational intelligence center. 
              <span className="text-blue-400 font-semibold"> Access classified tools and strategic planning modules.</span>
            </p>
          </div>
        </div>

        {/* Command Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* DemiNotes - Active Tool */}
          <div className="lg:col-span-2">
            <DemiNotes />
          </div>

          {/* Coming Soon Block 1 - Intelligence Analyzer */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600/30 p-3 rounded-lg border border-purple-500/50">
                  <Radar size={24} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                    🔍 INTEL ANALYZER
                  </h3>
                  <p className="text-purple-400 text-sm font-semibold">Advanced Intelligence Processing</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                  <Radar size={32} className="text-purple-400 sm:w-10 sm:h-10" />
                </div>
                <div className="space-y-2">
                  <div className="text-slate-400 text-xs font-bold tracking-wider">DEPLOYMENT STATUS</div>
                  <div className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/30 inline-block">
                    🚧 COMING SOON
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-bold text-lg">Advanced Intelligence Processing</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Automated analysis of market intelligence, competitor tracking, and strategic opportunity identification.
                </p>
                <div className="text-xs text-slate-500 font-mono">
                  ETA: Q1 2025 • Classification: RESTRICTED
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Block 2 - Threat Monitor */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border-b border-red-500/30 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-600/30 p-3 rounded-lg border border-red-500/50">
                  <Shield size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                    🛡️ THREAT MONITOR
                  </h3>
                  <p className="text-red-400 text-sm font-semibold">Security & Risk Assessment</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                  <Shield size={32} className="text-red-400 sm:w-10 sm:h-10" />
                </div>
                <div className="space-y-2">
                  <div className="text-slate-400 text-xs font-bold tracking-wider">DEPLOYMENT STATUS</div>
                  <div className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/30 inline-block">
                    🚧 COMING SOON
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-bold text-lg">Security & Risk Assessment</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Real-time monitoring of operational security, reputation management, and competitive threat detection.
                </p>
                <div className="text-xs text-slate-500 font-mono">
                  ETA: Q1 2025 • Classification: TOP SECRET
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Block 3 - Command Satellite */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden lg:col-span-2">
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-green-500/30 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-600/30 p-3 rounded-lg border border-green-500/50">
                  <Satellite size={24} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                    🛰️ COMMAND SATELLITE
                  </h3>
                  <p className="text-green-400 text-sm font-semibold">Global Operations Coordination</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-600/20 rounded-full flex items-center justify-center border border-green-500/30">
                    <Satellite size={40} className="text-green-400 sm:w-12 sm:h-12" />
                  </div>
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-4">
                    <div className="text-slate-400 text-xs font-bold tracking-wider mb-2">DEPLOYMENT STATUS</div>
                    <div className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/30 inline-block">
                      🚧 COMING SOON
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-white font-bold text-xl">Global Operations Coordination</h4>
                    <p className="text-slate-400 leading-relaxed">
                      Centralized command and control system for managing global outreach operations, 
                      team coordination, and real-time mission status across all active campaigns.
                    </p>
                    <div className="text-xs text-slate-500 font-mono">
                      ETA: Q2 2025 • Classification: EYES ONLY
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 lg:text-right">
                  <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
                    <div className="text-slate-400 text-xs font-bold mb-2">MISSION SCOPE</div>
                    <div className="space-y-1 text-xs text-slate-300">
                      <div>• Global Team Coordination</div>
                      <div>• Real-time Mission Control</div>
                      <div>• Advanced Analytics Dashboard</div>
                      <div>• Automated Reporting Systems</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="mt-8 text-center">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <div className="text-slate-400 text-xs font-mono tracking-wider">
              CONTROL ROOM v2.0 • OPERATIONAL INTELLIGENCE CENTER • CLASSIFIED ACCESS LEVEL: ALPHA
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemiOps;