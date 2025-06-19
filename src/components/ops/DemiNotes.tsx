import React, { useState, useEffect } from 'react';
import { Brain, Hash, Trash2, ChevronDown, ChevronUp, Lock, Shield } from 'lucide-react';
import { loadNotesFromSupabase, saveNotesToSupabase, deleteNoteGroup } from '../../services/noteService';
import PasswordGate from '../PasswordGate';
import toast from 'react-hot-toast';

const DemiNotes: React.FC = () => {
  const [input, setInput] = useState('');
  const [notesByTag, setNotesByTag] = useState<Record<string, string[]>>({});
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{ tag: string; index: number } | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [hasAccess, setHasAccess] = useState(false);

  const handleUnlock = () => {
    setHasAccess(true);
    loadNotes();
  };

  const loadNotes = async () => {
    try {
      const notes = await loadNotesFromSupabase();
      setNotesByTag(notes);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load classified notes');
    }
  };

  const handleSave = () => {
    if (!input.trim()) return;

    const lines = input.trim().split('\n');
    let currentTag = '';
    const newNotes = { ...notesByTag };

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('#')) {
        currentTag = trimmedLine.replace('#', '').trim();
        if (!newNotes[currentTag]) newNotes[currentTag] = [];
      } else if (trimmedLine && currentTag) {
        newNotes[currentTag].push(trimmedLine);
      }
    });

    setNotesByTag(newNotes);
    setInput('');
    saveNotesToSupabase(newNotes).then(() => {
      toast.success('Intelligence logged successfully');
    }).catch(error => {
      console.error('Error saving notes:', error);
      toast.error('Failed to log intelligence');
    });
  };

  const handleScrollToTag = (tag: string) => {
    const element = document.getElementById(`tag-${tag}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsTagsOpen(false);
  };

  const handleDeleteTag = async (tag: string) => {
    try {
      await deleteNoteGroup(tag);
      const updated = { ...notesByTag };
      delete updated[tag];
      setNotesByTag(updated);
      toast.success('Intelligence file deleted');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete intelligence file');
    }
  };

  const startEditing = (tag: string, index: number, content: string) => {
    setEditingNote({ tag, index });
    setEditedContent(content);
  };

  const handleEditSave = async () => {
    if (!editingNote) return;

    try {
      const { tag, index } = editingNote;
      const updatedNotes = { ...notesByTag };
      updatedNotes[tag][index] = editedContent;
      setNotesByTag(updatedNotes);
      setEditingNote(null);
      await saveNotesToSupabase(updatedNotes);
      toast.success('Intelligence updated');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update intelligence');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingNote && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    }
  };

  if (!hasAccess) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-500/30 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/30 p-3 rounded-lg border border-blue-500/50">
              <Brain size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                🧠 DEMINOTES VAULT
              </h3>
              <p className="text-blue-400 text-sm font-semibold">Classified Intelligence Storage</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <Lock size={32} className="text-red-400 sm:w-10 sm:h-10" />
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="text-red-400 text-sm font-bold mb-2 tracking-wide">⚠️ RESTRICTED ACCESS ZONE</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                This vault contains classified operational intelligence and strategic notes. 
                <span className="text-red-400 font-semibold"> Security clearance required.</span>
              </p>
            </div>
          </div>
          
          <PasswordGate
            zone="deminotes"
            title=""
            description=""
            onUnlock={handleUnlock}
            className="p-0"
          />
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-slate-400 font-mono tracking-wider">VAULT STATUS: LOCKED</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
      {/* Military Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-500/30 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/30 p-3 rounded-lg border border-blue-500/50">
              <Brain size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                🧠 DEMINOTES VAULT
              </h3>
              <p className="text-blue-400 text-sm font-semibold">Classified Intelligence Storage</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-green-600/20 border border-green-500/50 rounded-lg px-3 py-1">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-green-400" />
                <span className="text-green-400 text-xs font-bold">SECURED</span>
              </div>
            </div>
            
            {Object.keys(notesByTag).length > 0 && (
              <button
                onClick={() => setIsTagsOpen(!isTagsOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-blue-400 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-500/30"
              >
                <Hash size={16} />
                <span className="tracking-wide">TAGS</span>
                {isTagsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tags Navigation */}
      {isTagsOpen && Object.keys(notesByTag).length > 0 && (
        <div className="bg-slate-900/50 border-b border-slate-600/50 p-4">
          <div className="text-slate-400 text-xs font-bold mb-3 tracking-wider">INTELLIGENCE CATEGORIES</div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(notesByTag).map(tag => (
              <button
                key={tag}
                onClick={() => handleScrollToTag(tag)}
                className="px-3 py-1.5 text-xs font-bold bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 transition-colors border border-blue-500/30"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="p-4 sm:p-6 bg-slate-900/30 border-b border-slate-600/50">
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">
              NEW INTELLIGENCE ENTRY
            </label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="#OperationName&#10;Your classified intelligence here..."
              className="w-full h-32 p-4 text-sm font-mono bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              spellCheck="false"
            />
            <div className="text-xs text-slate-500 mt-2">
              Use #TagName to categorize intelligence • Press Enter to log entry
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Brain size={18} />
            <span className="tracking-wide">LOG INTELLIGENCE</span>
          </button>
        </div>
      </div>

      {/* Notes Display */}
      <div className="max-h-[500px] overflow-y-auto">
        {Object.keys(notesByTag).length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Brain size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-lg font-medium mb-2">No intelligence files found</p>
            <p className="text-sm">Begin logging classified operational intelligence and strategic notes.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {Object.entries(notesByTag).map(([tag, notes]) => (
              <div
                key={tag}
                id={`tag-${tag}`}
                className="p-4 sm:p-6 hover:bg-slate-700/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600/20 px-3 py-1 rounded-full border border-blue-500/30">
                      <h4 className="text-sm font-bold text-blue-400 tracking-wide">#{tag}</h4>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {notes.length} entr{notes.length === 1 ? 'y' : 'ies'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTag(tag)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-md hover:bg-red-600/10"
                    title="Delete intelligence file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {notes.map((note, index) => (
                    <div key={index} className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                      {editingNote?.tag === tag && editingNote?.index === index ? (
                        <textarea
                          value={editedContent}
                          onChange={e => setEditedContent(e.target.value)}
                          onBlur={handleEditSave}
                          onKeyDown={handleKeyDown}
                          className="w-full p-3 bg-slate-700/50 border border-blue-500/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-sm"
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => startEditing(tag, index, note)}
                          className="text-slate-300 text-sm leading-relaxed cursor-text hover:bg-slate-600/20 p-2 rounded transition-colors"
                        >
                          {note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-600/50">
        <div className="text-xs text-slate-500 font-mono text-center tracking-wider">
          DEMINOTES v2.0 • CLASSIFIED INTELLIGENCE VAULT • SECURITY LEVEL: ALPHA
        </div>
      </div>
    </div>
  );
};

export default DemiNotes;