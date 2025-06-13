import React, { useState } from 'react';
import { MessageSquare, Instagram } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { logOutreach } from '../services/webhooks';
import { updateLeadStatus } from '../services/googleSheets';
import toast from 'react-hot-toast';
import { Channel } from '../types';

interface OutreachPanelProps {
  editedMessages: {
    whatsapp: string;
    instagram: string;
  };
}

const OutreachPanel: React.FC<OutreachPanelProps> = ({ editedMessages }) => {
  const { selectedLead, refreshLeads } = useLeads();
  const [sendingChannel, setSendingChannel] = useState<Channel | null>(null);

  if (!editedMessages || !selectedLead) {
    return null;
  }

  const handleSend = async (channel: Channel) => {
    if (!selectedLead) return;

    const message = channel === 'WhatsApp' ? editedMessages.whatsapp : editedMessages.instagram;

    if (!message) {
      toast.error('No message content to send');
      return;
    }

    setSendingChannel(channel);
    
    try {
      toast.loading('Sending message...', { id: 'sending' });
      
      await logOutreach({
        business_name: selectedLead.business_name,
        channel,
        message,
        timestamp: new Date().toISOString(),
      });

      await updateLeadStatus(selectedLead.business_name, 'Contacted');
      await refreshLeads();
      
      toast.success('✅ Message sent successfully!', { id: 'sending' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message', { id: 'sending' });
    } finally {
      setSendingChannel(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-4">
        <h3 className="font-medium text-sm text-gray-500">OUTREACH ACTIONS</h3>
        
        <div className="flex flex-wrap gap-3">
          {editedMessages.whatsapp && (
            <button
              className="btn-primary flex items-center gap-2"
              onClick={() => handleSend('WhatsApp')}
              disabled={sendingChannel === 'WhatsApp'}
            >
              <MessageSquare size={16} />
              <span>{sendingChannel === 'WhatsApp' ? 'Sending...' : 'Send WhatsApp'}</span>
            </button>
          )}
          
          {editedMessages.instagram && (
            <button
              className="btn-primary flex items-center gap-2"
              onClick={() => handleSend('Instagram DM')}
              disabled={sendingChannel === 'Instagram DM'}
            >
              <Instagram size={16} />
              <span>{sendingChannel === 'Instagram DM' ? 'Sending...' : 'Send Instagram DM'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutreachPanel;