import React, { useState } from 'react';
import { UserRoundSearch } from 'lucide-react';
import toast from 'react-hot-toast';

const UserTrailblazer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Reddit');
  const [output, setOutput] = useState('');

  const handleSearch = () => {
    if (!topic) {
      toast.error('Please enter a keyword or topic');
      return;
    }

    // Generate a sample user research template
    const userTemplate = `User Profile Research Template:

Platform: ${platform}
Topic: ${topic}

User Profile Analysis
• User Type – Manual research needed to identify demographics and roles discussing "${topic}"
• Pain Points – Document specific problems users express about "${topic}"
• Engagement Style – Analyze how users communicate and what content they engage with
• Profile Insights – Note bio details, follower count, posting frequency (requires manual review)
• Outreach Angle – Develop approach strategies based on user behavior patterns
• Example Posts/Comments – Document specific content showing interests and pain points

Research Methodology:
1. Search ${platform} for users discussing "${topic}"
2. Identify 3-5 distinct user segments
3. Analyze their posting patterns and engagement
4. Document common pain points and interests
5. Note their communication style and preferences
6. Identify potential outreach opportunities

User Segment Templates:

Segment 1: [User Type]
- Demographics: [Manual research required]
- Pain Points: [Document from posts/comments]
- Engagement: [Analyze posting frequency and style]
- Outreach Angle: [Strategy based on behavior]

Segment 2: [User Type]
- Demographics: [Manual research required]
- Pain Points: [Document from posts/comments]
- Engagement: [Analyze posting frequency and style]
- Outreach Angle: [Strategy based on behavior]

Segment 3: [User Type]
- Demographics: [Manual research required]
- Pain Points: [Document from posts/comments]
- Engagement: [Analyze posting frequency and style]
- Outreach Angle: [Strategy based on behavior]

Next Steps:
1. Manually search ${platform} for "${topic}" discussions
2. Identify and profile active users
3. Document their specific pain points and needs
4. Develop targeted outreach strategies
5. Create personalized messaging approaches

Note: This template requires manual research to populate with actual user data.`;

    setOutput(userTemplate);
    toast.success('User research template generated! 👥');
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
            Generate research templates for profiling target users across platforms
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
            disabled={!topic}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            <UserRoundSearch size={18} />
            <span>Generate Research Template</span>
          </button>
        </div>
      </div>

      {output && (
        <div className="card">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">User Research Template</h3>
          </div>
          <div className="p-6">
            <textarea
              className="w-full min-h-[400px] p-4 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-white font-mono"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="User research template will appear here..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTrailblazer;