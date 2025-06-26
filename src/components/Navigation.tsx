import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Zap, Command, PenTool, Menu, X, Brain, Crosshair, Lock, Shield, Database, Eye, EyeOff } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { validateSheetConfig } from '../services/googleSheets';
import toast from 'react-hot-toast';

const Navigation: React.FC = () => {
  const { isBuilderMode, setIsBuilderMode, refreshLeads } = useLeads();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBuilderPanel, setShowBuilderPanel] = useState(false);
  const [builderPassword, setBuilderPassword] = useState('');
  const [isBuilderUnlocked, setIsBuilderUnlocked] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  // Builder form state
  const [googleSheetUrl, setGoogleSheetUrl] = useState(localStorage.getItem('googleSheetUrl') || '');
  const [sheetName, setSheetName] = useState(localStorage.getItem('sheetName') || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleBuilderToggle = () => {
    if (!isBuilderMode) {
      setShowBuilderPanel(true);
      setIsBuilderMode(true);
    } else {
      setShowBuilderPanel(false);
      setIsBuilderMode(false);
      setIsBuilderUnlocked(false);
      setBuilderPassword('');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (builderPassword === 'vault54') {
      setIsBuilderUnlocked(true);
      toast.success('🔓 Builder vault unlocked');
    } else {
      toast.error('❌ Invalid access code');
      setBuilderPassword('');
    }
  };

  const handleSaveConfig = async () => {
    if (!googleSheetUrl || !sheetName || !apiKey) {
      toast.error('All fields required for configuration');
      return;
    }

    setIsValidating(true);
    try {
      await validateSheetConfig(googleSheetUrl, sheetName, apiKey);

      localStorage.setItem('googleSheetUrl', googleSheetUrl);
      localStorage.setItem('sheetName', sheetName);
      localStorage.setItem('apiKey', apiKey);

      await refreshLeads();
      toast.success('✅ Configuration deployed successfully');
    } catch (error) {
      console.error('Configuration error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to validate configuration');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCloseBuilder = () => {
    setShowBuilderPanel(false);
    setIsBuilderMode(false);
    setIsBuilderUnlocked(false);
    setBuilderPassword('');
  };

  return (
    <>
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
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Builder Mode Toggle - Desktop */}
              <button
                onClick={handleBuilderToggle}
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
              
              {/* Builder Mode Toggle - Mobile */}
              <button
                onClick={() => {
                  handleBuilderToggle();
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

      {/* Builder Panel - Military Shadow Drop */}
      {showBuilderPanel && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCloseBuilder}
          ></div>
          
          {/* Builder Panel */}
          <div className="relative bg-slate-900/95 backdrop-blur-xl border border-orange-500/30 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in slide-in-from-top-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-600/30 p-2 rounded-lg border border-orange-500/50">
                    <Database size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-white tracking-wide text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>
                      🔧 BUILDER VAULT
                    </h3>
                    <p className="text-orange-400 text-xs font-semibold">Configuration Access</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseBuilder}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-700/50"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {!isBuilderUnlocked ? (
                /* Password Gate */
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto border border-orange-500/30">
                    <Lock size={20} className="text-orange-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-orange-400 text-xs font-bold tracking-wider">RESTRICTED ACCESS</div>
                    <p className="text-slate-300 text-sm">Enter vault access code</p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <input
                      type="password"
                      value={builderPassword}
                      onChange={(e) => setBuilderPassword(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-center font-mono"
                      placeholder="••••••••"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                    >
                      UNLOCK VAULT
                    </button>
                  </form>
                </div>
              ) : (
                /* Configuration Form */
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={16} className="text-green-400" />
                    <span className="text-green-400 text-xs font-bold">VAULT UNLOCKED</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-300 text-xs font-bold mb-1 tracking-wide">
                        GOOGLE SHEET URL
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm"
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        value={googleSheetUrl}
                        onChange={(e) => setGoogleSheetUrl(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-bold mb-1 tracking-wide">
                        SHEET NAME
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm"
                        placeholder="Sheet1"
                        value={sheetName}
                        onChange={(e) => setSheetName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-bold mb-1 tracking-wide">
                        API KEY
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? "text" : "password"}
                          className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-mono"
                          placeholder="Your API key here"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                        >
                          {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveConfig}
                      disabled={isValidating || !googleSheetUrl || !sheetName || !apiKey}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      {isValidating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>DEPLOYING...</span>
                        </>
                      ) : (
                        <>
                          <Database size={16} />
                          <span>DEPLOY CONFIG</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 text-center font-mono pt-2 border-t border-slate-700/50">
                    BUILDER VAULT v2.0 • CLASSIFIED
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;