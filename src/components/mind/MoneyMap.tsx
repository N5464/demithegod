import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface MoneyEntry {
  id: string;
  amount: number;
  source: string;
  date: string;
  createdAt: Date;
}

interface MoneyData {
  income: MoneyEntry[];
  expenses: MoneyEntry[];
}

const MoneyMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const [data, setData] = useState<MoneyData>({
    income: [],
    expenses: []
  });
  const [newEntry, setNewEntry] = useState({
    amount: '',
    source: '',
    date: new Date().toISOString().split('T')[0]
  });

  const addEntry = () => {
    if (!newEntry.amount || !newEntry.source || !newEntry.date) return;

    const entry: MoneyEntry = {
      id: Date.now().toString(),
      amount: parseFloat(newEntry.amount),
      source: newEntry.source,
      date: newEntry.date,
      createdAt: new Date()
    };

    setData(prev => ({
      ...prev,
      [activeTab]: [entry, ...prev[activeTab]]
    }));

    setNewEntry({
      amount: '',
      source: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deleteEntry = (id: string) => {
    setData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(entry => entry.id !== id)
    }));
  };

  const calculateTotal = (entries: MoneyEntry[]) => {
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const currentEntries = data[activeTab];
  const currentTotal = calculateTotal(currentEntries);
  const incomeTotal = calculateTotal(data.income);
  const expensesTotal = calculateTotal(data.expenses);
  const netProfit = incomeTotal - expensesTotal;

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
            {formatCurrency(expensesTotal)}
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
              Current Total: <span className="font-semibold">{formatCurrency(currentTotal)}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              className={`tab ${activeTab === 'income' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('income')}
            >
              <TrendingUp size={16} className="mr-1" />
              Income ({data.income.length})
            </button>
            <button
              className={`tab ${activeTab === 'expenses' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('expenses')}
            >
              <TrendingDown size={16} className="mr-1" />
              Expenses ({data.expenses.length})
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
                placeholder={activeTab === 'income' ? 'Income source' : 'Expense reason'}
                className="input"
                value={newEntry.source}
                onChange={(e) => setNewEntry(prev => ({ ...prev, source: e.target.value }))}
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
                disabled={!newEntry.amount || !newEntry.source || !newEntry.date}
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
                          activeTab === 'income' ? 'text-success-600' : 'text-error-600'
                        }`}>
                          {activeTab === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {entry.source}
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