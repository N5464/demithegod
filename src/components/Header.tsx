import React from 'react';
import { Zap, PenTool as Tool } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const Header: React.FC = () => {
  const { isBuilderMode, setIsBuilderMode } = useLeads();

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary-500 p-1.5 rounded text-white">
            <Zap size={20} />
          </div>
          <h1 className="text-xl font-bold">
            <span className="text-primary-500">Demi</span>God
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            AI Outreach Generator
          </div>
          <button
            onClick={() => setIsBuilderMode(!isBuilderMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              isBuilderMode 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Tool size={16} />
            <span className="text-sm font-medium">Builder</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;