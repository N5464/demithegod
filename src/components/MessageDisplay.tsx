import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { copyToClipboard } from '../utils/clipboard';
import OutreachPanel from './OutreachPanel';

const MessageDisplay: React.FC = () => {
  const { generatedMessages, isGeneratingMessages } = useLeads();
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'instagram'>('whatsapp');
  const [editedMessages, setEditedMessages] = useState<{
    whatsapp: string;
    instagram: string;
  }>({ whatsapp: '', instagram: '' });

  // Update edited messages when new messages are generated
  React.useEffect(() => {
    if (generatedMessages) {
      setEditedMessages({
        whatsapp: generatedMessages.whatsapp,
        instagram: generatedMessages.instagram,
      });
    }
  }, [generatedMessages]);

  const handleCopy = (text: string, type: string) => {
    copyToClipboard(text, `${type} message copied!`);
  };

  if (isGeneratingMessages) {
    return (
      <div className="card p-6 flex justify-center items-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-primary-500/20 rounded-full animate-ping-slow"></div>
          <p className="mt-3 text-gray-500">Generating AI messages...</p>
        </div>
      </div>
    );
  }

  if (!generatedMessages) {
    return (
      <div className="card p-6 text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Generated Messages</h2>
        <div className="text-gray-500 p-8">
          <p>Select a lead and generate messages to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold p-4 bg-gray-50 border-b border-gray-200 text-gray-900">
        Generated Messages
      </h2>
      
      <div className="flex border-b border-gray-200">
        <button
          className={`tab ${activeTab === 'whatsapp' ? 'tab-active' : 'tab-inactive'}`}
          onClick={() => setActiveTab('whatsapp')}
        >
          WhatsApp Message
        </button>
        <button
          className={`tab ${activeTab === 'instagram' ? 'tab-active' : 'tab-inactive'}`}
          onClick={() => setActiveTab('instagram')}
        >
          Instagram DM Message
        </button>
      </div>
      
      <div className="p-4">
        {activeTab === 'whatsapp' && (
          <div className="relative">
            <textarea
              className="message-container w-full resize-none font-mono text-sm"
              value={editedMessages.whatsapp}
              onChange={(e) => setEditedMessages(prev => ({ ...prev, whatsapp: e.target.value }))}
            />
            <button
              className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => handleCopy(editedMessages.whatsapp, 'WhatsApp')}
              title="Copy to clipboard"
            >
              <Copy size={16} className="text-gray-600" />
            </button>
          </div>
        )}
        
        {activeTab === 'instagram' && (
          <div className="relative">
            <textarea
              className="message-container w-full resize-none font-mono text-sm"
              value={editedMessages.instagram}
              onChange={(e) => setEditedMessages(prev => ({ ...prev, instagram: e.target.value }))}
            />
            <button
              className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => handleCopy(editedMessages.instagram, 'Instagram')}
              title="Copy to clipboard"
            >
              <Copy size={16} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <OutreachPanel editedMessages={editedMessages} />
      </div>
    </div>
  );
};

export default MessageDisplay;