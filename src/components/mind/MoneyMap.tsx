import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown, Banknote } from 'lucide-react';
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
      toast.error('Failed to load financial intelligence');
    } finally {
      setLoading(false);
    }
  };

  // Add new entry to Supabase
  const addEntry = async () => {
    if (!newEntry.amount || !newEntry.description || !newEntry.date) {
      toast.error('All fields required for financial entry');
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

      toast.success(`Financial ${activeTab} logged successfully`);
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error('Failed to log financial entry');
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
      toast.success('Financial entry deleted');
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
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-green-500/20 rounded-full animate-ping-slow"></div>
          <p className="mt-3 text-slate-400">Loading financial intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards - Military Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/50 rounded-xl p-4">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-600/30 p-2 rounded-lg">
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <h3 className="font-black text-green-400 tracking-wide text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>
                TOTAL INCOME
              </h3>
            </div>
            <p className="text-2xl font-black text-white">
              {formatCurrency(incomeTotal)}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/50 rounded-xl p-4">
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-600/30 p-2 rounded-lg">
                <TrendingDown size={20} className="text-red-400" />
              </div>
              <h3 className="font-black text-red-400 tracking-wide text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>
                TOTAL EXPENSES
              </h3>
            </div>
            <p className="text-2xl font-black text-white">
              {formatCurrency(expenseTotal)}
            </p>
          </div>
        </div>

        <div className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-4 ${netProfit >= 0 ? 'border-blue-500/50' : 'border-yellow-500/50'}`}>
          <div className={`rounded-lg p-4 ${netProfit >= 0 ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20' : 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-blue-600/30' : 'bg-yellow-600/30'}`}>
                <DollarSign size={20} className={netProfit >= 0 ? 'text-blue-400' : 'text-yellow-400'} />
              </div>
              <h3 className={`font-black tracking-wide text-sm ${netProfit >= 0 ? 'text-blue-400' : 'text-yellow-400'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                NET PROFIT
              </h3>
            </div>
            <p className="text-2xl font-black text-white">
              {formatCurrency(netProfit)}
            </p>
          </div>
        </div>
      </div>

      {/* Main MoneyMap Card - Military Style */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-green-500/30 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600/30 p-3 rounded-lg border border-green-500/50">
                <Banknote size={24} className="text-green-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
                  💰 MONEY MAP
                </h2>
                <p className="text-green-400 text-sm font-semibold">Financial Operations Center</p>
              </div>
            </div>
            <div className="text-slate-300 text-sm">
              <span className="font-bold">{formatCurrency(calculateTotal(activeTab))}</span>
              <div className="text-xs text-slate-500">Current Total</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                activeTab === 'income' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
              onClick={() => setActiveTab('income')}
            >
              <TrendingUp size={16} />
              <span className="tracking-wide">INCOME ({entries.filter(e => e.type === 'income').length})</span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                activeTab === 'expense' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
              onClick={() => setActiveTab('expense')}
            >
              <TrendingDown size={16} />
              <span className="tracking-wide">EXPENSES ({entries.filter(e => e.type === 'expense').length})</span>
            </button>
          </div>
        </div>

        {/* Add New Entry Form */}
        <div className="p-4 sm:p-6 bg-slate-900/30 border-b border-slate-600/50">
          <h3 className="text-slate-300 text-sm font-bold mb-4 tracking-wide">
            LOG NEW {activeTab.toUpperCase()} ENTRY
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <input
                type="number"
                step="0.01"
                placeholder="Amount ($)"
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                value={newEntry.amount}
                onChange={(e) => setNewEntry(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder={activeTab === 'income' ? 'Income source' : 'Expense description'}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                value={newEntry.description}
                onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                value={newEntry.date}
                onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
              />
              <button
                onClick={addEntry}
                disabled={!newEntry.amount || !newEntry.description || !newEntry.date}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                title="Log entry"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Entries List */}
        <div className="max-h-96 overflow-y-auto">
          {currentEntries.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <DollarSign size={48} className="mx-auto mb-4 text-slate-600" />
              <p className="text-lg font-medium mb-2">
                No {activeTab} entries logged
              </p>
              <p className="text-sm">
                Begin tracking your {activeTab === 'income' ? 'revenue streams' : 'operational expenses'}.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {currentEntries.map(entry => (
                <div key={entry.id} className="p-4 hover:bg-slate-700/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-lg font-black ${
                          entry.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                        </span>
                        <span className="text-white font-semibold">
                          {entry.description}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 font-mono">
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
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-md hover:bg-red-600/10"
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