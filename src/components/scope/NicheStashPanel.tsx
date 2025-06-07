import React, { useState, useEffect } from 'react';
import { Archive, Plus, Trash2, Tag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface NicheEntry {
  id: string;
  niche: string;
  tags: string[];
  notes: string;
  createdAt: Date;
  platform?: string;
  painPoint?: string;
}

const NicheStashPanel: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [platform, setPlatform] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [stash, setStash] = useState<NicheEntry[]>([]);
  const [filterTag, setFilterTag] = useState('');

  // Load stash from localStorage on component mount
  useEffect(() => {
    const savedStash = localStorage.getItem('nicheStash');
    if (savedStash) {
      try {
        const parsed = JSON.parse(savedStash);
        setStash(parsed.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt)
        })));
      } catch (error) {
        console.error('Error loading niche stash:', error);
      }
    }
  }, []);

  // Save stash to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nicheStash', JSON.stringify(stash));
  }, [stash]);

  const saveToStash = () => {
    if (!niche.trim()) {
      toast.error('Niche description cannot be empty');
      return;
    }

    const newEntry: NicheEntry = {
      id: Date.now().toString(),
      niche: niche.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      notes: notes.trim(),
      platform: platform.trim(),
      painPoint: painPoint.trim(),
      createdAt: new Date(),
    };

    setStash(prev => [newEntry, ...prev]);
    
    // Clear form
    setNiche('');
    setTags('');
    setNotes('');
    setPlatform('');
    setPainPoint('');
    
    toast.success('✅ Niche saved to stash!');
  };

  const deleteEntry = (id: string) => {
    setStash(prev => prev.filter(entry => entry.id !== id));
    toast.success('Niche removed from stash');
  };

  const clearStash = () => {
    if (window.confirm('Are you sure you want to clear all saved niches?')) {
      setStash([]);
      toast.success('Stash cleared');
    }
  };

  // Get all unique tags for filtering
  const allTags = Array.from(new Set(stash.flatMap(entry => entry.tags))).filter(Boolean);

  // Filter stash based on selected tag
  const filteredStash = filterTag 
    ? stash.filter(entry => entry.tags.includes(filterTag))
    : stash;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Add New Niche Form */}
      <div className="card">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Archive size={20} className="text-primary-500" />
              <h2 className="text-lg font-semibold">🗂️ Niche Stash Panel</h2>
            </div>
            <div className="text-sm text-gray-600">
              {stash.length} niche{stash.length !== 1 ? 's' : ''} saved
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Save and organize discovered niches for future reference and development
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niche Description *
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Automated booking system for tattoo studios"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform Source
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Reddit, X, LinkedIn"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. 🧠 AI, 🔁 Automation, 💰 High-Value"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pain Point
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Manual booking leads to double bookings and lost revenue"
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                className="input min-h-[100px] resize-none"
                placeholder="Additional insights, market size, competition analysis, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={saveToStash}
            disabled={!niche.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            <span>Save to Stash</span>
          </button>
        </div>
      </div>

      {/* Filter and Actions */}
      {stash.length > 0 && (
        <div className="card">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Saved Niches</h3>
              <button
                onClick={clearStash}
                className="text-sm text-error-500 hover:text-error-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTag('')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterTag === ''
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({stash.length})
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filterTag === tag
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag} ({stash.filter(entry => entry.tags.includes(tag)).length})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stash List */}
      <div className="space-y-4">
        {filteredStash.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">
            <Archive size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">
              {stash.length === 0 ? 'No niches saved yet' : 'No niches match the selected filter'}
            </p>
            <p>
              {stash.length === 0 
                ? 'Start building your niche database by saving discoveries from Scanner, Trends, and Trailblazer tools.'
                : 'Try selecting a different tag filter or clear the filter to see all niches.'
              }
            </p>
          </div>
        ) : (
          filteredStash.map((entry) => (
            <div key={entry.id} className="card">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {entry.niche}
                      </h4>
                      {entry.platform && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                          {entry.platform}
                        </span>
                      )}
                    </div>

                    {entry.painPoint && (
                      <div className="mb-3">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pain Point</span>
                        </div>
                        <p className="text-sm text-gray-700 bg-error-50 p-2 rounded border-l-4 border-error-200">
                          {entry.painPoint}
                        </p>
                      </div>
                    )}

                    {entry.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <Tag size={14} className="text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.notes && (
                      <div className="mb-3">
                        <div className="flex items-center gap-1 mb-1">
                          <FileText size={14} className="text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</span>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {entry.notes}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Saved {entry.createdAt.toLocaleDateString('en-US', {
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
                    className="p-2 text-gray-400 hover:text-error-500 transition-colors rounded-md hover:bg-error-50"
                    title="Delete niche"
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