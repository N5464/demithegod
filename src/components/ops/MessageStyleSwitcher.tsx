import React, { useState } from 'react';
import { MessageSquare, Copy } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

const MessageStyleSwitcher: React.FC = () => {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('Bold');
  const [output, setOutput] = useState('');

  const rewriteMessage = () => {
    if (!input.trim()) return;
    
    // Simple manual rewrite based on tone - no AI needed
    let rewritten = input.trim();
    
    switch (tone) {
      case 'Bold':
        rewritten = `🔥 ${rewritten.replace(/\./g, '!')} Let's make this happen!`;
        break;
      case 'Witty':
        rewritten = `😄 ${rewritten} (Just saying what everyone's thinking!)`;
        break;
      case 'Casual':
        rewritten = `Hey! ${rewritten.toLowerCase().replace(/\./g, ' 😊')}`;
        break;
      case 'Professional':
        rewritten = `Dear valued partner, ${rewritten} We look forward to your response.`;
        break;
      case 'Friendly':
        rewritten = `Hi there! ${rewritten} Hope this helps! 🌟`;
        break;
      default:
        rewritten = input;
    }
    
    setOutput(rewritten);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={20} className="text-primary-500" />
        <h2 className="text-lg font-semibold">Message Style Switcher</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original Message
          </label>
          <textarea
            className="input w-full resize-none"
            placeholder="Paste your original message here..."
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tone Style
          </label>
          <select
            className="select w-full"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option>Bold</option>
            <option>Witty</option>
            <option>Casual</option>
            <option>Professional</option>
            <option>Friendly</option>
          </select>
        </div>

        <button 
          className="btn-primary w-full flex items-center justify-center gap-2" 
          onClick={rewriteMessage} 
          disabled={!input.trim()}
        >
          <MessageSquare size={16} />
          <span>Rewrite Message</span>
        </button>

        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rewritten Message
            </label>
            <div className="relative">
              <textarea
                className="w-full p-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-white"
                rows={6}
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Your rewritten message will appear here..."
              />
              <button
                className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
                onClick={() => copyToClipboard(output, 'Message copied!')}
                title="Copy to clipboard"
              >
                <Copy size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageStyleSwitcher;