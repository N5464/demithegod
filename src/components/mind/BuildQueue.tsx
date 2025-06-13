import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Trash2 } from 'lucide-react';
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
  Idea: 'bg-gray-100 text-gray-700 border-gray-200',
  Planned: 'bg-warning-100 text-warning-700 border-warning-200',
  Building: 'bg-primary-100 text-primary-700 border-primary-200',
  Done: 'bg-success-100 text-success-700 border-success-200',
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
      toast.error('Failed to load build queue');
    } finally {
      setLoading(false);
    }
  };

  // Add new tool to Supabase
  const addTool = async () => {
    if (!newTool.trim()) {
      toast.error('Tool name is required');
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
      
      toast.success('Tool added to build queue');
    } catch (error) {
      console.error('Error adding tool:', error);
      toast.error('Failed to add tool');
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

      toast.success('Tool status updated');
    } catch (error) {
      console.error('Error updating tool status:', error);
      toast.error('Failed to update tool status');
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
      toast.success('Tool removed from build queue');
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool');
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
      <div className="card p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-primary-500/20 rounded-full animate-ping-slow"></div>
          <p className="mt-3 text-gray-500">Loading build queue...</p>
        </div>
      </div>
    );
  }

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
                        {tool.tool_name}
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
                      Added {tool.created_at.toLocaleDateString('en-US', {
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