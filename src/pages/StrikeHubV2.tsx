import React, { useState, useEffect } from 'react';
import { Target, Zap, Send, MessageSquare, Instagram, Repeat, Shuffle, ChevronDown, ChevronUp, RefreshCw, Search, Bot } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { copyToClipboard } from '../utils/clipboard';
import { fetchSheetNames } from '../services/googleSheets';
import toast from 'react-hot-toast';

const StrikeHubV2: React.FC = () => {
  const {
    filteredLeads,
    loading,
    error,
    refreshLeads,
    nicheFilter,
    setNicheFilter,
    statusFilter,
    setStatusFilter,
    setSelectedLead,
    selectedLead,
    leads,
    currentSheet,
    setCurrentSheet,
  } = useLeads();
  
  // Section collapse states for mobile
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  
  // AI Message Generator State
  const [aiBusinessName, setAiBusinessName] = useState('');
  const [aiNiche, setAiNiche] = useState('');
  const [aiPainPoint, setAiPainPoint] = useState('');
  const [aiSubject, setAiSubject] = useState('');
  const [aiBody, setAiBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Multi-Hit Sender State
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [leadPainPoints, setLeadPainPoints] = useState<Record<string, string>>({});
  const [leadSubjects, setLeadSubjects] = useState<Record<string, string>>({});
  const [leadBodies, setLeadBodies] = useState<Record<string, string>>({});
  const [isSendingMulti, setIsSendingMulti] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Follow-Up Launcher State
  const [followUpTone, setFollowUpTone] = useState('Professional');
  const [followUpContext, setFollowUpContext] = useState('');
  const [followUpSubject, setFollowUpSubject] = useState('');
  const [followUpBody, setFollowUpBody] = useState('');
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);

  // WhatsApp + Insta DM State
  const [socialChannel, setSocialChannel] = useState<'whatsapp' | 'instagram'>('whatsapp');
  const [socialMessage, setSocialMessage] = useState('');

  // Message Style Switcher State
  const [originalMessage, setOriginalMessage] = useState('');
  const [rewriteTone, setRewriteTone] = useState('Bold');
  const [rewrittenMessage, setRewrittenMessage] = useState('');

  // Lead Table State - Enhanced with sheet switching
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [loadingSheets, setLoadingSheets] = useState(false);

  // Load available sheets on component mount
  useEffect(() => {
    const loadSheets = async () => {
      setLoadingSheets(true);
      try {
        const sheets = await fetchSheetNames();
        setAvailableSheets(sheets);
      } catch (error) {
        console.error('Error loading sheet names:', error);
        toast.error('Failed to load available target databases');
        // Fallback to default sheet
        setAvailableSheets(['Sheet1']);
      } finally {
        setLoadingSheets(false);
      }
    };

    loadSheets();
  }, []);

  // Toggle section collapse
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Update AI generator when lead is selected
  useEffect(() => {
    if (selectedLead) {
      setAiBusinessName(selectedLead.business_name);
      setAiNiche(selectedLead.niche);
    }
  }, [selectedLead]);

  // Handle lead selection
  const handleLeadSelect = (lead: any) => {
    setSelectedLead(lead);
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      const url = localStorage.getItem('googleSheetUrl');
      const name = localStorage.getItem('sheetName');
      const key = localStorage.getItem('apiKey');

      if (!url || !name || !key) {
        toast.error('Configure your Google Sheet first');
        return;
      }

      toast.loading('Refreshing targets...', { id: 'refresh' });
      await refreshLeads();
      toast.success('Target database updated', { id: 'refresh' });
    } catch (error) {
      console.error('Error refreshing leads:', error);
      toast.error('Failed to refresh targets', { id: 'refresh' });
    }
  };

  // Get unique values for filters
  const getUniqueNiches = () => {
    return Array.from(new Set(leads.map(lead => lead.niche))).filter(Boolean);
  };

  const getUniqueStatuses = () => {
    return Array.from(new Set(leads.map(lead => lead.status))).filter(Boolean);
  };

  // AI Message Generator Functions
  const handleAiGenerate = async () => {
    if (!aiBusinessName || !aiNiche || !aiPainPoint) {
      toast.error('Fill all fields to generate message');
      return;
    }

    setIsGenerating(true);
    try {
      const bizName = aiBusinessName;
const niche = aiNiche;
const painPoint = aiPainPoint;
      const res = await fetch("https://strikehub-relay.nirmalsolanki-business.workers.dev", {
  method: "POST",
        mode: "cors",
  credentials: "omit",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    type: "single",
    bizName,
    niche,
    painPoint
  })
});

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      const output = data.output;

      if (!output) {
        throw new Error('No output received from AI service');
      }

      // Parse subject and body from the output
      // Look for common patterns like "Subject:" and "Body:" or similar
      const lines = output.split('\n');
      let subject = '';
      let body = '';
      let isBodySection = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check for subject line patterns
        if (line.toLowerCase().includes('subject:') || line.toLowerCase().includes('subject line:')) {
          subject = line.replace(/subject:?/i, '').trim();
        }
        // Check for body section start
        else if (line.toLowerCase().includes('body:') || line.toLowerCase().includes('message:') || line.toLowerCase().includes('email:')) {
          isBodySection = true;
          const bodyStart = line.replace(/body:?|message:?|email:?/i, '').trim();
          if (bodyStart) {
            body = bodyStart;
          }
        }
        // If we're in body section, collect all remaining lines
        else if (isBodySection && line) {
          body += (body ? '\n' : '') + line;
        }
        // If no explicit markers, try to detect subject as first line and body as rest
        else if (i === 0 && !subject && line) {
          subject = line;
        }
        else if (i > 0 && !isBodySection && line) {
          body += (body ? '\n' : '') + line;
        }
      }

      // Fallback: if parsing failed, use the whole output as body and generate a subject
      if (!subject && !body) {
        body = output;
        subject = `Transform ${aiBusinessName}'s ${aiPainPoint} Challenge`;
      } else if (!subject) {
        subject = `Transform ${aiBusinessName}'s ${aiPainPoint} Challenge`;
      } else if (!body) {
        body = output;
      }

      setAiSubject(subject);
      setAiBody(body);
      
      toast.success('🎯 AI Strike message generated successfully');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('AI Strike generation failed - retry mission');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiSend = async () => {
    if (!selectedLead?.email || !aiSubject || !aiBody) {
      toast.error('Missing email, subject, or body');
      return;
    }

    try {
      const response = await fetch('https://hook.eu2.make.com/63ztv14n5hwu7yfcdyuo9omdhhudwbx7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'single',
          business_name: selectedLead.business_name,
          email: selectedLead.email,
          subject: aiSubject,
          message: aiBody,
        }),
      });

      if (!response.ok) throw new Error('Send failed');
      toast.success('🚀 Email launched successfully');
    } catch (error) {
      toast.error('Launch failed - retry mission');
    }
  };

  // Multi-Hit Sender Functions
  const toggleLeadSelection = (leadId: string) => {
    const newSelected = new Set(selectedLeadIds);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
      // Clean up associated data
      const newPainPoints = { ...leadPainPoints };
      const newSubjects = { ...leadSubjects };
      const newBodies = { ...leadBodies };
      delete newPainPoints[leadId];
      delete newSubjects[leadId];
      delete newBodies[leadId];
      setLeadPainPoints(newPainPoints);
      setLeadSubjects(newSubjects);
      setLeadBodies(newBodies);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeadIds(newSelected);
  };

  // Multi Generator Function - NEW
  const handleGenerateAll = async () => {
    const selectedLeadsWithPainPoints = Array.from(selectedLeadIds)
      .map(id => {
        const lead = leads.find(l => l.id === id);
        const painPoint = leadPainPoints[id];
        return lead && painPoint ? { ...lead, painPoint } : null;
      })
      .filter(Boolean);

    if (selectedLeadsWithPainPoints.length === 0) {
      toast.error('Select leads and add pain points first');
      return;
    }

    setIsGeneratingAll(true);
    try {
      const response = await fetch("https://hook.eu2.make.com/uan4u8urw9pj2vm83ludaiewndyh3que", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leads: selectedLeadsWithPainPoints.map((lead) => ({
            businessName: lead.business_name,
            niche: lead.niche,
            painPoint: lead.painPoint,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Multi-generation failed');
      }

      const data = await response.json();
      
      // Process the response and populate subjects/bodies
      if (data.results && Array.isArray(data.results)) {
        const newSubjects = { ...leadSubjects };
        const newBodies = { ...leadBodies };
        
        data.results.forEach((result: any, index: number) => {
          const lead = selectedLeadsWithPainPoints[index];
          if (lead && result.subject && result.body) {
            newSubjects[lead.id] = result.subject;
            newBodies[lead.id] = result.body;
          }
        });
        
        setLeadSubjects(newSubjects);
        setLeadBodies(newBodies);
      }

      toast.success(`🤖 Generated messages for ${selectedLeadsWithPainPoints.length} targets`);
    } catch (error) {
      console.error('Multi-generation error:', error);
      toast.error('Multi-generation failed - retry operation');
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const handleMultiSend = async () => {
    const readyLeads = Array.from(selectedLeadIds).filter(id => 
      leadSubjects[id]?.trim() && leadBodies[id]?.trim()
    );

    if (readyLeads.length === 0) {
      toast.error('No leads ready - add subjects and bodies');
      return;
    }

    setIsSendingMulti(true);
    try {
      for (const leadId of readyLeads) {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) continue;

        await fetch('https://hook.eu2.make.com/63ztv14n5hwu7yfcdyuo9omdhhudwbx7', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'single',
            business_name: lead.business_name,
            email: lead.email,
            subject: leadSubjects[leadId],
            message: leadBodies[leadId],
          }),
        });
      }
      toast.success(`🎯 ${readyLeads.length} strikes launched successfully`);
    } catch (error) {
      toast.error('Multi-strike failed - check targets');
    } finally {
      setIsSendingMulti(false);
    }
  };

  // Follow-Up Launcher Functions
  const handleFollowUpSend = async () => {
    if (!selectedLead?.email || !followUpSubject || !followUpBody) {
      toast.error('Missing target, subject, or body');
      return;
    }

    setIsSendingFollowUp(true);
    try {
      await fetch('https://hook.eu2.make.com/63ztv14n5hwu7yfcdyuo9omdhhudwbx7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'followup',
          business_name: selectedLead.business_name,
          email: selectedLead.email,
          subject: followUpSubject,
          message: followUpBody,
        }),
      });
      toast.success('🔄 Follow-up strike deployed');
    } catch (error) {
      toast.error('Follow-up failed - retry');
    } finally {
      setIsSendingFollowUp(false);
    }
  };

  // Message Style Switcher Functions
  const handleRewrite = () => {
    if (!originalMessage.trim()) {
      toast.error('Enter original message first');
      return;
    }

    let rewritten = originalMessage.trim();
    
    switch (rewriteTone) {
      case 'Bold':
        rewritten = `🔥 ${rewritten.replace(/\./g, '!')} Let's make this happen!`;
        break;
      case 'Witty':
        rewritten = `😄 ${rewritten} (Just saying what everyone's thinking!)`;
        break;
      case 'Casual':
        rewritten = `Hey! ${rewritten.toLowerCase().replace(/\./g, ' 😊')}`;
        break;
      case 'Professional':
        rewritten = `Dear valued partner, ${rewritten} We look forward to your response.`;
        break;
      case 'Friendly':
        rewritten = `Hi there! ${rewritten} Hope this helps! 🌟`;
        break;
    }
    
    setRewrittenMessage(rewritten);
    toast.success('🎯 Message rewritten successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile-Optimized Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-red-500/30 p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 sm:p-3 rounded-lg shadow-lg">
              <Target size={24} className="text-white sm:w-7 sm:h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>
                STRIKE<span className="text-red-500">HUB</span> V2
              </h1>
              <p className="text-red-400 text-xs sm:text-sm font-semibold tracking-wide">PREMIUM OUTREACH COMMAND CENTER</p>
            </div>
          </div>
          <div className="bg-red-600/20 border border-red-500/50 rounded-lg px-3 py-2 self-start sm:self-auto">
            <span className="text-red-400 text-xs sm:text-sm font-bold">OPERATIONAL STATUS: ACTIVE</span>
          </div>
        </div>
      </header>

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-8">
        {/* Block 1 - Lead Table with Dark Military Theme */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('leads')}
            className="w-full bg-gradient-to-r from-red-600/20 to-orange-600/20 border-b border-red-500/30 p-3 sm:p-4 flex items-center justify-between md:cursor-default"
          >
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                🎯 TARGET ACQUISITION MATRIX
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">Select and analyze potential targets for engagement</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-white transition-transform md:hidden ${collapsedSections.leads ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`${collapsedSections.leads ? 'hidden' : 'block'} md:block`}>
            {/* Lead Table Controls */}
            <div className="p-3 sm:p-4 bg-slate-900/50 border-b border-slate-600/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-white font-bold tracking-wide text-sm sm:text-base">TARGET MANAGEMENT</h3>
                <button 
                  onClick={handleRefresh} 
                  className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 font-bold py-2 px-3 rounded-lg transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm"
                  disabled={loading}
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  <span>REFRESH TARGETS</span>
                </button>
              </div>
              
              {/* Sheet Selection - Enhanced */}
              <div className="flex items-center gap-2 mb-3">
                <label className="text-slate-300 text-xs sm:text-sm font-bold tracking-wide">TARGET DATABASE</label>
                <select
                  className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-xs sm:text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500/20 min-w-[120px]"
                  value={currentSheet}
                  onChange={(e) => setCurrentSheet(e.target.value)}
                  disabled={loadingSheets}
                >
                  {loadingSheets ? (
                    <option>Loading databases...</option>
                  ) : availableSheets.length > 0 ? (
                    availableSheets.map(sheet => (
                      <option key={sheet} value={sheet}>{sheet}</option>
                    ))
                  ) : (
                    <option value="Sheet1">Sheet1</option>
                  )}
                </select>
                {loadingSheets && (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <select 
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-8 pr-3 py-2 text-white text-xs sm:text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                    value={nicheFilter}
                    onChange={(e) => setNicheFilter(e.target.value)}
                  >
                    <option value="">All Sectors</option>
                    {getUniqueNiches().map(niche => (
                      <option key={niche} value={niche}>{niche}</option>
                    ))}
                  </select>
                </div>
                
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <select 
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-8 pr-3 py-2 text-white text-xs sm:text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    {getUniqueStatuses().map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lead Table Content */}
            <div className="max-h-80 sm:max-h-96 overflow-auto">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 bg-red-500/20 rounded-full animate-ping-slow"></div>
                    <p className="mt-3 text-slate-400 text-sm">Scanning targets...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-40">
                  <div className="text-center p-6">
                    <p className="text-red-400 mb-2 text-sm">{error}</p>
                    <p className="text-slate-500 text-xs mb-4">Configure your target database in Builder mode.</p>
                    <button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs">
                      RETRY SCAN
                    </button>
                  </div>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                  <div className="text-center p-6 text-slate-400">
                    <p className="text-sm">No targets match current filters.</p>
                    <button 
                      onClick={() => { setNicheFilter(''); setStatusFilter(''); }} 
                      className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded mt-4 text-xs"
                    >
                      CLEAR FILTERS
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[800px]">
                    <thead className="bg-slate-900/70 sticky top-0 z-10">
                      <tr>
                        <th className="text-left p-3 text-slate-300 font-bold text-xs sm:text-sm border-b border-slate-600/50 whitespace-nowrap min-w-[200px] tracking-wide">TARGET NAME</th>
                        <th className="text-left p-3 text-slate-300 font-bold text-xs sm:text-sm border-b border-slate-600/50 whitespace-nowrap min-w-[200px] tracking-wide">CONTACT VECTOR</th>
                        <th className="text-left p-3 text-slate-300 font-bold text-xs sm:text-sm border-b border-slate-600/50 whitespace-nowrap min-w-[120px] tracking-wide">COMM LINK</th>
                        <th className="text-left p-3 text-slate-300 font-bold text-xs sm:text-sm border-b border-slate-600/50 whitespace-nowrap min-w-[120px] tracking-wide">SECTOR</th>
                        <th className="text-left p-3 text-slate-300 font-bold text-xs sm:text-sm border-b border-slate-600/50 whitespace-nowrap min-w-[100px] tracking-wide">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr 
                          key={lead.id} 
                          className={`hover:bg-slate-700/30 cursor-pointer transition-colors border-b border-slate-700/30 ${
                            selectedLead?.id === lead.id ? 'bg-red-600/10 border-red-500/30' : ''
                          }`}
                          onClick={() => handleLeadSelect(lead)}
                        >
                          <td className="p-3 text-white text-xs sm:text-sm whitespace-nowrap font-medium">{lead.business_name}</td>
                          <td className="p-3 text-slate-300 text-xs sm:text-sm whitespace-nowrap">{lead.email}</td>
                          <td className="p-3 text-slate-300 text-xs sm:text-sm whitespace-nowrap">{lead.phone}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs font-bold border border-blue-500/30">
                              {lead.niche}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                              lead.status === 'New' ? 'bg-green-600/20 text-green-400 border-green-500/30' :
                              lead.status === 'Contacted' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30' :
                              lead.status === 'Responded' ? 'bg-orange-600/20 text-orange-400 border-orange-500/30' :
                              lead.status === 'Converted' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' :
                              'bg-red-600/20 text-red-400 border-red-500/30'
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Block 2 - AI Message Generator */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('ai')}
            className="w-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-500/30 p-3 sm:p-4 flex items-center justify-between md:cursor-default"
          >
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                🤖 AI STRIKE GENERATOR
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">Generate precision-targeted messages with AI assistance</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-white transition-transform md:hidden ${collapsedSections.ai ? 'rotate-180' : ''}`} />
          </button>
          <div className={`${collapsedSections.ai ? 'hidden' : 'block'} md:block p-3 sm:p-6`}>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">TARGET NAME</label>
                <input
                  type="text"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  placeholder="Business name"
                  value={aiBusinessName}
                  onChange={(e) => setAiBusinessName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">SECTOR</label>
                <input
                  type="text"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  placeholder="Industry niche"
                  value={aiNiche}
                  onChange={(e) => setAiNiche(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">PAIN VECTOR</label>
                <input
                  type="text"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  placeholder="Primary pain point"
                  value={aiPainPoint}
                  onChange={(e) => setAiPainPoint(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 sm:px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 text-sm sm:text-base"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>GENERATING STRIKE...</span>
                </>
              ) : (
                <>
                  <Zap size={18} className="sm:w-5 sm:h-5" />
                  <span>GENERATE STRIKE MESSAGE</span>
                </>
              )}
            </button>

            {(aiSubject || aiBody) && (
              <div className="mt-4 sm:mt-6 space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">SUBJECT LINE</label>
                  <input
                    type="text"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-sm sm:text-base"
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                  />
                </div>
                
                {aiBody && (
                  <div>
                    <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">MESSAGE PAYLOAD</label>
                    <textarea
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 h-32 resize-none text-sm sm:text-base"
                      value={aiBody}
                      onChange={(e) => setAiBody(e.target.value)}
                    />
                  </div>
                )}
                
                <button
                  onClick={handleAiSend}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Send size={16} className="sm:w-5 sm:h-5" />
                  <span>LAUNCH STRIKE</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Block 3 - Multi-Hit Sender */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('multi')}
            className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30 p-3 sm:p-4 flex items-center justify-between md:cursor-default"
          >
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                🎯 MULTI-STRIKE DEPLOYMENT
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">Execute coordinated strikes across multiple targets</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-white transition-transform md:hidden ${collapsedSections.multi ? 'rotate-180' : ''}`} />
          </button>
          <div className={`${collapsedSections.multi ? 'hidden' : 'block'} md:block p-3 sm:p-6`}>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-slate-300 text-sm sm:text-base">
                <span className="font-bold">{selectedLeadIds.size}</span> targets selected
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGenerateAll}
                  disabled={isGeneratingAll || selectedLeadIds.size === 0}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  {isGeneratingAll ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>GENERATING...</span>
                    </>
                  ) : (
                    <>
                      <Bot size={16} className="sm:w-5 sm:h-5" />
                      <span>GENERATE ALL</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleMultiSend}
                  disabled={isSendingMulti || selectedLeadIds.size === 0}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  {isSendingMulti ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>DEPLOYING...</span>
                    </>
                  ) : (
                    <>
                      <Target size={16} className="sm:w-5 sm:h-5" />
                      <span>DEPLOY MULTI-STRIKE</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.has(lead.id)}
                      onChange={() => toggleLeadSelection(lead.id)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400 text-xs">Target:</span>
                          <div className="text-white font-semibold truncate">{lead.business_name}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Contact Vector:</span>
                          <div className="text-slate-300 truncate">{lead.email}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Sector:</span>
                          <div className="text-slate-300">{lead.niche}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-xs">Status:</span>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                            lead.status === 'New' ? 'bg-blue-600/20 text-blue-400' :
                            lead.status === 'Contacted' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-green-600/20 text-green-400'
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedLeadIds.has(lead.id) && (
                    <div className="space-y-3 mt-3 pt-3 border-t border-slate-600/50">
                      <input
                        type="text"
                        placeholder="Pain point"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 text-sm"
                        value={leadPainPoints[lead.id] || ''}
                        onChange={(e) => setLeadPainPoints(prev => ({ ...prev, [lead.id]: e.target.value }))}
                      />
                      <input
                        type="text"
                        placeholder="Email subject"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 text-sm"
                        value={leadSubjects[lead.id] || ''}
                        onChange={(e) => setLeadSubjects(prev => ({ ...prev, [lead.id]: e.target.value }))}
                      />
                      <textarea
                        placeholder="Message body"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 text-sm h-20 resize-none"
                        value={leadBodies[lead.id] || ''}
                        onChange={(e) => setLeadBodies(prev => ({ ...prev, [lead.id]: e.target.value }))}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Block 4 - Follow-Up Launcher */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('followup')}
            className="w-full bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-orange-500/30 p-3 sm:p-4 flex items-center justify-between md:cursor-default"
          >
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                🔄 FOLLOW-UP STRIKE LAUNCHER
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">Deploy precision follow-up strikes to engaged targets</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-white transition-transform md:hidden ${collapsedSections.followup ? 'rotate-180' : ''}`} />
          </button>
          <div className={`${collapsedSections.followup ? 'hidden' : 'block'} md:block p-3 sm:p-6`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">TONE PROFILE</label>
                <select
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                  value={followUpTone}
                  onChange={(e) => setFollowUpTone(e.target.value)}
                >
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">CONTEXT INTEL</label>
                <input
                  type="text"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                  placeholder="Previous interaction context"
                  value={followUpContext}
                  onChange={(e) => setFollowUpContext(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">SUBJECT LINE</label>
                <input
                  type="text"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                  placeholder="Follow-up subject"
                  value={followUpSubject}
                  onChange={(e) => setFollowUpSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">MESSAGE PAYLOAD</label>
                <textarea
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 h-32 resize-none text-sm sm:text-base"
                  placeholder="Follow-up message content"
                  value={followUpBody}
                  onChange={(e) => setFollowUpBody(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleFollowUpSend}
              disabled={isSendingFollowUp}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {isSendingFollowUp ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>LAUNCHING...</span>
                </>
              ) : (
                <>
                  <Repeat size={16} className="sm:w-5 sm:h-5" />
                  <span>LAUNCH FOLLOW-UP</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Block 5 - WhatsApp + Insta DM Sender */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('social')}
            className="w-full bg-gradient-to-r from-green-600/20 to-blue-600/20 border-b border-green-500/30 p-3 sm:p-4 flex items-center justify-between md:cursor-default"
          >
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                📱 SOCIAL STRIKE PLATFORM
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">Deploy messages across social channels</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-white transition-transform md:hidden ${collapsedSections.social ? 'rotate-180' : ''}`} />
          </button>
          <div className={`${collapsedSections.social ? 'hidden' : 'block'} md:block p-3 sm:p-6`}>
            <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={() => setSocialChannel('whatsapp')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base ${
                  socialChannel === 'whatsapp'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <MessageSquare size={16} className="sm:w-5 sm:h-5" />
                <span>WHATSAPP</span>
              </button>
              <button
                onClick={() => setSocialChannel('instagram')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base ${
                  socialChannel === 'instagram'
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Instagram size={16} className="sm:w-5 sm:h-5" />
                <span>INSTAGRAM</span>
              </button>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">
                {socialChannel.toUpperCase()} MESSAGE
              </label>
              <textarea
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 h-32 resize-none text-sm sm:text-base"
                placeholder={`Enter your ${socialChannel} message here`}
                value={socialMessage}
                onChange={(e) => setSocialMessage(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => copyToClipboard(socialMessage, `${socialChannel} message copied!`)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>COPY MESSAGE</span>
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Send size={16} className="sm:w-5 sm:h-5" />
                <span>DEPLOY TO {socialChannel.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Block 6 - Message Style Switcher */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('rewrite')}
            className="w-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-indigo-500/30 p-3 sm:p-4 flex items-center justify-between md:cursor-default"
          >
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                🔄 MESSAGE REWRITE ENGINE
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">Transform message tone and style for optimal impact</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-white transition-transform md:hidden ${collapsedSections.rewrite ? 'rotate-180' : ''}`} />
          </button>
          <div className={`${collapsedSections.rewrite ? 'hidden' : 'block'} md:block p-3 sm:p-6`}>
            <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">ORIGINAL MESSAGE</label>
                <textarea
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 h-32 resize-none text-sm sm:text-base"
                  placeholder="Paste your original message here"
                  value={originalMessage}
                  onChange={(e) => setOriginalMessage(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">TONE MODIFIER</label>
                <select
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 mb-4 text-sm sm:text-base"
                  value={rewriteTone}
                  onChange={(e) => setRewriteTone(e.target.value)}
                >
                  <option value="Bold">Bold</option>
                  <option value="Witty">Witty</option>
                  <option value="Casual">Casual</option>
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                </select>
                <button
                  onClick={handleRewrite}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Shuffle size={16} className="sm:w-5 sm:h-5" />
                  <span>REWRITE MESSAGE</span>
                </button>
              </div>
            </div>

            {rewrittenMessage && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-bold mb-2 tracking-wide">REWRITTEN OUTPUT</label>
                  <textarea
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 h-32 resize-none text-sm sm:text-base"
                    value={rewrittenMessage}
                    onChange={(e) => setRewrittenMessage(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(rewrittenMessage, 'Rewritten message copied!')}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base"
                >
                  COPY REWRITTEN MESSAGE
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StrikeHubV2;