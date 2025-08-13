import React, { useState } from 'react';
import { Brain, Shield } from 'lucide-react';
import PasswordGate from '../components/PasswordGate';
import DemiTasks from '../components/mind/DemiTasks';
import MoneyMap from '../components/mind/MoneyMap';

const DemiMind: React.FC = () => {
  const [hasAccess, setHasAccess] = useState(false);

  const handleUnlock = () => {
    setHasAccess(true);
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
        {/* Minimal Lock Interface */}
        <div className="text-center space-y-8 max-w-md w-full">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-purple-600/20 backdrop-blur-sm p-4 rounded-xl border border-purple-500/30">
              <Brain size={32} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>
                DEMI<span className="text-purple-500">MIND</span>
              </h1>
              <p className="text-purple-400 text-sm font-semibold tracking-wide">RESTRICTED ACCESS</p>
            </div>
          </div>

          {/* Minimal Access Gate */}
          <div className="bg-black/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
            <PasswordGate
              zone="demimind"
              title=""
              description=""
              onUnlock={handleUnlock}
              className="p-0"
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 text-xs">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-slate-400 font-mono tracking-wider">VAULT STATUS: LOCKED</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Military Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-purple-500/30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-3 rounded-lg shadow-lg border border-purple-500/50">
                <Brain size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>
                  DEMI<span className="text-purple-500">MIND</span>
                </h1>
                <p className="text-purple-400 text-sm font-semibold tracking-wide">FOUNDER OPERATIONS CENTER</p>
              </div>
            </div>
            <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-400" />
                <span className="text-purple-400 text-sm font-bold tracking-wide">STATUS: OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4 sm:p-6">
            <div className="text-purple-400 text-sm font-bold mb-2 tracking-wide">⚡ MISSION BRIEFING</div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Welcome to DemiMind - your classified founder operations center. 
              <span className="text-purple-400 font-semibold"> Manage strategic finances, development pipeline, and operational tasks.</span>
            </p>
          </div>
        </div>

        {/* Operations Grid */}
        <div className="space-y-8">
          <MoneyMap />
          <DemiTasks />
        </div>

        {/* Status Footer */}
        <div className="mt-8 text-center">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <div className="text-slate-400 text-xs font-mono tracking-wider">
              DEMIMIND v2.0 • FOUNDER OPERATIONS CENTER • CLASSIFICATION: RESTRICTED
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemiMind;