import React, { useState } from 'react';
import { Target } from 'lucide-react';
import NicheScanner from '../components/scope/NicheScanner';
import TrendExtractor from '../components/scope/TrendExtractor';
import UserTrailblazer from '../components/scope/UserTrailblazer';
import NicheStashPanel from '../components/scope/NicheStashPanel';

const DemiScope: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'trends' | 'users' | 'stash'>('scanner');

  return (
    <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Target size={28} className="text-primary-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            🎯 DemiScope
          </h1>
        </div>
        <p className="text-gray-600 mt-2">
          Discover high-pain, high-potential niche opportunities and target users across social platforms.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-6 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
            activeTab === 'scanner' 
              ? 'bg-primary-500 text-white border-primary-500 shadow-lg' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
          }`}
        >
          🔎 Niche Scanner
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-6 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
            activeTab === 'trends' 
              ? 'bg-primary-500 text-white border-primary-500 shadow-lg' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
          }`}
        >
          📈 Trend Extractor
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
            activeTab === 'users' 
              ? 'bg-primary-500 text-white border-primary-500 shadow-lg' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
          }`}
        >
          👤 User Trailblazer
        </button>
        <button
          onClick={() => setActiveTab('stash')}
          className={`px-6 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
            activeTab === 'stash' 
              ? 'bg-primary-500 text-white border-primary-500 shadow-lg' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
          }`}
        >
          🗂️ Niche Stash
        </button>
      </div>

      {/* Active Component Display */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === 'scanner' && <NicheScanner />}
        {activeTab === 'trends' && <TrendExtractor />}
        {activeTab === 'users' && <UserTrailblazer />}
        {activeTab === 'stash' && <NicheStashPanel />}
      </div>
    </main>
  );
};

export default DemiScope;