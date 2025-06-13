import React, { useState } from 'react';
import { MessageSquare, Sparkles, Copy } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

const MessageStyleSwitcher: React.FC = () => {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('Bold');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const rewriteMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You're an expert email tone editor. Your job is to rewrite messages in different styles.`,
            },
            {
              role: 'user',
              content: `Rewrite this message in a ${tone} tone:\n\n${input}`,
            },
          ],
        }),
      });

      const data = await res.json();
      const final = data.choices?.[0]?.message?.content?.trim();
      setOutput(final || 'Failed to generate.');
    } catch (err) {
      setOutput('Error occurred while generating.');
    } finally {
      setLoading(false);
    }
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
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Rewriting...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Rewrite Message</span>
            </>
          )}
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