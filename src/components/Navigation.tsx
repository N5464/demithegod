import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Zap, Command, PenTool, Menu, X, Brain, Target } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const Navigation: React.FC = () => {
  const { isBuilderMode, setIsBuilderMode } = useLeads();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-500 p-1.5 rounded text-white">
                <Zap size={20} />
              </div>
              <h1 className="text-xl font-bold">
                <span className="text-primary-500">Demi</span>God
              </h1>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link 
                to="/ops"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary-500 transition-colors rounded-md hover:bg-gray-50"
              >
                <Command size={18} />
                <span className="font-medium">DemiOps Control Room</span>
              </Link>
              <Link 
                to="/DemiMind"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary-500 transition-colors rounded-md hover:bg-gray-50"
              >
                <Brain size={18} />
                <span className="font-medium">🧠 DemiMind</span>
              </Link>
              <Link 
                to="/DemiScope"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary-500 transition-colors rounded-md hover:bg-gray-50"
              >
                <Target size={18} />
                <span className="font-medium">🎯 DemiScope</span>
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBuilderMode(!isBuilderMode)}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                isBuilderMode 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <PenTool size={16} />
              <span className="text-sm font-medium">Builder</span>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-500 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden fixed inset-x-0 top-[57px] bg-white border-b border-gray-200 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="p-4 space-y-4">
            <Link
              to="/ops"
              className="flex items-center gap-2 px-3 py-2.5 text-gray-600 hover:text-primary-500 transition-colors rounded-md hover:bg-gray-50 w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Command size={18} />
              <span className="font-medium">DemiOps Control Room</span>
            </Link>
            
            <Link
              to="/DemiMind"
              className="flex items-center gap-2 px-3 py-2.5 text-gray-600 hover:text-primary-500 transition-colors rounded-md hover:bg-gray-50 w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Brain size={18} />
              <span className="font-medium">🧠 DemiMind</span>
            </Link>
            
            <Link
              to="/DemiScope"
              className="flex items-center gap-2 px-3 py-2.5 text-gray-600 hover:text-primary-500 transition-colors rounded-md hover:bg-gray-50 w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Target size={18} />
              <span className="font-medium">🎯 DemiScope</span>
            </Link>
            
            <button
              onClick={() => {
                setIsBuilderMode(!isBuilderMode);
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-md transition-colors w-full ${
                isBuilderMode 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <PenTool size={16} />
              <span className="text-sm font-medium">Builder</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;