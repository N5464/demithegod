import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Trash2, Cog } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = 'https://tawbsjqosxdtqsskaddy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd2JzanFvc3hkdHFzc2thZGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzMwMjAsImV4cCI6MjA2NDU0OTAyMH0.ASP0YqSdpcLj_FmLyOyme1iLYm2Z8CbJyrNJVREiZ6U';
const supabase = createClient(supabaseUrl, supabaseKey);

interface ToolItem {
  id: string;
  tool_name: string;
  status: 'Idea' | 'Planned' | 'Building' | 'Done';
  created_at: Date;
  user_id: string;
}

const statusColors: Record<string, string> = {
  Idea: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
  Planned: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
  Building: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
  Done: 'bg-green-600/20 text-green-400 border-green-500/30',
};

const BuildQueue: React.FC = () => {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTool, setNewTool] = useState('');
  const [status, setStatus] = useState<'Idea' | 'Planned' | 'Building' | 'Done'>('Idea');

  // Hardcoded user ID to match RLS policy
  const userId = 'demigod_owner';

  // Fetch tools from Supabase
  const fetchTools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('buildqueue')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedTools = data?.map(tool => ({
        ...tool,
        created_at: new Date(tool.created_at)
      })) || [];

      setTools(formattedTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast.error('Failed to load development queue');
    } finally {
      setLoading(false);
    }
  };

  // Add new tool to Supabase
  const addTool = async () => {
    if (!newTool.trim()) {
      toast.error('Tool name required for queue entry');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('buildqueue')
        .insert([
          {
            user_id: userId,
            tool_name: newTool.trim(),
            status: status,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state
      const formattedTool: ToolItem = {
        ...data,
        created_at: new Date(data.created_at)
      };

      setTools(prev => [formattedTool, ...prev]);
      
      // Reset form
      setNewTool('');
      setStatus('Idea');
      
      toast.success('Tool added to development queue');
    } catch (error) {
      console.error('Error adding tool:', error);
      toast.error('Failed to add tool to queue');
    }
  };

  // Update tool status in Supabase
  const updateStatus = async (id: string, newStatus: ToolItem['status']) => {
    try {
      const { error } = await supabase
        .from('buildqueue')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setTools(prev => prev.map(tool => 
        tool.id === id ? { ...tool, status: newStatus } : tool
      ));

      toast.success('Development status updated');
    } catch (error) {
      console.error('Error updating tool status:', error);
      toast.error('Failed to update status');
    }
  };

  // Delete tool from Supabase
  const deleteTool = async (id: string) => {
    try {
      const { error } = await supabase
        .from('buildqueue')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setTools(prev => prev.filter(tool => tool.id !== id));
      toast.success('Tool removed from queue');
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to remove tool');
    }
  };

  // Load tools on component mount
  useEffect(() => {
    fetchTools();
  }, []);

  const getStatusCounts = () => {
    return {
      Idea: tools.filter(t => t.status === 'Idea').length,
      Planned: tools.filter(t => t.status === 'Planned').length,
      Building: tools.filter(t => t.status === 'Building').length,
      Done: tools.filter(t => t.status === 'Done').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-orange-500/20 rounded-full animate-ping-slow"></div>
          <p className="mt-3 text-slate-400">Loading development queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/30 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600/30 p-3 rounded-lg border border-orange-500/50">
              <Wrench size={24} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                🛠️ BUILD QUEUE
              </h2>
              <p className="text-orange-400 text-sm font-semibold">Development Pipeline</p>
            </div>
          </div>
          <div className="text-slate-300 text-sm">
            <span className="font-bold">{tools.length}</span> tool{tools.length !== 1 ? 's' : ''} queued
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="p-4 sm:p-6 bg-slate-900/30 border-b border-slate-600/50">
        <div className="text-slate-400 text-xs font-bold mb-3 tracking-wider">DEVELOPMENT STATUS</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className={`p-3 rounded-lg border text-center ${statusColors[status]}`}>
              <div className="text-lg font-black">{count}</div>
              <div className="text-xs font-bold tracking-wide">{status.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Tool Form */}
      <div className="p-4 sm:p-6 bg-slate-900/30 border-b border-slate-600/50">
        <h3 className="text-slate-300 text-sm font-bold mb-4 tracking-wide">
          ADD NEW DEVELOPMENT TOOL
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="Tool name (e.g., Lead Scraper, Email Validator)"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTool()}
            />
          </div>
          
          <div>
            <select 
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" 
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
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50" 
              onClick={addTool}
              disabled={!newTool.trim()}
            >
              <Plus size={16} />
              <span className="tracking-wide">ADD TOOL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="max-h-96 overflow-y-auto">
        {tools.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Cog size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-lg font-medium mb-2">No tools in development queue</p>
            <p className="text-sm">Your product roadmap starts here. Queue tool ideas and track development progress.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {tools.map((tool) => (
              <div key={tool.id} className="p-4 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-white truncate">
                        {tool.tool_name}
                      </h4>
                      <select
                        className={`text-xs px-3 py-1 rounded-full border font-bold ${statusColors[tool.status]}`}
                        value={tool.status}
                        onChange={(e) => updateStatus(tool.id, e.target.value as ToolItem['status'])}
                      >
                        <option value="Idea">💡 IDEA</option>
                        <option value="Planned">📋 PLANNED</option>
                        <option value="Building">🔨 BUILDING</option>
                        <option value="Done">✅ DONE</option>
                      </select>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Queued {tool.created_at.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteTool(tool.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-md hover:bg-red-600/10"
                    title="Remove from queue"
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