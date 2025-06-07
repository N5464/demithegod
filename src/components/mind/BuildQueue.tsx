import React, { useState } from 'react';
import { Wrench, Plus, Trash2 } from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  status: 'Idea' | 'Planned' | 'Building' | 'Done';
  createdAt: Date;
}

const statusColors: Record<string, string> = {
  Idea: 'bg-gray-100 text-gray-700 border-gray-200',
  Planned: 'bg-warning-100 text-warning-700 border-warning-200',
  Building: 'bg-primary-100 text-primary-700 border-primary-200',
  Done: 'bg-success-100 text-success-700 border-success-200',
};

const BuildQueue: React.FC = () => {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [newTool, setNewTool] = useState('');
  const [status, setStatus] = useState<'Idea' | 'Planned' | 'Building' | 'Done'>('Idea');

  const addTool = () => {
    if (!newTool.trim()) return;
    
    const tool: ToolItem = {
      id: Date.now().toString(),
      name: newTool.trim(),
      status,
      createdAt: new Date()
    };
    
    setTools(prev => [tool, ...prev]);
    setNewTool('');
    setStatus('Idea');
  };

  const updateStatus = (id: string, newStatus: ToolItem['status']) => {
    setTools(prev => prev.map(tool => 
      tool.id === id ? { ...tool, status: newStatus } : tool
    ));
  };

  const deleteTool = (id: string) => {
    setTools(prev => prev.filter(tool => tool.id !== id));
  };

  const getStatusCounts = () => {
    return {
      Idea: tools.filter(t => t.status === 'Idea').length,
      Planned: tools.filter(t => t.status === 'Planned').length,
      Building: tools.filter(t => t.status === 'Building').length,
      Done: tools.filter(t => t.status === 'Done').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="card">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench size={20} className="text-primary-500" />
            <h2 className="text-lg font-semibold">🛠️ Build Queue</h2>
          </div>
          <div className="text-sm text-gray-600">
            {tools.length} tool{tools.length !== 1 ? 's' : ''} total
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className={`p-3 rounded-lg border text-center ${statusColors[status]}`}>
              <div className="text-lg font-bold">{count}</div>
              <div className="text-xs font-medium">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Tool Form */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Tool</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              className="input"
              placeholder="Tool name (e.g., Lead Scraper, Email Validator)"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTool()}
            />
          </div>
          
          <div>
            <select 
              className="select" 
              value={status} 
              onChange={(e) => setStatus(e.target.value as ToolItem['status'])}
            >
              <option value="Idea">💡 Idea</option>
              <option value="Planned">📋 Planned</option>
              <option value="Building">🔨 Building</option>
              <option value="Done">✅ Done</option>
            </select>
          </div>
          
          <div>
            <button 
              className="btn-primary w-full flex items-center justify-center gap-2" 
              onClick={addTool}
              disabled={!newTool.trim()}
            >
              <Plus size={16} />
              <span>Add Tool</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="max-h-96 overflow-y-auto">
        {tools.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Wrench size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No tools in your build queue</p>
            <p>Your product roadmap starts here. Drop tool ideas and track their progress.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tools.map((tool) => (
              <div key={tool.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900 truncate">
                        {tool.name}
                      </h4>
                      <select
                        className={`text-xs px-2 py-1 rounded-md border font-medium ${statusColors[tool.status]}`}
                        value={tool.status}
                        onChange={(e) => updateStatus(tool.id, e.target.value as ToolItem['status'])}
                      >
                        <option value="Idea">💡 Idea</option>
                        <option value="Planned">📋 Planned</option>
                        <option value="Building">🔨 Building</option>
                        <option value="Done">✅ Done</option>
                      </select>
                    </div>
                    <div className="text-xs text-gray-500">
                      Added {tool.createdAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteTool(tool.id)}
                    className="p-2 text-gray-400 hover:text-error-500 transition-colors rounded-md hover:bg-error-50"
                    title="Delete tool"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildQueue;