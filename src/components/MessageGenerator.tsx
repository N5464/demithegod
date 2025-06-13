import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { generateMessages } from '../services/webhooks';
import { Channel } from '../types';
import toast from 'react-hot-toast';

const MessageGenerator: React.FC = () => {
  const { selectedLead, setGeneratedMessages, isGeneratingMessages, setIsGeneratingMessages } = useLeads();
  const [niche, setNiche] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [channel, setChannel] = useState<Channel>('Email');

  const handleGenerateMessage = async () => {
    if (!selectedLead) {
      toast.error('Please select a lead first');
      return;
    }

    if (!niche) {
      setNiche(selectedLead.niche);
    }

    if (!painPoint) {
      toast.error('Please enter a pain point');
      return;
    }

    setIsGeneratingMessages(true);
    
    try {
      const messages = await generateMessages({
        business_name: selectedLead.business_name,
        niche: niche || selectedLead.niche,
        pain_point: painPoint,
        channel: channel,
      });

      if (!messages.email || !messages.whatsapp || !messages.instagram) {
        throw new Error('Message generation failed. Please try again.');
      }
      
      setGeneratedMessages({
        email: messages.email,
        whatsapp: messages.whatsapp,
        instagram: messages.instagram,
      });
      
      toast.success('Messages generated via Nik4i AI Agent 🎯');
    } catch (error) {
      console.error('Error generating messages:', error);
      toast.error('AI message generation failed – try again.');
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">AI Message Generator</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Selected Lead
          </label>
          <div className="input bg-gray-50 cursor-not-allowed">
            {selectedLead ? selectedLead.business_name : 'No lead selected'}
          </div>
        </div>
        
        <div>
          <label htmlFor="niche" className="block text-gray-700 text-sm font-medium mb-1">
            Niche
          </label>
          <input
            type="text"
            id="niche"
            className="input"
            placeholder="e.g. Tattoo Studio, Bridal Makeup, Dental Clinic"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            disabled={!selectedLead}
          />
          {selectedLead && niche === '' && (
            <p className="text-xs text-gray-500 mt-1">
              Using default: {selectedLead.niche}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="painPoint" className="block text-gray-700 text-sm font-medium mb-1">
            Pain Point
          </label>
          <input
            type="text"
            id="painPoint"
            className="input"
            placeholder="e.g. low website conversions, client no-shows"
            value={painPoint}
            onChange={(e) => setPainPoint(e.target.value)}
            disabled={!selectedLead}
          />
        </div>
        
        <div>
          <label htmlFor="channel" className="block text-gray-700 text-sm font-medium mb-1">
            Channel
          </label>
          <select
            id="channel"
            className="select"
            value={channel}
            onChange={(e) => setChannel(e.target.value as Channel)}
            disabled={!selectedLead}
          >
            <option value="Email">Email</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Instagram DM">Instagram DM</option>
          </select>
        </div>
        
        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={handleGenerateMessage}
          disabled={!selectedLead || isGeneratingMessages || !painPoint}
        >
          {isGeneratingMessages ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <MessageSquare size={18} />
              <span>Generate Message with AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageGenerator;