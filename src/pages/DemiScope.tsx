import React, { useState } from 'react';
import { Target, Crosshair, Search, TrendingUp, Users, Archive } from 'lucide-react';
import PasswordGate from '../components/PasswordGate';
import NicheScanner from '../components/scope/NicheScanner';
import TrendExtractor from '../components/scope/TrendExtractor';
import UserTrailblazer from '../components/scope/UserTrailblazer';
import NicheStashPanel from '../components/scope/NicheStashPanel';

const DemiScope: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'trends' | 'users' | 'stash'>('scanner');
  const [hasAccess, setHasAccess] = useState(false);

  const handleUnlock = () => {
    setHasAccess(true);
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-center space-y-6 px-4">
        {/* Military-Style Header */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 sm:p-8 max-w-md w-full">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-green-600 p-3 rounded-lg shadow-lg">
              <Target size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>
                DEMI<span className="text-green-500">SCOPE</span>
              </h1>
              <p className="text-green-400 text-xs sm:text-sm font-semibold tracking-wide">RECONNAISSANCE DIVISION</p>
            </div>
          </div>

          {/* Military Access Control */}
          <div className="space-y-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 text-sm font-bold mb-2 tracking-wide">⚠️ RESTRICTED INTELLIGENCE ZONE</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                This sector contains active reconnaissance operations and target intelligence. 
                <span className="text-green-400 font-semibold"> Security clearance required.</span>
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
              <div className="text-slate-300 text-xs font-bold mb-2 tracking-wide">RECON PROTOCOL</div>
              <p className="text-slate-400 text-xs">
                Enter authorization code to access niche discovery tools and target acquisition systems.
              </p>
            </div>
          </div>

          {/* Military-Styled Password Gate */}
          <div className="mt-6">
            <PasswordGate
              zone="demiscope"
              title=""
              description=""
              onUnlock={handleUnlock}
              className="p-0"
            />
          </div>

          {/* Status Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-400 font-mono tracking-wider">RECON STATUS: LOCKED</span>
          </div>
        </div>

        {/* Military Footer */}
        <div className="text-slate-500 text-xs font-mono tracking-wider max-w-md text-center">
          <div className="border-t border-slate-700/50 pt-4">
            DEMISCOPE v2.0 • RECONNAISSANCE OPERATIONS MODULE
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'scanner' as const,
      name: 'NICHE SCANNER',
      icon: Search,
      color: 'from-blue-600/20 to-cyan-600/20',
      borderColor: 'border-blue-500/30',
      activeColor: 'from-blue-600 to-cyan-600',
      iconColor: 'text-blue-400'
    },
    {
      id: 'trends' as const,
      name: 'TREND EXTRACTOR',
      icon: TrendingUp,
      color: 'from-orange-600/20 to-red-600/20',
      borderColor: 'border-orange-500/30',
      activeColor: 'from-orange-600 to-red-600',
      iconColor: 'text-orange-400'
    },
    {
      id: 'users' as const,
      name: 'USER TRAILBLAZER',
      icon: Users,
      color: 'from-purple-600/20 to-pink-600/20',
      borderColor: 'border-purple-500/30',
      activeColor: 'from-purple-600 to-pink-600',
      iconColor: 'text-purple-400'
    },
    {
      id: 'stash' as const,
      name: 'NICHE STASH',
      icon: Archive,
      color: 'from-emerald-600/20 to-green-600/20',
      borderColor: 'border-emerald-500/30',
      activeColor: 'from-emerald-600 to-green-600',
      iconColor: 'text-emerald-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Military Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-green-500/30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-3 rounded-lg shadow-lg border border-green-500/50">
                <Target size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>
                  DEMI<span className="text-green-500">SCOPE</span>
                </h1>
                <p className="text-green-400 text-sm font-semibold tracking-wide">RECONNAISSANCE OPERATIONS CENTER</p>
              </div>
            </div>
            <div className="bg-green-600/20 border border-green-500/50 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Crosshair size={16} className="text-green-400" />
                <span className="text-green-400 text-sm font-bold tracking-wide">RECON: ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4 sm:p-6">
            <div className="text-green-400 text-sm font-bold mb-2 tracking-wide">⚡ MISSION BRIEFING</div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Welcome to DemiScope - your reconnaissance operations center. 
              <span className="text-green-400 font-semibold"> Discover high-value targets and strategic opportunities across digital battlefields.</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation - Military Style */}
        <div className="mb-8">
          <div className="text-slate-400 text-xs font-bold mb-4 tracking-wider">RECONNAISSANCE MODULES</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.activeColor} border-white/30 shadow-lg` 
                      : `bg-gradient-to-r ${tab.color} ${tab.borderColor} hover:border-white/20 hover:shadow-md`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-black/20'} transition-colors`}>
                      <tab.icon size={20} className={isActive ? 'text-white' : tab.iconColor} />
                    </div>
                    <div className="text-left">
                      <div className={`font-black text-sm tracking-wide ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {tab.name}
                      </div>
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Component Display */}
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === 'scanner' && <NicheScanner />}
          {activeTab === 'trends' && <TrendExtractor />}
          {activeTab === 'users' && <UserTrailblazer />}
          {activeTab === 'stash' && <NicheStashPanel />}
        </div>

        {/* Status Footer */}
        <div className="mt-8 text-center">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <div className="text-slate-400 text-xs font-mono tracking-wider">
              DEMISCOPE v2.0 • RECONNAISSANCE OPERATIONS CENTER • CLASSIFICATION: SECRET
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemiScope;