import React, { useState, useEffect } from 'react';
import { Repeat, Copy, Send } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';
import { copyToClipboard } from '../../utils/clipboard';
import { Channel } from '../../types';
import toast from 'react-hot-toast';

const EMAIL_WEBHOOK_URL = "https://hook.eu2.make.com/63ztv14n5hwu7yfcdyuo9omdhhudwbx7";

const FollowUpLauncher: React.FC = () => {
  const { selectedLead } = useLeads();
  const [businessName, setBusinessName] = useState('');
  const [channel, setChannel] = useState<Channel>('Email');
  const [context, setContext] = useState('');
  const [message, setMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Update form when a lead is selected
  useEffect(() => {
    if (selectedLead) {
      setBusinessName(selectedLead.business_name);
    }
  }, [selectedLead]);

  const generateFollowUp = async () => {
    if (!businessName || !channel) {
      toast.error('Please fill in business name and channel');
      return;
    }

    setIsGenerating(true);
    setMessage('');
    setEmailSubject('');

    try {
      const prompt = `You are a business outreach expert helping follow up with leads via ${channel}.

Business Name: ${businessName}
Channel: ${channel}
Context: ${context || 'No additional context provided'}

Generate a concise follow-up message that:
- Feels friendly, polite, and value-driven
- References our previous conversation naturally
- Offers genuine value or next steps
- Maintains professional tone while being personable
- Is appropriate for ${channel} communication

${channel === 'Email' ? 'Also provide a compelling subject line.' : ''}

Format your response as JSON:
${channel === 'Email' 
  ? '{"subject": "Your subject line", "message": "Your follow-up message"}' 
  : '{"message": "Your follow-up message"}'
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          response_format: { type: "json_object" },
          messages: [
            { role: 'system', content: 'You are an expert at writing follow-up messages for business outreach.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices?.[0]?.message?.content || '{}');
      
      if (!result.message) {
        throw new Error('No message content received');
      }

      setMessage(result.message);
      if (result.subject && channel === 'Email') {
        setEmailSubject(result.subject);
      }
      
      toast.success('Follow-up message generated! 🎯');
    } catch (error) {
      console.error('Error generating follow-up:', error);
      toast.error('Failed to generate follow-up message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedLead?.email || !message || !emailSubject) {
      toast.error('Please ensure you have a selected lead, subject, and message content');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(EMAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'followup',
          business_name: selectedLead.business_name,
          email: selectedLead.email,
          subject: emailSubject,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      toast.success('✅ Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('❌ Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Repeat size={20} className="text-primary-500" />
        <h2 className="text-lg font-semibold">↻ Follow-Up Launcher</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <input
            type="text"
            className="input"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter business name"
          />
          {selectedLead && (
            <p className="text-xs text-gray-500 mt-1">
              Using selected lead: {selectedLead.business_name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Channel
          </label>
          <select
            className="select"
            value={channel}
            onChange={(e) => setChannel(e.target.value as Channel)}
          >
            <option value="Email">Email</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Instagram DM">Instagram DM</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Context (Optional)
          </label>
          <textarea
            className="input min-h-[100px] resize-none"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add any relevant context about previous interactions, what was discussed, or specific follow-up points..."
          />
        </div>

        <button
          className="btn-primary w-full flex items-center justify-center gap-2 group relative overflow-hidden"
          onClick={generateFollowUp}
          disabled={isGenerating || !businessName}
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Repeat size={18} />
              <span>Generate Follow-Up</span>
            </>
          )}
        </button>

        {message && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {channel === 'Email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  className="input"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject line"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow-Up Message
              </label>
              <div className="relative">
                <textarea
                  className="message-container w-full resize-none font-mono text-sm min-h-[200px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => copyToClipboard(message, 'Follow-up message copied!')}
                  title="Copy to clipboard"
                >
                  <Copy size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Send Email Button - Only show for Email channel */}
            {channel === 'Email' && (
              <button
                className="btn-primary w-full flex items-center justify-center gap-2"
                onClick={handleSendEmail}
                disabled={isSending || !selectedLead?.email || !emailSubject.trim() || !message.trim()}
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpLauncher;