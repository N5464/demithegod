import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '../../utils/clipboard';
import { useLeads } from '../../context/LeadContext';

interface GeneratePayload {
  business_name: string;
  niche: string;
  pain_point: string;
  tone_style: string;
}

const PersonalizedGenerator: React.FC = () => {
  const { selectedLead } = useLeads();
  const [businessName, setBusinessName] = useState('');
  const [niche, setNiche] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [toneStyle, setToneStyle] = useState('Bold');
  const [message, setMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Update form when a lead is selected
  useEffect(() => {
    if (selectedLead) {
      setBusinessName(selectedLead.business_name);
      setNiche(selectedLead.niche);
    }
  }, [selectedLead]);

  const handleGenerate = async () => {
    if (!businessName || !niche || !painPoint) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('https://hook.eu2.make.com/fjhhucgjg8wyhkr0rru12yy8slpi222a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_name: businessName,
          niche,
          pain_point: painPoint,
          tone_style: toneStyle,
        } as GeneratePayload),
      });

      if (!response.ok) {
        throw new Error('Failed to generate message');
      }

      const data = await response.text();
      if (!data) {
        throw new Error('Empty response from webhook');
      }

      setMessage(data);
      toast.success('Message generated via Nik4i AI Agent 🎯');
    } catch (error) {
      console.error('Error generating message:', error);
      toast.error('Failed to generate message. Please try again.');
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
      const response = await fetch('https://hook.eu2.make.com/63ztv14n5hwu7yfcdyuo9omdhhudwbx7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'single',
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
        <MessageSquare size={20} className="text-primary-500" />
        <h2 className="text-lg font-semibold">🎯 Personalized Message Generator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name
          </label>
          <input
            type="text"
            className="input"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. InkSoul Studio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niche
          </label>
          <input
            type="text"
            className="input"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. Tattoo Studio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pain Point
          </label>
          <input
            type="text"
            className="input"
            value={painPoint}
            onChange={(e) => setPainPoint(e.target.value)}
            placeholder="e.g. low walk-ins, client no-shows"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tone Style
          </label>
          <select
            className="select"
            value={toneStyle}
            onChange={(e) => setToneStyle(e.target.value)}
          >
            <option value="Bold">Bold</option>
            <option value="Chill">Chill</option>
            <option value="Friendly">Friendly</option>
            <option value="Consultant">Consultant</option>
          </select>
        </div>
      </div>

      <button
        className="btn-primary w-full flex items-center justify-center gap-2 group relative overflow-hidden"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <MessageSquare size={18} />
            <span>Generate Message</span>
          </>
        )}
      </button>

      {message && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              className="input"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Content
            </label>
            <textarea
              className="message-container w-full resize-none font-mono text-sm min-h-[200px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="absolute top-8 right-2 p-1.5 bg-white/80 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => copyToClipboard(message, 'Message copied!')}
              title="Copy to clipboard"
            >
              <Copy size={16} className="text-gray-600" />
            </button>
          </div>

          <button
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={handleSendEmail}
            disabled={isSending || !selectedLead?.email || !emailSubject.trim()}
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
        </div>
      )}
    </div>
  );
};

export default PersonalizedGenerator;