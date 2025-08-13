import { Lead } from '../types';

export const validateSheetConfig = async (url: string, name: string, key: string): Promise<boolean> => {
  try {
    const sheetId = extractSheetId(url);
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${name}?key=${key}&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('API access denied. Please check if the Google Sheets API is enabled and your API key has the correct permissions.');
      } else if (response.status === 404) {
        throw new Error('Sheet not found. Please verify your sheet URL and name.');
      }
      throw new Error(`Google Sheets API error: ${data.error?.message || response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Sheet configuration validation error:', error);
    throw error;
  }
};

export const fetchSheetNames = async (): Promise<string[]> => {
  const url = localStorage.getItem('googleSheetUrl');
  const key = localStorage.getItem('apiKey');
  
  if (!url || !key) {
    throw new Error('Sheet configuration not found');
  }

  try {
    const sheetId = extractSheetId(url);
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${key}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet names: ${data.error?.message || response.statusText}`);
    }

    return data.sheets
      .map((sheet: any) => sheet.properties.title)
      .filter((name: string) => name !== 'OutreachLog');
  } catch (error) {
    console.error('Error fetching sheet names:', error);
    throw error;
  }
};

export const fetchLeadsFromGoogleSheets = async (sheetName?: string): Promise<Lead[]> => {
  const url = localStorage.getItem('googleSheetUrl');
  const name = sheetName || localStorage.getItem('sheetName') || 'Sheet1';
  const key = localStorage.getItem('apiKey');
  
  if (!url || !key) {
    throw new Error('Sheet configuration not found. Please configure your Google Sheet first.');
  }

  try {
    const sheetId = extractSheetId(url);
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${name}?key=${key}&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Sheets API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error
      });

      if (response.status === 403) {
        throw new Error('API access denied. Please check if the Google Sheets API is enabled and your API key has the correct permissions.');
      } else if (response.status === 404) {
        throw new Error('Sheet not found. Please verify your sheet URL and name.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      }
      
      throw new Error(`Google Sheets API error: ${data.error?.message || response.statusText}`);
    }

    if (!data.values || data.values.length === 0) {
      throw new Error('No data found in the specified sheet.');
    }

    return parseSheetData(data.values);
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    throw error;
  }
};

const extractSheetId = (url: string): string => {
  const match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) {
    throw new Error('Invalid Google Sheets URL format. Please provide a valid Google Sheets URL.');
  }
  return match[1];
};

const parseSheetData = (values: string[][]): Lead[] => {
  const headers = values[0].map(header => header.toLowerCase().replace(/\s+/g, '_'));
  const requiredColumns = ['business_name', 'email', 'phone', 'niche', 'status'];
  
  const missingColumns = requiredColumns.filter(col => !headers.includes(col));
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  return values.slice(1).map((row, index) => {
    const lead: any = { id: (index + 1).toString() };
    headers.forEach((header, i) => {
      if (header === 'tags') {
        lead[header] = row[i] ? row[i].split(',').map((tag: string) => tag.trim()) : [];
      } else {
        lead[header] = row[i] || '';
      }
    });
    return lead as Lead;
  });
};

export const getUniqueNiches = (leads: Lead[]): string[] => {
  return Array.from(new Set(leads.map(lead => lead.niche))).filter(Boolean);
};

export const getUniqueStatuses = (leads: Lead[]): string[] => {
  return Array.from(new Set(leads.map(lead => lead.status))).filter(Boolean);
};

export const updateLeadStatus = async (businessName: string, newStatus: string): Promise<boolean> => {
  const url = localStorage.getItem('googleSheetUrl');
  const name = localStorage.getItem('sheetName');
  const key = localStorage.getItem('apiKey');
  
  if (!url || !name || !key) {
    throw new Error('Sheet configuration not found');
  }

  try {
    const sheetId = extractSheetId(url);
    // In a real implementation, this would update the Google Sheet
    // For now, we'll simulate success
    return true;
  } catch (error) {
    console.error('Error updating status:', error);
    return false;
  }
}