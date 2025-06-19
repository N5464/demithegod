import React, { useState, useEffect } from 'react';
import { Archive, Plus, Trash2, Tag, FileText, Database } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = 'https://tawbsjqosxdtqsskaddy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd2JzanFvc3hkdHFzc2thZGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzMwMjAsImV4cCI6MjA2NDU0OTAyMH0.ASP0YqSdpcLj_FmLyOyme1iLYm2Z8CbJyrNJVREiZ6U';
const supabase = createClient(supabaseUrl, supabaseKey);

interface NicheEntry {
  id: string;
  description: string;
  source?: string;
  pain_point?: string;
  tags: string;
  notes?: string;
  created_at: Date;
  user_id: string;
}

const NicheStashPanel: React.FC = () => {
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [stash, setStash] = useState<NicheEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState('');

  // Hardcoded user ID to match RLS policy
  const userId = 'demigod_owner';

  // Fetch niches from Supabase
  const fetchNiches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('nichestash')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedNiches = data?.map(niche => ({
        ...niche,
        created_at: new Date(niche.created_at)
      })) || [];

      setStash(formattedNiches);
    } catch (error) {
      console.error('Error fetching niches:', error);
      toast.error('Failed to load intelligence stash');
    } finally {
      setLoading(false);
    }
  };

  // Load niches on component mount
  useEffect(() => {
    fetchNiches();
  }, []);

  // Add new niche to Supabase
  const saveToStash = async () => {
    if (!description.trim()) {
      toast.error('Target description required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('nichestash')
        .insert([
          {
            user_id: userId,
            description: description.trim(),
            source: source.trim() || null,
            pain_point: painPoint.trim() || null,
            tags: tags.trim(),
            notes: notes.trim() || null
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state
      const formattedNiche: NicheEntry = {
        ...data,
        created_at: new Date(data.created_at)
      };

      setStash(prev => [formattedNiche, ...prev]);
      
      // Clear form
      setDescription('');
      setTags('');
      setNotes('');
      setSource('');
      setPainPoint('');
      
      toast.success('Target intelligence logged successfully');
    } catch (error) {
      console.error('Error saving niche:', error);
      toast.error('Failed to log target intelligence');
    }
  };

  // Delete niche from Supabase
  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('nichestash')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setStash(prev => prev.filter(entry => entry.id !== id));
      toast.success('Target intelligence deleted');
    } catch (error) {
      console.error('Error deleting niche:', error);
      toast.error('Failed to delete intelligence');
    }
  };

  // Clear all niches
  const clearStash = async () => {
    if (window.confirm('Are you sure you want to clear all target intelligence?')) {
      try {
        const { error } = await supabase
          .from('nichestash')
          .delete()
          .eq('user_id', userId);

        if (error) {
          throw error;
        }

        setStash([]);
        toast.success('Intelligence stash cleared');
      } catch (error) {
        console.error('Error clearing stash:', error);
        toast.error('Failed to clear stash');
      }
    }
  };

  // Get all unique tags for filtering
  const allTags = Array.from(new Set(
    stash.flatMap(entry => 
      entry.tags ? entry.tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : []
    )
  )).filter(Boolean);

  // Filter stash based on selected tag
  const filteredStash = filterTag 
    ? stash.filter(entry => 
        entry.tags && entry.tags.split(',').map(t => t.trim()).includes(filterTag)
      )
    : stash;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 bg-emerald-500/20 rounded-full animate-ping-slow"></div>
            <p className="mt-3 text-slate-400">Loading intelligence stash...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Add New Niche Form */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-b border-emerald-500/30 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600/30 p-3 rounded-lg border border-emerald-500/50">
                <Database size={24} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                  🗂️ INTELLIGENCE STASH
                </h2>
                <p className="text-emerald-400 text-sm font-semibold">Target Database Management</p>
              </div>
            </div>
            <div className="text-slate-300 text-sm">
              <span className="font-bold">{stash.length}</span> target{stash.length !== 1 ? 's' : ''} logged
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">
                TARGET DESCRIPTION *
              </label>
              <input
                type="text"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="e.g. Automated booking system for tattoo studios"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">
                PLATFORM SOURCE
              </label>
              <input
                type="text"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="e.g. Reddit, X, LinkedIn"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">
                CLASSIFICATION TAGS
              </label>
              <input
                type="text"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="e.g. 🧠 AI, 🔁 Automation, 💰 High-Value"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Separate with commas</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">
                PAIN VECTOR
              </label>
              <input
                type="text"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="e.g. Manual booking leads to double bookings and lost revenue"
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">
                INTELLIGENCE NOTES
              </label>
              <textarea
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 min-h-[100px] resize-none"
                placeholder="Additional insights, market size, competition analysis, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={saveToStash}
            disabled={!description.trim()}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span className="tracking-wide">LOG TARGET INTELLIGENCE</span>
          </button>
        </div>
      </div>

      {/* Filter and Actions */}
      {stash.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
          <div className="bg-slate-900/50 border-b border-slate-600/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                LOGGED INTELLIGENCE
              </h3>
              <button
                onClick={clearStash}
                className="text-sm text-red-400 hover:text-red-300 transition-colors font-bold"
              >
                CLEAR ALL
              </button>
            </div>
            
            <div className="text-slate-400 text-xs font-bold mb-3 tracking-wider">CLASSIFICATION FILTERS</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTag('')}
                className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  filterTag === ''
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
                }`}
              >
                ALL ({stash.length})
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                    filterTag === tag
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
                  }`}
                >
                  {tag} ({stash.filter(entry => 
                    entry.tags && entry.tags.split(',').map(t => t.trim()).includes(tag)
                  ).length})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stash List */}
      <div className="space-y-4">
        {filteredStash.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center text-slate-400">
            <Archive size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-lg font-medium mb-2">
              {stash.length === 0 ? 'No intelligence logged yet' : 'No targets match the selected filter'}
            </p>
            <p className="text-sm">
              {stash.length === 0 
                ? 'Start building your target intelligence database by logging discoveries from Scanner, Trends, and Trailblazer tools.'
                : 'Try selecting a different classification filter or clear the filter to see all targets.'
              }
            </p>
          </div>
        ) : (
          filteredStash.map((entry) => (
            <div key={entry.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-black text-white text-lg">
                        {entry.description}
                      </h4>
                      {entry.source && (
                        <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full font-bold border border-blue-500/30">
                          {entry.source}
                        </span>
                      )}
                    </div>

                    {entry.pain_point && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-red-400 uppercase tracking-wide">PAIN VECTOR</span>
                        </div>
                        <p className="text-sm text-slate-300 bg-red-600/10 p-3 rounded-lg border-l-4 border-red-500/50">
                          {entry.pain_point}
                        </p>
                      </div>
                    )}

                    {entry.tags && (
                      <div className="flex items-center gap-2 mb-4">
                        <Tag size={14} className="text-slate-500" />
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.split(',').map(t => t.trim()).filter(t => t.length > 0).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.notes && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={14} className="text-slate-500" />
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">INTELLIGENCE NOTES</span>
                        </div>
                        <p className="text-sm text-slate-300 bg-slate-700/30 p-3 rounded-lg">
                          {entry.notes}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-slate-500 font-mono">
                      Logged {entry.created_at.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-md hover:bg-red-600/10"
                    title="Delete intelligence"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NicheStashPanel;