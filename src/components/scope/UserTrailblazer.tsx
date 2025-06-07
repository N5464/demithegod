import React, { useState } from 'react';
import { UserRoundSearch, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UserTrailblazer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Reddit');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const handleSearch = async () => {
    if (!topic) {
      toast.error('Please enter a keyword or topic');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const prompt = `You are a User Trailblazer AI. Your task is to scout and profile target users on ${platform} who are discussing "${topic}".

Output format:
User Profile Analysis
• User Type – Demographics and role (e.g., small business owner, freelancer, etc.)
• Pain Points – What problems they're expressing or discussing
• Engagement Style – How they communicate and what content they engage with
• Profile Insights – Bio details, follower count, posting frequency (if available)
• Outreach Angle – How to approach them with automation solutions
• Example Posts/Comments – Sample content showing their interests and pain points

Provide 2-3 distinct user profiles that represent different segments within this niche.

Write this as a tactical user research report for targeting and outreach purposes.`;

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
              content: 'You are a user research and profiling AI specialized in social media analysis.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content;
      setOutput(result || 'No user profiles found.');
      toast.success('User profiling complete! 👥');
    } catch (err) {
      console.error('Error fetching user info:', err);
      toast.error('Error fetching user profiles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <UserRoundSearch size={20} className="text-primary-500" />
            <h2 className="text-lg font-semibold">👥 User Trailblazer</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Scout and profile target users discussing specific topics across platforms
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
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g. Reddit, X, Threads, LinkedIn"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keyword or Topic
              </label>
              <input
                type="text"
                className="input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. booking software, client management"
              />
            </div>
          </div>

          <button
            className="btn-primary w-full flex items-center justify-center gap-2 group relative overflow-hidden"
            onClick={handleSearch}
            disabled={loading || !topic}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Scouting Users...</span>
              </>
            ) : (
              <>
                <UserRoundSearch size={18} />
                <span>Scout Users</span>
              </>
            )}
          </button>
        </div>
      </div>

      {output && (
        <div className="card">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">User Profile Analysis</h3>
          </div>
          <div className="p-6">
            <textarea
              className="w-full min-h-[400px] p-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-white font-mono"
              value={output}
              readOnly
              placeholder="Target user profiles and insights will appear here..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTrailblazer;