import React, { useState } from 'react';
import { Send, Zap } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';
import toast from 'react-hot-toast';

// Constants
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_KEY;
const MODEL = "gpt-4o";
const EMAIL_WEBHOOK_URL = "https://hook.eu2.make.com/63ztv14n5hwu7yfcdyuo9omdhhudwbx7";

// Types
interface GeneratedResult {
  businessName: string;
  subject: string;
  message: string;
}

interface LeadContent {
  subject: string;
  message: string;
}

const MultiHitSender: React.FC = () => {
  const { leads } = useLeads();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [leadContents, setLeadContents] = useState<Record<string, LeadContent>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const generatePrompt = (lead: any) => `
You are an elite cold outreach expert.

Generate a personalized cold email for the business below:

- Business Name: ${lead.business_name}
- Niche: ${lead.niche}

Instructions:
- Create a sharp subject line (max 7 words)
- Write a short, 100–120 word message
- Speak casually, like a founder to a founder
- Focus on what automation can improve for them
- Mention "nik4i.ai" naturally (but no hard sell)
- Format response ONLY as JSON:
{"subject": "...", "message": "..."}
`.trim();

  const generateMessageForLead = async (businessName: string): Promise<GeneratedResult | null> => {
    const lead = leads.find((l) => l.business_name === businessName);
    if (!lead) return null;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are an outreach assistant." },
          { role: "user", content: generatePrompt(lead) },
        ],
      }),
    });

    const data = await res.json();
    const parsed = data.choices?.[0]?.message?.content;
    if (!parsed) throw new Error("No message content returned");

    const { subject, message } = JSON.parse(parsed);
    return { businessName, subject, message };
  };

  const handleGenerateAll = async () => {
    if (selectedLeads.length === 0) {
      toast.error('No leads selected');
      return;
    }

    setIsGenerating(true);
    try {
      // Clear existing content
      setLeadContents({});

      const results = await Promise.all(
        selectedLeads.map(generateMessageForLead)
      );

      const newLeadContents: Record<string, LeadContent> = {};

      results.forEach((res) => {
        if (res) {
          newLeadContents[res.businessName] = {
            subject: res.subject,
            message: res.message
          };
        }
      });

      setLeadContents(newLeadContents);
      toast.success('Generated messages for all selected leads');
    } catch (error) {
      console.error('Error in batch generation:', error);
      toast.error('Failed to generate messages');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendAll = async () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select at least one lead');
      return;
    }

    // Validate that all selected leads have content
    const leadsWithoutContent = selectedLeads.filter(businessName => 
      !leadContents[businessName]?.subject?.trim() || !leadContents[businessName]?.message?.trim()
    );

    if (leadsWithoutContent.length > 0) {
      toast.error('Please generate messages for all selected leads first');
      return;
    }

    setIsSending(true);
    try {
      // Prepare leads data for the webhook
      const leadsData = selectedLeads.map(businessName => {
        const lead = leads.find(l => l.business_name === businessName);
        const content = leadContents[businessName];
        
        if (!lead || !content) {
          throw new Error(`Missing data for ${businessName}`);
        }

        return {
          business_name: lead.business_name,
          email: lead.email,
          subject: content.subject,
          message: content.message
        };
      });

      const response = await fetch(EMAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'multi',
          leads: leadsData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send emails');
      }

      toast.success('✅ Emails sent to selected leads.');
    } catch (error) {
      console.error('Error sending emails:', error);
      toast.error('❌ Error sending emails. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleLeadToggle = (businessName: string) => {
    setSelectedLeads(prev => 
      prev.includes(businessName)
        ? prev.filter(name => name !== businessName)
        : [...prev, businessName]
    );
  };

  const updateLeadSubject = (businessName: string, subject: string) => {
    setLeadContents(prev => ({
      ...prev,
      [businessName]: {
        ...prev[businessName],
        subject
      }
    }));
  };

  const updateLeadMessage = (businessName: string, message: string) => {
    setLeadContents(prev => ({
      ...prev,
      [businessName]: {
        ...prev[businessName],
        message
      }
    }));
  };

  const hasValidContent = (businessName: string) => {
    const content = leadContents[businessName];
    return content?.subject?.trim() && content?.message?.trim();
  };

  const allSelectedHaveContent = selectedLeads.every(hasValidContent);

  return (
    <div className="card max-h-[600px] flex flex-col overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Send size={20} className="text-primary-500" />
          <h2 className="text-lg font-semibold">MultiHit Sender</h2>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-secondary flex items-center gap-2"
            onClick={handleGenerateAll}
            disabled={isGenerating || selectedLeads.length === 0}
          >
            <Zap size={16} />
            <span>{isGenerating ? 'Generating...' : 'Generate All'}</span>
          </button>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={handleSendAll}
            disabled={isSending || selectedLeads.length === 0 || !allSelectedHaveContent}
          >
            <Send size={16} />
            <span>{isSending ? 'Sending...' : 'Send All'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {leads.map((lead) => {
            const content = leadContents[lead.business_name] || { subject: '', message: '' };
            const isSelected = selectedLeads.includes(lead.business_name);
            const hasContent = hasValidContent(lead.business_name);
            
            return (
              <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id={`lead-${lead.id}`}
                    checked={isSelected}
                    onChange={() => handleLeadToggle(lead.business_name)}
                    className="h-4 w-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor={`lead-${lead.id}`} className="font-medium text-gray-900">
                    {lead.business_name}
                  </label>
                  <span className="text-sm text-gray-500">{lead.email}</span>
                  {isSelected && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      hasContent 
                        ? 'bg-success-100 text-success-700' 
                        : 'bg-warning-100 text-warning-700'
                    }`}>
                      {hasContent ? '✓ Ready' : '⚠ Needs content'}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <div className="space-y-3 pl-7">
                    <input
                      type="text"
                      placeholder="Email Subject"
                      value={content.subject}
                      onChange={(e) => updateLeadSubject(lead.business_name, e.target.value)}
                      className="input"
                    />
                    <textarea
                      placeholder="Email Message"
                      value={content.message}
                      onChange={(e) => updateLeadMessage(lead.business_name, e.target.value)}
                      className="message-container"
                      rows={6}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultiHitSender;