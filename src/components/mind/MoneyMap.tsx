import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = 'https://tawbsjqosxdtqsskaddy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd2JzanFvc3hkdHFzc2thZGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzMwMjAsImV4cCI6MjA2NDU0OTAyMH0.ASP0YqSdpcLj_FmLyOyme1iLYm2Z8CbJyrNJVREiZ6U';
const supabase = createClient(supabaseUrl, supabaseKey);

interface MoneyEntry {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  created_at: Date;
  user_id: string;
}

const MoneyMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  const [entries, setEntries] = useState<MoneyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Hardcoded user ID to match RLS policy
  const userId = 'demigod_owner';

  // Fetch entries from Supabase
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('moneymap')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedEntries = data?.map(entry => ({
        ...entry,
        created_at: new Date(entry.created_at)
      })) || [];

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to load money entries');
    } finally {
      setLoading(false);
    }
  };

  // Add new entry to Supabase
  const addEntry = async () => {
    if (!newEntry.amount || !newEntry.description || !newEntry.date) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('moneymap')
        .insert([
          {
            user_id: 'demigod_owner', // Hardcoded user_id for RLS policy
            type: activeTab,
            description: newEntry.description,
            amount: parseFloat(newEntry.amount),
            date: newEntry.date
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state
      const formattedEntry: MoneyEntry = {
        ...data,
        created_at: new Date(data.created_at)
      };

      setEntries(prev => [formattedEntry, ...prev]);

      // Reset form
      setNewEntry({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      toast.success(`${activeTab === 'income' ? 'Income' : 'Expense'} added successfully`);
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error('Failed to add entry');
    }
  };

  // Delete entry from Supabase
  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('moneymap')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setEntries(prev => prev.filter(entry => entry.id !== id));
      toast.success('Entry deleted successfully');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  // Load entries on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  const calculateTotal = (type: 'income' | 'expense') => {
    return entries
      .filter(entry => entry.type === type)
      .reduce((sum, entry) => sum + entry.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const currentEntries = entries.filter(entry => entry.type === activeTab);
  const incomeTotal = calculateTotal('income');
  const expenseTotal = calculateTotal('expense');
  const netProfit = incomeTotal - expenseTotal;

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-primary-500/20 rounded-full animate-ping-slow"></div>
          <p className="mt-3 text-gray-500">Loading money data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-success-50 border-success-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-success-600" />
            <h3 className="font-medium text-success-800">Total Income</h3>
          </div>
          <p className="text-2xl font-bold text-success-700">
            {formatCurrency(incomeTotal)}
          </p>
        </div>

        <div className="card p-4 bg-error-50 border-error-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={20} className="text-error-600" />
            <h3 className="font-medium text-error-800">Total Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-error-700">
            {formatCurrency(expenseTotal)}
          </p>
        </div>

        <div className={`card p-4 ${netProfit >= 0 ? 'bg-primary-50 border-primary-200' : 'bg-warning-50 border-warning-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className={netProfit >= 0 ? 'text-primary-600' : 'text-warning-600'} />
            <h3 className={`font-medium ${netProfit >= 0 ? 'text-primary-800' : 'text-warning-800'}`}>Net Profit</h3>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-primary-700' : 'text-warning-700'}`}>
            {formatCurrency(netProfit)}
          </p>
        </div>
      </div>

      {/* Main MoneyMap Card */}
      <div className="card">
        {/* Header with Tabs */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-primary-500" />
              <h2 className="text-lg font-semibold">MoneyMap</h2>
            </div>
            <div className="text-sm text-gray-600">
              Current Total: <span className="font-semibold">{formatCurrency(calculateTotal(activeTab))}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              className={`tab ${activeTab === 'income' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('income')}
            >
              <TrendingUp size={16} className="mr-1" />
              Income ({entries.filter(e => e.type === 'income').length})
            </button>
            <button
              className={`tab ${activeTab === 'expense' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('expense')}
            >
              <TrendingDown size={16} className="mr-1" />
              Expenses ({entries.filter(e => e.type === 'expense').length})
            </button>
          </div>
        </div>

        {/* Add New Entry Form */}
        <div className="p-4 bg-white border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Add New {activeTab === 'income' ? 'Income' : 'Expense'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                className="input"
                value={newEntry.amount}
                onChange={(e) => setNewEntry(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder={activeTab === 'income' ? 'Income source' : 'Expense description'}
                className="input"
                value={newEntry.description}
                onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2">
              <input
                type="date"
                className="input flex-1"
                value={newEntry.date}
                onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
              />
              <button
                onClick={addEntry}
                disabled={!newEntry.amount || !newEntry.description || !newEntry.date}
                className="btn-primary px-3 flex items-center justify-center"
                title="Add entry"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Entries List */}
        <div className="max-h-96 overflow-y-auto">
          {currentEntries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                No {activeTab} entries yet
              </p>
              <p>
                Add your first {activeTab === 'income' ? 'income source' : 'expense'} to start tracking your finances.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {currentEntries.map(entry => (
                <div key={entry.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-lg font-semibold ${
                          entry.type === 'income' ? 'text-success-600' : 'text-error-600'
                        }`}>
                          {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {entry.description}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-gray-400 hover:text-error-500 transition-colors rounded-md hover:bg-error-50"
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoneyMap;