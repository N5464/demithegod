import React, { useMemo, useEffect, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLeads } from '../context/LeadContext';
import { getUniqueNiches, getUniqueStatuses, fetchSheetNames } from '../services/googleSheets';

const LeadTable: React.FC = () => {
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

  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [loadingSheets, setLoadingSheets] = useState(false);

  const uniqueNiches = useMemo(() => getUniqueNiches(leads), [leads]);
  const uniqueStatuses = useMemo(() => getUniqueStatuses(leads), [leads]);

  useEffect(() => {
    const loadSheets = async () => {
      setLoadingSheets(true);
      try {
        const sheets = await fetchSheetNames();
        setAvailableSheets(sheets);
      } catch (error) {
        console.error('Error loading sheet names:', error);
        toast.error('Failed to load available sheets');
      } finally {
        setLoadingSheets(false);
      }
    };

    loadSheets();
  }, []);

  const handleLeadSelect = (lead: any) => {
    setSelectedLead(lead);
  };

  const handleRefresh = async () => {
    try {
      const url = localStorage.getItem('googleSheetUrl');
      const name = localStorage.getItem('sheetName');
      const key = localStorage.getItem('apiKey');

      if (!url || !name || !key) {
        toast.error('Please configure your Google Sheet in Builder mode first');
        return;
      }

      toast.loading('Refreshing leads...', { id: 'refresh' });
      await refreshLeads();
      toast.success('Leads refreshed successfully', { id: 'refresh' });
    } catch (error) {
      console.error('Error refreshing leads:', error);
      toast.error('Failed to refresh leads. Please try again.', { id: 'refresh' });
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Lead Management</h2>
        <button 
          onClick={handleRefresh} 
          className="btn-secondary !py-1 !px-2 flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="sr-only md:not-sr-only md:inline">Refresh</span>
        </button>
      </div>
      
      <div className="p-4 bg-white border-b border-gray-200 space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">🗂 Select Lead Sheet</label>
          <select
            className="select flex-1"
            value={currentSheet}
            onChange={(e) => setCurrentSheet(e.target.value)}
            disabled={loadingSheets}
          >
            {loadingSheets ? (
              <option>Loading sheets...</option>
            ) : (
              availableSheets.map(sheet => (
                <option key={sheet} value={sheet}>{sheet}</option>
              ))
            )}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              className="select pl-9"
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
            >
              <option value="">All Niches</option>
              {uniqueNiches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              className="select pl-9"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-10 bg-primary-500/20 rounded-full animate-ping-slow"></div>
              <p className="mt-3 text-gray-500">Loading leads...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center p-6">
              <p className="text-error-500 mb-2">{error}</p>
              <p className="text-sm text-gray-500 mb-4">Make sure you've configured your Google Sheet correctly in Builder mode.</p>
              <button onClick={handleRefresh} className="btn-primary">Try Again</button>
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center p-6 text-gray-500">
              <p>No leads found matching your filters.</p>
              <button onClick={() => { setNicheFilter(''); setStatusFilter(''); }} className="btn-secondary mt-4">
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-24rem)] overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left p-3 text-gray-600 font-medium text-sm border-b border-gray-200 whitespace-nowrap min-w-[200px]">Business Name</th>
                  <th className="text-left p-3 text-gray-600 font-medium text-sm border-b border-gray-200 whitespace-nowrap min-w-[200px]">Email</th>
                  <th className="text-left p-3 text-gray-600 font-medium text-sm border-b border-gray-200 whitespace-nowrap min-w-[120px]">Phone</th>
                  <th className="text-left p-3 text-gray-600 font-medium text-sm border-b border-gray-200 whitespace-nowrap min-w-[120px]">Niche</th>
                  <th className="text-left p-3 text-gray-600 font-medium text-sm border-b border-gray-200 whitespace-nowrap min-w-[100px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedLead?.id === lead.id ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => handleLeadSelect(lead)}
                  >
                    <td className="p-3 border-b border-gray-200 whitespace-nowrap">{lead.business_name}</td>
                    <td className="p-3 border-b border-gray-200 whitespace-nowrap">{lead.email}</td>
                    <td className="p-3 border-b border-gray-200 whitespace-nowrap">{lead.phone}</td>
                    <td className="p-3 border-b border-gray-200 whitespace-nowrap">
                      <span className="badge badge-primary">{lead.niche}</span>
                    </td>
                    <td className="p-3 border-b border-gray-200 whitespace-nowrap">
                      <span className={`badge ${
                        lead.status === 'New' ? 'badge-primary' :
                        lead.status === 'Contacted' ? 'badge-warning' :
                        lead.status === 'Responded' ? 'badge-warning' :
                        lead.status === 'Converted' ? 'badge-success' :
                        'badge-error'
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
  );
};

export default LeadTable;