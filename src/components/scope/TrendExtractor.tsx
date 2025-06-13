import React, { useState } from 'react';
import { Flame, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TrendExtractor: React.FC = () => {
  const [platform, setPlatform] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleExtract = async () => {
    if (!platform || !keyword) {
      toast.error('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setResult('');

    try {
      const prompt = `You are a Trend Extractor. Your task is to analyze current trending posts or discussions on ${platform} about "${keyword}".

Output format:
Trend Insight
• Summary – What's trending and why
• Engagement Type – Problem / Question / Complaint
• Example Post/Comment – A snippet showing the trend
• Potential Hook – How this trend can be leveraged for automation or content.

Write the output in a clean and tactical format.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'You are a social trend extraction AI tool.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      const data = await response.json();
      const output = data.choices?.[0]?.message?.content;
      setResult(output || 'No result.');
      toast.success('Trend extraction complete! 🔥');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
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
            Extract trending discussions and engagement patterns from social platforms
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
            disabled={loading || !platform || !keyword}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Flame size={18} />
                <span>Extract Trend</span>
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Trend Analysis Results</h3>
          </div>
          <div className="p-6">
            <textarea
              className="w-full min-h-[300px] p-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-white font-mono"
              value={result}
              readOnly
              placeholder="Trend output will appear here..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendExtractor;