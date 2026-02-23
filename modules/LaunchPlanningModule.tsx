import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import LaunchPlanner from '../components/LaunchPlanner';
import { AIPProject } from '../types';
import { Icons } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

interface LaunchPlanningModuleProps {
  projects: AIPProject[];
  setProjects: React.Dispatch<React.SetStateAction<AIPProject[]>>;
  onBack: () => void;
  onLogout: () => void;
}

const REGIONAL_DATA = [
  { name: 'North America', value: 42, color: '#10b981' },
  { name: 'EMEA', value: 28, color: '#3b82f6' },
  { name: 'APAC', value: 18, color: '#f59e0b' },
  { name: 'LATAM', value: 12, color: '#ef4444' },
];

const TA_DATA = [
  { name: 'Oncology', count: 4 },
  { name: 'Immunology', count: 5 },
  { name: 'Neuroscience', count: 2 },
  { name: 'Cardiovascular', count: 1 },
  { name: 'PH', count: 2 },
];

const READINESS_DATA = [
  { subject: 'Regulatory', A: 88, fullMark: 100 },
  { subject: 'Supply Chain', A: 72, fullMark: 100 },
  { subject: 'Marketing', A: 92, fullMark: 100 },
  { subject: 'Field Force', A: 65, fullMark: 100 },
  { subject: 'Access', A: 78, fullMark: 100 },
];

const UPCOMING_MILESTONES = [
  { milestone: 'EMA Submission', project: 'Asset Name', date: '2024-06-15', owner: 'Regulatory', status: 'In Progress' },
  { milestone: 'Manufacturing Readiness', project: 'Asset Name', date: '2024-06-22', owner: 'Operations', status: 'Planned' },
  { milestone: 'Field Force Training', project: 'Asset Name', date: '2024-07-05', owner: 'Commercial', status: 'Planned' },
  { milestone: 'Labeling Finalization', project: 'Asset Name', date: '2024-07-12', owner: 'Medical Affairs', status: 'At Risk' },
  { milestone: 'Market Access Approval', project: 'Asset Name', date: '2024-07-28', owner: 'Market Access', status: 'In Progress' },
  { milestone: 'Distribution Kickoff', project: 'Asset Name', date: '2024-08-04', owner: 'Logistics', status: 'Planned' },
];

const MOCK_AUDIT_DATA = [
  { activity: 'Milestone Date Update', from: '2024-11-15', to: '2024-12-01', user: 'lead.l@jnj.com', time: '2024-05-21 10:20:00' },
  { activity: 'Supply Chain Sync', from: 'Initial Draft', to: 'Synchronized', user: 'ops.m@jnj.com', time: '2024-05-21 09:45:12' },
  { activity: 'Regulatory Status', from: 'Submitted', to: 'Under Review', user: 'compliance.o@jnj.com', time: '2024-05-20 16:30:00' },
  { activity: 'Budget Approval', from: 'Pending', to: 'Approved', user: 'finance.a@jnj.com', time: '2024-05-20 14:15:22' },
];

const LaunchPlanningModule: React.FC<LaunchPlanningModuleProps> = ({ projects, setProjects, onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'audit'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.therapeuticArea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Launches', value: projects.length.toString(), color: 'text-slate-900', icon: '🚀' },
          { label: 'On Track', value: '8', color: 'text-emerald-600', icon: '✅' },
          { label: 'At Risk', value: '2', color: 'text-amber-500', icon: '⚠️' },
          { label: 'Completed', value: '2', color: 'text-blue-600', icon: '🏁' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
              <h3 className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</h3>
            </div>
            <span className="text-3xl grayscale opacity-40">{kpi.icon}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regional Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center">
             <span className="w-1.5 h-4 bg-emerald-500 rounded-full mr-3"></span>
             Regional Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={REGIONAL_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {REGIONAL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TA Breakdown */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center">
             <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-3"></span>
             Therapeutic Area Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TA_DATA} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: '700'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Milestone Status Overview */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">Milestone Status Overview</h3>
          <div className="space-y-6">
            {[
              { label: 'Completed', value: 48, color: 'bg-emerald-500' },
              { label: 'In Progress', value: 25, color: 'bg-blue-500' },
              { label: 'Planned', value: 20, color: 'bg-slate-300' },
              { label: 'At Risk', value: 7, color: 'bg-red-500' },
            ].map((status, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                  <span className="text-slate-500">{status.label}</span>
                  <span className="text-slate-800">{status.value}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden">
                  <div className={`h-full ${status.color}`} style={{ width: `${status.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Scorecard */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Readiness by Domain</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={READINESS_DATA}>
                 <PolarGrid stroke="#e2e8f0" />
                 <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 9, fontWeight: '800'}} />
                 <Radar name="Readiness" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
               </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Risk Matrix & Upcoming Milestones Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Matrix Heatmap */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Portfolio Risk Matrix</h3>
          <div className="grid grid-cols-4 grid-rows-4 gap-2 aspect-square max-w-sm mx-auto">
             {/* 4x4 Grid - Conceptual Heatmap */}
             {Array.from({ length: 16 }).map((_, i) => {
               const row = Math.floor(i / 4);
               const col = i % 4;
               const opacity = (row + col) / 6;
               const color = row < 2 ? 'bg-red-500' : col > 2 ? 'bg-amber-400' : 'bg-emerald-500';
               return (
                 <div key={i} className={`rounded-lg ${color} transition-all hover:scale-105 flex items-center justify-center`} style={{ opacity: 0.2 + (opacity * 0.8) }}>
                    {(i === 1 || i === 5 || i === 14) && <span className="w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></span>}
                 </div>
               );
             })}
          </div>
          <div className="mt-6 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
            <span>Low Impact</span>
            <span>High Impact</span>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Upcoming Milestones (90 Days)</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-6 py-4">Milestone</th>
                  <th className="px-6 py-4">Target Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {UPCOMING_MILESTONES.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-800 leading-tight">{m.milestone}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{m.project}</p>
                    </td>
                    <td className="px-6 py-5 text-xs font-black text-slate-500">{m.date}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                        m.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 
                        m.status === 'At Risk' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                      }`}>{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuditTrail = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Launch Execution Audit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Launch Selection</label>
            <select className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-700 text-sm font-bold cursor-pointer transition-all focus:border-emerald-500 focus:bg-white appearance-none">
              <option>All Launches</option>
              {projects.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">User</label>
            <select className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-700 text-sm font-bold cursor-pointer transition-all focus:border-emerald-500 focus:bg-white appearance-none">
              <option>All Users</option>
              <option>lead.l@jnj.com</option>
              <option>ops.m@jnj.com</option>
            </select>
          </div>
          <button className="px-12 py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">Filter Logs</button>
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
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 italic">{item.to}</span>
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

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar activeTab={activeTab as any} setActiveTab={(tab) => { setActiveTab(tab as any); setSelectedProjectId(null); }} onBack={onBack} onLogout={onLogout} moduleName="Launch Planning" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-3">
             <button onClick={selectedProjectId ? () => setSelectedProjectId(null) : onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><span className="text-xl">←</span></button>
             <h1 className="text-xl font-bold text-slate-800 tracking-tight">Launch Intelligence</h1>
          </div>
          <div className="flex items-center space-x-4">
             {!selectedProjectId && activeTab === 'projects' && (
               <div className="relative group">
                 <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search Projects"
                   className="bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all w-80"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
             )}
             <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg cursor-pointer">LH</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' ? renderDashboard() : activeTab === 'audit' ? renderAuditTrail() : (
              <LaunchPlanner 
                projects={filteredProjects} 
                selectedProjectId={selectedProjectId} 
                onSelectProject={setSelectedProjectId}
                onAddLaunch={(newLaunch) => setProjects(prev => [newLaunch, ...prev])}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LaunchPlanningModule;