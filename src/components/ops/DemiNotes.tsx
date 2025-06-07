import React, { useState, useEffect } from 'react';
import { Brain, Hash, Trash2, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { loadNotesFromSupabase, saveNotesToSupabase, deleteNoteGroup } from '../../services/noteService';
import toast from 'react-hot-toast';

const DemiNotes: React.FC = () => {
  const [input, setInput] = useState('');
  const [notesByTag, setNotesByTag] = useState<Record<string, string[]>>({});
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<{ tag: string; index: number } | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');

  const handleUnlock = () => {
    if (passcode === 'annuslutbaby') {
      setIsUnlocked(true);
      loadNotes();
      toast.success('Vault unlocked');
    } else {
      toast.error('Access Denied');
      setPasscode('');
    }
  };

  const loadNotes = async () => {
    try {
      const notes = await loadNotesFromSupabase();
      setNotesByTag(notes);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes');
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
      toast.success('Note saved successfully');
    }).catch(error => {
      console.error('Error saving notes:', error);
      toast.error('Failed to save note');
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
      toast.success('Tag deleted');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
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
      toast.success('Note updated');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isUnlocked) {
        e.preventDefault();
        handleUnlock();
      } else if (editingNote && !e.shiftKey) {
        e.preventDefault();
        handleEditSave();
      }
    }
  };

  if (!isUnlocked) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 mb-6">
          <Lock size={24} className="text-primary-500" />
          <h2 className="text-lg font-semibold">Enter Vault Passcode to Unlock DemiNotes</h2>
        </div>
        <div className="w-full max-w-md">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input w-full mb-4"
            placeholder="Enter passcode"
            autoFocus
          />
          <button
            onClick={handleUnlock}
            className="btn-primary w-full"
          >
            Unlock Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-primary-500" />
          <h2 className="text-lg font-semibold">DemiNotes Panel</h2>
        </div>
        {Object.keys(notesByTag).length > 0 && (
          <button
            onClick={() => setIsTagsOpen(!isTagsOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Hash size={16} />
            <span>Tags</span>
            {isTagsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {isTagsOpen && Object.keys(notesByTag).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {Object.keys(notesByTag).map(tag => (
            <button
              key={tag}
              onClick={() => handleScrollToTag(tag)}
              className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="#TagName&#10;Your note here..."
          className="w-full h-32 p-4 text-sm font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          spellCheck="false"
        />

        <button
          onClick={handleSave}
          disabled={!input.trim()}
          className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save Note
        </button>

        <div className="mt-8 space-y-6 max-h-[500px] overflow-y-auto">
          {Object.entries(notesByTag).map(([tag, notes]) => (
            <div
              key={tag}
              id={`tag-${tag}`}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-primary-600">#{tag}</h3>
                <button
                  onClick={() => handleDeleteTag(tag)}
                  className="p-1 text-gray-400 hover:text-error-500 transition-colors"
                  title="Delete tag"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <ul className="space-y-2">
                {notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {editingNote?.tag === tag && editingNote?.index === index ? (
                      <textarea
                        value={editedContent}
                        onChange={e => setEditedContent(e.target.value)}
                        onBlur={handleEditSave}
                        onKeyDown={handleKeyDown}
                        className="w-full p-2 border border-primary-200 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => startEditing(tag, index, note)}
                        className="p-2 rounded hover:bg-gray-50 cursor-text"
                      >
                        {note}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        Pro tip: Start a new section with #tag to organize your notes. Click on tags to quickly navigate!
      </div>
    </div>
  );
};

export default DemiNotes;