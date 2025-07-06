import React, { useState } from 'react';
import { Send, Copy, CheckSquare, Mail, Loader2, AlertCircle, Bot } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';
import { copyToClipboard } from '../../utils/clipboard';
import toast from 'react-hot-toast';

// Constants
const EMAIL_WEBHOOK_URL = "https://hook.eu2.make.com/63ztv14n5hwu7yfcdyuo9omdhhudwbx7";
const MULTI_GENERATOR_WEBHOOK_URL = "https://hook.eu2.make.com/uan4u8urw9pj2vm83ludaiewndyh3que";

// Types
interface LeadState {
  isSelected: boolean;
  painPoint: string;
  emailSubject: string;
  emailBody: string;
  isSending: boolean;
  isSent: boolean;
  isGenerating: boolean;
}

interface GenerationResponse {
  businessName: string;
  subject: string;
  message: string;
}

const MultiHitSender: React.FC = () => {
  const { leads } = useLeads();
  const [leadStates, setLeadStates] = useState<Record<string, LeadState>>({});
  const [isSendingAll, setIsSendingAll] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Helper functions
  const getLeadState = (leadId: string): LeadState => {
    return leadStates[leadId] || {
      isSelected: false,
      painPoint: '',
      emailSubject: '',
      emailBody: '',
      isSending: false,
      isSent: false,
      isGenerating: false,
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

  const readyToGenerateLeads = selectedLeads.filter(lead => {
    const state = getLeadState(lead.id);
    return state.painPoint.trim();
  });

  // Event handlers
  const handleLeadToggle = (leadId: string) => {
    const currentState = getLeadState(leadId);
    const lead = leads.find(l => l.id === leadId);
    
    updateLeadState(leadId, { 
      isSelected: !currentState.isSelected,
      // Pre-fill pain point from sheet if available when selecting
      painPoint: !currentState.isSelected && lead?.pain_point ? lead.pain_point : currentState.painPoint,
      // Reset state when deselecting
      ...(currentState.isSelected && {
        painPoint: '',
        emailSubject: '',
        emailBody: '',
        isSent: false,
      })
    });
  };

  const handleGenerateAll = async () => {
    if (readyToGenerateLeads.length === 0) {
      toast.error('Add pain points for selected leads before generating');
      return;
    }

    setIsGeneratingAll(true);

    // Set generating state for all selected leads and show subject/message fields
    selectedLeads.forEach(lead => {
      updateLeadState(lead.id, { 
        isGenerating: true,
        // Show fields immediately
        emailSubject: getLeadState(lead.id).emailSubject || '',
        emailBody: getLeadState(lead.id).emailBody || ''
      });
    });

    try {
      const payload = readyToGenerateLeads.map(lead => ({
        businessName: lead.business_name,
        niche: lead.niche,
        painPoint: getLeadState(lead.id).painPoint,
      }));

      const response = await fetch(MULTI_GENERATOR_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leads: payload }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate messages');
      }

      const generatedData: GenerationResponse[] = await response.json();

      // Match responses by business name and populate fields
      generatedData.forEach(generated => {
        const matchingLead = leads.find(lead => 
          lead.business_name === generated.businessName
        );
        
        if (matchingLead) {
          updateLeadState(matchingLead.id, {
            emailSubject: generated.subject,
            emailBody: generated.message,
            isGenerating: false,
          });
        }
      });

      // Clear generating state for any leads that didn't get responses
      selectedLeads.forEach(lead => {
        const hasResponse = generatedData.some(g => g.businessName === lead.business_name);
        if (!hasResponse) {
          updateLeadState(lead.id, { isGenerating: false });
        }
      });

      toast.success(`✅ Generated messages for ${generatedData.length} leads`);
    } catch (error) {
      console.error('Error generating messages:', error);
      toast.error('Failed to generate messages. Please try again.');
      
      // Clear generating state on error
      selectedLeads.forEach(lead => {
        updateLeadState(lead.id, { isGenerating: false });
      });
    } finally {
      setIsGeneratingAll(false);
    }
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
      toast.success(`✅ Deployed multi-strike to ${readyToSendLeads.length} targets`);
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
            <h2 className="text-lg font-semibold">🎯 Multi-Strike Deployment Center</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{selectedLeads.length} selected</span>
            <span>•</span>
            <span>{readyToSendLeads.length} ready to deploy</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-3">
          <button
            className="btn-primary flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            onClick={handleGenerateAll}
            disabled={isGeneratingAll || readyToGenerateLeads.length === 0}
          >
            {isGeneratingAll ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Bot size={16} />
                <span>Generate All ({readyToGenerateLeads.length})</span>
              </>
            )}
          </button>

          <button
            className="btn-primary flex items-center gap-2"
            onClick={handleSendAll}
            disabled={isSendingAll || readyToSendLeads.length === 0}
          >
            {isSendingAll ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Mail size={16} />
                <span>Deploy Multi-Strike ({readyToSendLeads.length})</span>
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
            <p className="text-lg font-medium mb-2">No targets available</p>
            <p>Configure your Google Sheet to load targets for multi-strike deployment.</p>
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
                  {/* Lead Selection Row */}
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

                  {/* Selected Lead Configuration */}
                  {state.isSelected && (
                    <div className="ml-8 space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {/* Pain Point Input */}
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

                      {/* Subject and Message Fields - Show after selection or generation */}
                      {(state.emailSubject !== undefined || state.emailBody !== undefined) && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Subject
                            </label>
                            <div className="relative">
                              {state.isGenerating ? (
                                <div className="input flex items-center justify-center bg-blue-50 border-blue-200">
                                  <Loader2 size={16} className="animate-spin text-blue-500 mr-2" />
                                  <span className="text-blue-600 text-sm">Generating subject...</span>
                                </div>
                              ) : (
                                <>
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
                                </>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Message
                            </label>
                            <div className="relative">
                              {state.isGenerating ? (
                                <div className="input min-h-[120px] flex items-center justify-center bg-blue-50 border-blue-200">
                                  <div className="text-center">
                                    <Loader2 size={20} className="animate-spin text-blue-500 mx-auto mb-2" />
                                    <span className="text-blue-600 text-sm">Generating personalized message...</span>
                                  </div>
                                </div>
                              ) : (
                                <>
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
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Status Messages */}
                      {state.isSent && (
                        <div className="flex items-center gap-2 text-success-600 text-sm font-medium bg-success-50 p-3 rounded-md">
                          <CheckSquare size={16} />
                          <span>✅ Multi-strike deployed successfully to {lead.business_name}</span>
                        </div>
                      )}

                      {!state.isSent && state.emailSubject.trim() && state.emailBody.trim() && !state.isGenerating && (
                        <div className="flex items-center gap-2 text-primary-600 text-sm font-medium bg-primary-50 p-3 rounded-md">
                          <CheckSquare size={16} />
                          <span>✅ Ready for deployment</span>
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