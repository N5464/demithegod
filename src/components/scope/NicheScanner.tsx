import React, { useState } from 'react';
import { Search, Target } from 'lucide-react';
import toast from 'react-hot-toast';

const NicheScanner: React.FC = () => {
  const [platform, setPlatform] = useState('');
  const [keyword, setKeyword] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    if (!platform || !keyword) {
      toast.error('Enter platform and keyword');
      return;
    }

    // Generate a sample niche analysis without AI
    const sampleAnalysis = `Niche Opportunity Analysis:

Platform: ${platform}
Keyword: ${keyword}

• Description – Manual research needed for ${keyword} discussions on ${platform}
• Pain Point – Common issues include lack of automation, time-consuming processes, and inefficient workflows
• Post/Comment Context – Users frequently discuss challenges with ${keyword} management and optimization
• Automation Angle – Potential for AI-powered solutions to streamline ${keyword} processes
• Profile Link – Manual research required to identify relevant users and accounts

Next Steps:
1. Manually search ${platform} for "${keyword}" discussions
2. Identify active users discussing related pain points
3. Analyze engagement patterns and common complaints
4. Document specific automation opportunities
5. Create targeted outreach strategy

Note: This is a template analysis. Replace with actual research findings from ${platform}.`;

    setOutput(sampleAnalysis);
    toast.success('Niche analysis template generated! 🎯');
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
            Generate research templates for discovering niche opportunities across platforms
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
            disabled={!platform || !keyword}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            <Search size={18} />
            <span>Generate Research Template</span>
          </button>
        </div>
      </div>

      {output && (
        <div className="card">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Research Template</h3>
          </div>
          <div className="p-6">
            <textarea
              className="w-full min-h-[300px] p-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-white font-mono"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your research template will appear here..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NicheScanner;