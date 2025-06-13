import React, { useState } from 'react';
import { Search, Target, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const NicheScanner: React.FC = () => {
  const [platform, setPlatform] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const handleGenerate = async () => {
    if (!platform || !keyword) {
      toast.error('Enter platform and keyword');
      return;
    }
    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an AI-powered niche carving agent.

Your job is to analyze public discussions on social platforms and extract underserved niches with real pain points.

Input:
Platform: \${platform}
Topic or Keyword: \${topic}

Output Format:
Niche Opportunity:
• Description – A concise explanation of the niche or problem  
• Pain Point – The core issue or struggle being discussed  
• Post/Comment Context – A sample post/comment summary or quote  
• Automation Angle – A potential automation or AI-based solution  
• Profile Link (if possible) – A relevant user or account involved in the discussion  

Write this in a structured, insight-heavy tone like an analyst preparing an ops report. Make it useful for a solo founder scouting for automation opportunities.`,
            },
            {
              role: 'user',
              content: `Platform: ${platform}\nKeyword: ${keyword}`,
            },
          ],
        }),
      });

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      setOutput(text || 'No results');
      toast.success('Niche analysis complete! 🎯');
    } catch (err) {
      console.error('Error generating niche:', err);
      toast.error('Error generating niche analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-primary-500" />
            <h2 className="text-lg font-semibold">🎯 Niche Scanner</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Discover high-pain, high-potential niche opportunities across platforms
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Reddit, X, Threads, LinkedIn"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keyword or Topic
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. booking issues, client management"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <button
            className="btn-primary w-full flex items-center justify-center gap-2 group relative overflow-hidden"
            onClick={handleGenerate}
            disabled={loading || !platform || !keyword}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Carving Niche...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Carve Niche</span>
              </>
            )}
          </button>
        </div>
      </div>

      {output && (
        <div className="card">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Niche Analysis Results</h3>
          </div>
          <div className="p-6">
            <textarea
              className="w-full min-h-[300px] p-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-white font-mono"
              value={output}
              readOnly
              placeholder="Your niche analysis will appear here..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NicheScanner;