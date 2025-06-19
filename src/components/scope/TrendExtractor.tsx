import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import toast from 'react-hot-toast';

const TrendExtractor: React.FC = () => {
  const [platform, setPlatform] = useState('');
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');

  const handleExtract = () => {
    if (!platform || !keyword) {
      toast.error('Please fill in both fields.');
      return;
    }

    // Generate a sample trend analysis template
    const trendTemplate = `Trend Analysis Template:

Platform: ${platform}
Keyword/Hashtag: ${keyword}

Trend Insight
• Summary – Manual research needed to identify what's trending around "${keyword}" on ${platform}
• Engagement Type – Look for Problems / Questions / Complaints in discussions
• Example Post/Comment – Document specific posts showing the trend (requires manual research)
• Potential Hook – Identify how this trend can be leveraged for automation or content

Research Steps:
1. Search ${platform} for recent posts about "${keyword}"
2. Analyze engagement patterns (likes, comments, shares)
3. Identify common pain points or questions
4. Document trending hashtags and keywords
5. Note influential users driving the conversation
6. Look for automation opportunities in the discussions

Manual Research Required:
- Visit ${platform} and search for "${keyword}"
- Sort by recent/trending posts
- Analyze top-performing content
- Document specific examples and insights

Note: This is a research template. Replace with actual findings from your manual analysis.`;

    setResult(trendTemplate);
    toast.success('Trend research template generated! 🔥');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-primary-500" />
            <h2 className="text-lg font-semibold">🔥 Trend Extractor</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Generate research templates for analyzing trending discussions and engagement patterns
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
                Keyword or Hashtag
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. #productivity, client complaints"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <button
            className="btn-primary w-full flex items-center justify-center gap-2 group relative overflow-hidden"
            onClick={handleExtract}
            disabled={!platform || !keyword}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            <Flame size={18} />
            <span>Generate Research Template</span>
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Research Template</h3>
          </div>
          <div className="p-6">
            <textarea
              className="w-full min-h-[300px] p-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-white font-mono"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Your research template will appear here..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendExtractor;