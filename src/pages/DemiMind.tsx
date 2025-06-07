import React from 'react';
import { Brain } from 'lucide-react';
import DemiTasks from '../components/mind/DemiTasks';
import MoneyMap from '../components/mind/MoneyMap';
import BuildQueue from '../components/mind/BuildQueue';

const DemiMind: React.FC = () => {
  return (
    <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Brain size={28} className="text-primary-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            🧠 DemiMind – Founder Ops
          </h1>
        </div>
        <p className="text-gray-600 mt-2">
          Organize your founder operations and stay on top of your business tasks.
        </p>
      </div>

      <div className="space-y-8">
        <MoneyMap />
        <BuildQueue />
        <DemiTasks />
      </div>
    </main>
  );
};

export default DemiMind;