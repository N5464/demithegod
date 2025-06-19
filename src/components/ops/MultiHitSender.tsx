import React, { useState } from 'react';
import { Send, Copy, CheckSquare, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';
import { copyToClipboard } from '../../utils/clipboard';
import toast from 'react-hot-toast';

// Constants
const EMAIL_WEBHOOK_URL = "https://hook.eu2.make.com/63ztv14n5hwu7yfcdyuo9omdhhudwbx7";

// Types
interface LeadState {
  isSelected: boolean;
  painPoint: string;
  emailSubject: string;
  emailBody: string;
  isSending: boolean;
  isSent: boolean;
}

const MultiHitSender: React.FC = () => {
  const { leads } = useLeads();
  const [leadStates, setLeadStates] = useState<Record<string, LeadState>>({});
  const [isSendingAll, setIsSendingAll] = useState(false);

  // Helper functions
  const getLeadState = (leadId: string): LeadState => {
    return leadStates[leadId] || {
      isSelected: false,
      painPoint: '',
      emailSubject: '',
      emailBody: '',
      isSending: false,
      isSent: false,
    };
  };

  const updateLeadState = (leadId: string, updates: Partial<LeadState>) => {
    setLeadStates(prev => ({
      ...prev,
      [leadId]: { ...getLeadState(leadId), ...updates }
    }));
  };

  const selectedLeads = leads.filter(lead => getLeadState(lead.id).isSelected);
  const readyToSendLeads = selectedLeads.filter(lead => {
    const state = getLeadState(lead.id);
    return state.emailSubject.trim() && state.emailBody.trim() && !state.isSent;
  });

  // Event handlers
  const handleLeadToggle = (leadId: string) => {
    const currentState = getLeadState(leadId);
    updateLeadState(leadId, { 
      isSelected: !currentState.isSelected,
      // Reset state when deselecting
      ...(currentState.isSelected && {
        painPoint: '',
        emailSubject: '',
        emailBody: '',
        isSent: false,
      })
    });
  };

  const handleSendAll = async () => {
    if (readyToSendLeads.length === 0) {
      toast.error('No leads ready to send (need subject and body)');
      return;
    }

    setIsSendingAll(true);

    try {
      const sendPromises = readyToSendLeads.map(async (lead) => {
        const state = getLeadState(lead.id);
        updateLeadState(lead.id, { isSending: true });

        try {
          const response = await fetch(EMAIL_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'single',
              business_name: lead.business_name,
              email: lead.email,
              subject: state.emailSubject,
              message: state.emailBody,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to send to ${lead.business_name}`);
          }

          updateLeadState(lead.id, {
            isSending: false,
            isSent: true,
          });
        } catch (error) {
          console.error(`Error sending to ${lead.business_name}:`, error);
          updateLeadState(lead.id, { isSending: false });
          toast.error(`Failed to send to ${lead.business_name}`);
        }
      });

      await Promise.all(sendPromises);
      toast.success(`✅ Sent emails to ${readyToSendLeads.length} leads`);
    } catch (error) {
      console.error('Error in sendAll:', error);
      toast.error('Failed to send some emails');
    } finally {
      setIsSendingAll(false);
    }
  };

  return (
    <div className="card max-h-[800px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send size={20} className="text-primary-500" />
            <h2 className="text-lg font-semibold">🎯 Multi Generator - Outreach Control Panel</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{selectedLeads.length} selected</span>
            <span>•</span>
            <span>{readyToSendLeads.length} ready to send</span>
          </div>
        </div>
      </div>

      {/* AI Agent Status Notice */}
      <div className="p-4 bg-warning-50 border-b border-warning-200">
        <div className="flex items-center gap-2 text-warning-700">
          <AlertCircle size={16} />
          <span className="text-sm font-medium">
            Agent integration coming soon – auto generation disabled for now.
          </span>
        </div>
        <p className="text-xs text-warning-600 mt-1">
          Manually enter email subjects and messages for each selected lead below.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-3">
          <button
            className="btn-primary flex items-center gap-2"
            onClick={handleSendAll}
            disabled={isSendingAll || readyToSendLeads.length === 0}
          >
            {isSendingAll ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail size={16} />
                <span>Send All ({readyToSendLeads.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="flex-1 overflow-auto">
        {leads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Send size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No leads available</p>
            <p>Configure your Google Sheet to load leads for outreach.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Table Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700">
                <div className="col-span-1">Select</div>
                <div className="col-span-3">Business Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Phone</div>
                <div className="col-span-2">Niche</div>
                <div className="col-span-1">Status</div>
              </div>
            </div>

            {leads.map((lead) => {
              const state = getLeadState(lead.id);
              
              return (
                <div key={lead.id} className="p-4">
                  {/* Lead Selection Row - Full Width Table Format */}
                  <div className="grid grid-cols-12 gap-4 items-center mb-3">
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        id={`lead-${lead.id}`}
                        checked={state.isSelected}
                        onChange={() => handleLeadToggle(lead.id)}
                        className="h-4 w-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="col-span-3 font-medium text-gray-900 truncate" title={lead.business_name}>
                      {lead.business_name}
                    </div>
                    
                    <div className="col-span-3 text-gray-600 truncate" title={lead.email}>
                      {lead.email}
                    </div>
                    
                    <div className="col-span-2 text-gray-600 truncate" title={lead.phone}>
                      {lead.phone}
                    </div>
                    
                    <div className="col-span-2">
                      <span className="badge badge-primary text-xs">{lead.niche}</span>
                    </div>
                    
                    <div className="col-span-1 flex items-center gap-2">
                      <span className={`badge text-xs ${
                        lead.status === 'New' ? 'badge-primary' :
                        lead.status === 'Contacted' ? 'badge-warning' :
                        lead.status === 'Responded' ? 'badge-warning' :
                        lead.status === 'Converted' ? 'badge-success' :
                        'badge-error'
                      }`}>
                        {lead.status}
                      </span>
                      
                      {/* Status Indicators */}
                      {state.isSending && (
                        <Loader2 size={14} className="animate-spin text-primary-500" />
                      )}
                      {state.isSent && (
                        <Mail size={14} className="text-success-600" />
                      )}
                    </div>
                  </div>

                  {/* Manual Input Fields for Selected Leads */}
                  {state.isSelected && (
                    <div className="ml-8 space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pain Point for {lead.business_name}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. low website conversions, client no-shows"
                          value={state.painPoint}
                          onChange={(e) => updateLeadState(lead.id, { painPoint: e.target.value })}
                          className="input"
                          disabled={state.isSending || state.isSent}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Subject
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter email subject line"
                            value={state.emailSubject}
                            onChange={(e) => updateLeadState(lead.id, { emailSubject: e.target.value })}
                            className="input pr-10"
                            disabled={state.isSending || state.isSent}
                          />
                          <button
                            onClick={() => copyToClipboard(state.emailSubject, 'Subject copied!')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                            title="Copy subject"
                            disabled={!state.emailSubject.trim()}
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Body
                        </label>
                        <div className="relative">
                          <textarea
                            placeholder="Enter your personalized email message here..."
                            value={state.emailBody}
                            onChange={(e) => updateLeadState(lead.id, { emailBody: e.target.value })}
                            className="input min-h-[120px] resize-none"
                            disabled={state.isSending || state.isSent}
                          />
                          <button
                            onClick={() => copyToClipboard(state.emailBody, 'Message copied!')}
                            className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-gray-50 rounded-md transition-colors"
                            title="Copy message"
                            disabled={!state.emailBody.trim()}
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Send Status */}
                      {state.isSent && (
                        <div className="flex items-center gap-2 text-success-600 text-sm font-medium bg-success-50 p-3 rounded-md">
                          <CheckSquare size={16} />
                          <span>✅ Email sent successfully to {lead.business_name}</span>
                        </div>
                      )}

                      {/* Ready Status */}
                      {!state.isSent && state.emailSubject.trim() && state.emailBody.trim() && (
                        <div className="flex items-center gap-2 text-primary-600 text-sm font-medium bg-primary-50 p-3 rounded-md">
                          <CheckSquare size={16} />
                          <span>✅ Ready to send</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiHitSender;