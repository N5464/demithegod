import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, GeneratedMessages } from '../types';
import { fetchLeadsFromGoogleSheets } from '../services/googleSheets';

interface LeadContextType {
  leads: Lead[];
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  filteredLeads: Lead[];
  loading: boolean;
  error: string | null;
  refreshLeads: () => Promise<void>;
  nicheFilter: string;
  setNicheFilter: (niche: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  generatedMessages: GeneratedMessages | null;
  setGeneratedMessages: (messages: GeneratedMessages | null) => void;
  isGeneratingMessages: boolean;
  setIsGeneratingMessages: (isGenerating: boolean) => void;
  isBuilderMode: boolean;
  setIsBuilderMode: (isBuilder: boolean) => void;
  currentSheet: string;
  setCurrentSheet: (sheet: string) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nicheFilter, setNicheFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [generatedMessages, setGeneratedMessages] = useState<GeneratedMessages | null>(null);
  const [isGeneratingMessages, setIsGeneratingMessages] = useState<boolean>(false);
  const [isBuilderMode, setIsBuilderMode] = useState<boolean>(false);
  const [currentSheet, setCurrentSheet] = useState<string>('Sheet1');

  const checkSheetConfig = () => {
    const url = localStorage.getItem('googleSheetUrl');
    const key = localStorage.getItem('apiKey');
    return url && key;
  };

  const refreshLeads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!checkSheetConfig()) {
        setError('Sheet configuration not found. Please configure your Google Sheet in Builder mode first.');
        setLeads([]);
        return;
      }

      const fetchedLeads = await fetchLeadsFromGoogleSheets(currentSheet);
      setLeads(fetchedLeads);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch leads. Please try again.';
      setError(errorMessage);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLeads();
  }, [currentSheet]);

  const filteredLeads = leads.filter(lead => {
    const matchesNiche = nicheFilter ? lead.niche === nicheFilter : true;
    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    return matchesNiche && matchesStatus;
  });

  return (
    <LeadContext.Provider
      value={{
        leads,
        selectedLead,
        setSelectedLead,
        filteredLeads,
        loading,
        error,
        refreshLeads,
        nicheFilter,
        setNicheFilter,
        statusFilter,
        setStatusFilter,
        generatedMessages,
        setGeneratedMessages,
        isGeneratingMessages,
        setIsGeneratingMessages,
        isBuilderMode,
        setIsBuilderMode,
        currentSheet,
        setCurrentSheet,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};