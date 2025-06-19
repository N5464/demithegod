import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Zap, Command, PenTool, Menu, X, Brain, Target, Crosshair } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const Navigation: React.FC = () => {
  const { isBuilderMode, setIsBuilderMode } = useLeads();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur-xl shadow-2xl sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-8">
            {/* Premium Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="bg-gradient-to-br from-red-600 to-orange-600 p-2.5 rounded-xl shadow-lg border border-red-500/30 group-hover:shadow-red-500/25 transition-all duration-300">
                  <Zap size={24} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>
                  <span className="text-white">DEMI</span><span className="text-red-500">GOD</span>
                </h1>
                <p className="text-xs text-slate-400 font-semibold tracking-wide">COMMAND CENTER</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link 
                to="/strikehub"
                className="group flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
              >
                <div className="bg-red-600/20 p-1.5 rounded-md group-hover:bg-red-600/30 transition-colors">
                  <Crosshair size={16} className="text-red-400" />
                </div>
                <span className="font-semibold text-sm tracking-wide">StrikeHub V2</span>
              </Link>
              
              <Link 
                to="/ops"
                className="group flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
              >
                <div className="bg-blue-600/20 p-1.5 rounded-md group-hover:bg-blue-600/30 transition-colors">
                  <Command size={16} className="text-blue-400" />
                </div>
                <span className="font-semibold text-sm tracking-wide">Control Room</span>
              </Link>
              
              <Link 
                to="/DemiMind"
                className="group flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
              >
                <div className="bg-purple-600/20 p-1.5 rounded-md group-hover:bg-purple-600/30 transition-colors">
                  <Brain size={16} className="text-purple-400" />
                </div>
                <span className="font-semibold text-sm tracking-wide">DemiMind</span>
              </Link>
              
              <Link 
                to="/DemiScope"
                className="group flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
              >
                <div className="bg-green-600/20 p-1.5 rounded-md group-hover:bg-green-600/30 transition-colors">
                  <Target size={16} className="text-green-400" />
                </div>
                <span className="font-semibold text-sm tracking-wide">DemiScope</span>
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Builder Mode Toggle - Desktop */}
            <button
              onClick={() => setIsBuilderMode(!isBuilderMode)}
              className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 border ${
                isBuilderMode 
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-orange-500/50 shadow-lg shadow-orange-500/25' 
                  : 'bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <PenTool size={16} />
              <span className="tracking-wide">BUILDER</span>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50 border border-slate-700/50"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out border-t border-slate-700/50 ${
            isMenuOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <div className="px-4 py-6 space-y-3 bg-slate-900/50 backdrop-blur-sm">
            <Link
              to="/strikehub"
              className="group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="bg-red-600/20 p-2 rounded-md group-hover:bg-red-600/30 transition-colors">
                <Crosshair size={18} className="text-red-400" />
              </div>
              <span className="font-semibold tracking-wide">StrikeHub V2</span>
            </Link>
            
            <Link
              to="/ops"
              className="group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="bg-blue-600/20 p-2 rounded-md group-hover:bg-blue-600/30 transition-colors">
                <Command size={18} className="text-blue-400" />
              </div>
              <span className="font-semibold tracking-wide">Control Room</span>
            </Link>
            
            <Link
              to="/DemiMind"
              className="group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="bg-purple-600/20 p-2 rounded-md group-hover:bg-purple-600/30 transition-colors">
                <Brain size={18} className="text-purple-400" />
              </div>
              <span className="font-semibold tracking-wide">DemiMind</span>
            </Link>
            
            <Link
              to="/DemiScope"
              className="group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white transition-all duration-200 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="bg-green-600/20 p-2 rounded-md group-hover:bg-green-600/30 transition-colors">
                <Target size={18} className="text-green-400" />
              </div>
              <span className="font-semibold tracking-wide">DemiScope</span>
            </Link>
            
            {/* Builder Mode Toggle - Mobile */}
            <button
              onClick={() => {
                setIsBuilderMode(!isBuilderMode);
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 border ${
                isBuilderMode 
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-orange-500/50' 
                  : 'bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-md transition-colors ${
                isBuilderMode ? 'bg-white/20' : 'bg-orange-600/20'
              }`}>
                <PenTool size={18} className={isBuilderMode ? 'text-white' : 'text-orange-400'} />
              </div>
              <span className="tracking-wide">BUILDER MODE</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;