import React from 'react';
import Header from '../components/Header';
import LeadTable from '../components/LeadTable';
import MessageGenerator from '../components/MessageGenerator';
import MessageDisplay from '../components/MessageDisplay';
import DataSourceConfig from '../components/DataSourceConfig';

const DemiGod: React.FC = () => {
  return (
    <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
      <section className="lg:col-span-2 flex flex-col min-h-[500px] space-y-4">
        <DataSourceConfig />
        <LeadTable />
      </section>
      
      <section className="flex flex-col gap-4">
        <MessageGenerator />
        <div className="flex-1">
          <MessageDisplay />
        </div>
      </section>
    </main>
  );
};

export default DemiGod;