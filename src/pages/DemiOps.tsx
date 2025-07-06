import React from 'react';
import { Command, Shield } from 'lucide-react';
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

        {/* Operations Grid */}
        <div className="space-y-6 sm:space-y-8">
          {/* DemiNotes - Active Tool */}
          <DemiNotes />
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