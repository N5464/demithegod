import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import DemiTasks from '../components/mind/DemiTasks';
import MoneyMap from '../components/mind/MoneyMap';
import BuildQueue from '../components/mind/BuildQueue';

const DemiMind: React.FC = () => {
  const [pass, setPass] = useState("");

  if (pass !== "demigang5464") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
        <div className="text-2xl font-bold">🕶️ Unauthorized Access Denied</div>
        <p className="text-base max-w-md">
          This isn't just another page — this is <span className="font-semibold">mission control</span>.
        </p>
        <p className="text-sm italic text-gray-500">No pass. No power.</p>

        <input
          type="password"
          placeholder="Enter passcode"
          className="px-4 py-2 border rounded-lg text-center focus:outline-none"
          onChange={(e) => setPass(e.target.value)}
        />

        <button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          onClick={() => setPass(pass)}
        >
          Unlock
        </button>
      </div>
    );
  }

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