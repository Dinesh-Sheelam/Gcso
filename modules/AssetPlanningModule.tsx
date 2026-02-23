import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import ProjectGrid from '../components/ProjectGrid';
import ProjectDetailView from '../components/ProjectDetailView';
import { AIPProject, Innovation } from '../types';
import { Icons } from '../constants';

interface AssetPlanningModuleProps {
  projects: AIPProject[];
  setProjects: React.Dispatch<React.SetStateAction<AIPProject[]>>;
  innovations: Innovation[];
  setInnovations: React.Dispatch<React.SetStateAction<Innovation[]>>;
  onBack: () => void;
  onLogout: () => void;
}

const MOCK_AUDIT_DATA = [
  { activity: 'Asset Valuation Update', from: '$4.2B', to: '$4.8B', user: 'planner.s@jnj.com', time: '2024-05-21 11:15:33' },
  { activity: 'Budget Update', from: '$2.5M', to: '$3.1M', user: 'planner.s@jnj.com', time: '2024-05-20 14:32:01' },
  { activity: 'Innovation Tagging', from: '0/3', to: '1/3', user: 'lead.i@jnj.com', time: '2024-05-20 10:45:00' },
  { activity: 'Phase Shift', from: 'Phase 2', to: 'Phase 3', user: 'admin.h@jnj.com', time: '2024-05-19 09:15:44' },
  { activity: 'LRFP Document Synced', from: 'Not Set', to: 'Linked', user: 'bot.sys@jnj.com', time: '2024-05-18 16:22:11' },
  { activity: 'Project Creation', from: '-', to: 'Asset Name', user: 'planner.s@jnj.com', time: '2024-05-17 14:00:00' },
];

const AssetPlanningModule: React.FC<AssetPlanningModuleProps> = ({ 
  projects, setProjects, innovations, setInnovations, onBack, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'audit'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ from: '', to: '', project: 'All Assets', user: 'All Users' });
  const [searchQuery, setSearchQuery] = useState('');

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.therapeuticArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.asset.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAuditTrail = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Asset Planning Audit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">From Date</label>
            <input type="date" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-700 text-sm font-medium transition-all focus:border-red-500 focus:bg-white" value={filters.from} onChange={e => setFilters({...filters, from: e.target.value})} />
          </div>
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">To Date</label>
            <input type="date" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-700 text-sm font-medium transition-all focus:border-red-500 focus:bg-white" value={filters.to} onChange={e => setFilters({...filters, to: e.target.value})} />
          </div>
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Asset Selection</label>
            <select className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-700 text-sm font-bold cursor-pointer transition-all focus:border-red-500 focus:bg-white appearance-none" value={filters.project} onChange={e => setFilters({...filters, project: e.target.value})}>
              <option>All Assets</option>
              {projects.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">User</label>
            <select className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-700 text-sm font-bold cursor-pointer transition-all focus:border-red-500 focus:bg-white appearance-none" value={filters.user} onChange={e => setFilters({...filters, user: e.target.value})}>
              <option>All Users</option>
              <option>planner.s@jnj.com</option>
              <option>lead.i@jnj.com</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-10 space-x-4">
          <button className="flex items-center space-x-2 px-8 py-4 bg-red-50 text-red-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-100 transition-all border border-red-100 active:scale-95 shadow-sm">
            <span className="text-red-500">📊</span>
            <span>Export Excel</span>
          </button>
          <button className="px-12 py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 active:scale-95">Go</button>
        </div>
      </div>
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-200">
              <th className="px-10 py-5">Activity</th>
              <th className="px-10 py-5">Changed From</th>
              <th className="px-10 py-5">Changed To</th>
              <th className="px-10 py-5">User</th>
              <th className="px-10 py-5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_AUDIT_DATA.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-10 py-6 text-[14px] font-medium text-slate-700 tracking-tight">{item.activity}</td>
                <td className="px-10 py-6">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg italic border border-slate-200/50">{item.from}</span>
                </td>
                <td className="px-10 py-6">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 italic">{item.to}</span>
                </td>
                <td className="px-10 py-6 text-sm font-medium text-slate-600">{item.user}</td>
                <td className="px-10 py-6 text-[11px] text-slate-500 font-semibold tracking-tight">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (selectedProject) {
      return (
        <ProjectDetailView 
          project={selectedProject}
          innovations={innovations.filter(i => i.projectId === selectedProject.id)}
          onAddInnovation={(i) => setInnovations(prev => [i, ...prev])}
          onBack={() => setSelectedProjectId(null)}
        />
      );
    }
    switch (activeTab) {
      case 'dashboard': return <Dashboard projects={projects} innovations={innovations} />;
      case 'projects': return <ProjectGrid projects={filteredProjects} onAddProject={(p) => setProjects(prev => [p, ...prev])} onSelectProject={(id) => setSelectedProjectId(id)} />;
      case 'audit': return renderAuditTrail();
      default: return null;
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar activeTab={activeTab as any} setActiveTab={(tab) => { setActiveTab(tab as any); setSelectedProjectId(null); }} onBack={onBack} onLogout={onLogout} moduleName="Asset Planning" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center space-x-3">
             <button onClick={selectedProjectId ? () => setSelectedProjectId(null) : onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 transition-colors tracking-tight font-black">
               <span className="text-xl">←</span>
             </button>
          </div>
          <div className="flex items-center space-x-4">
             {!selectedProjectId && activeTab === 'projects' && (
               <div className="relative group mr-4">
                 <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search assets..."
                   className="bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2 text-sm font-medium outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600/30 transition-all w-80"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
             )}
             <div className="px-5 py-2.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-sm">
               {projects.length} ASSETS
             </div>
             <div className="w-10 h-10 bg-[#D30303] rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95">
               AIP
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AssetPlanningModule;