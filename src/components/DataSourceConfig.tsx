import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLeads } from '../context/LeadContext';
import { validateSheetConfig } from '../services/googleSheets';

const DataSourceConfig: React.FC = () => {
  const { isBuilderMode, refreshLeads } = useLeads();
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem('googleSheetUrl');
    const savedName = localStorage.getItem('sheetName');
    const savedKey = localStorage.getItem('apiKey');
    
    if (savedUrl) setGoogleSheetUrl(savedUrl);
    if (savedName) setSheetName(savedName);
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSave = async () => {
    if (!googleSheetUrl || !sheetName || !apiKey) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsValidating(true);
    try {
      await validateSheetConfig(googleSheetUrl, sheetName, apiKey);

      localStorage.setItem('googleSheetUrl', googleSheetUrl);
      localStorage.setItem('sheetName', sheetName);
      localStorage.setItem('apiKey', apiKey);

      await refreshLeads();
      toast.success('✅ Configuration saved successfully');
    } catch (error) {
      console.error('Configuration error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to validate configuration');
    } finally {
      setIsValidating(false);
    }
  };

  if (!isBuilderMode) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Database size={20} className="text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900">Data Source Configuration</h2>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="googleSheetUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Google Sheet URL
          </label>
          <input
            type="text"
            id="googleSheetUrl"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={googleSheetUrl}
            onChange={(e) => setGoogleSheetUrl(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sheetName" className="block text-sm font-medium text-gray-700 mb-2">
            Sheet Name
          </label>
          <input
            type="text"
            id="sheetName"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Sheet1"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            Google Sheets API Key
          </label>
          <input
            type="password"
            id="apiKey"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Your API key here"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isValidating}
          className="w-full bg-primary-500 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isValidating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Validating...</span>
            </>
          ) : (
            <span>Save Configuration</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default DataSourceConfig;