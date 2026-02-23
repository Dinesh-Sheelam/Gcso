
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Icons } from '../constants';
import { AIPProject } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface AccessGovernanceModuleProps {
  aipProjects: AIPProject[];
  launchProjects: AIPProject[];
  onBack: () => void;
  onLogout: () => void;
}

type GovTab = 'dashboard' | 'grant';
type AccessLevel = 'view' | 'edit' | 'admin';

const MOCK_USERS = [
  { name: 'Sarah Connor', email: 'sarah.c@jnj.com', avatar: 'SC' },
  { name: 'John Miller', email: 'john.m@jnj.com', avatar: 'JM' },
  { name: 'Ellen Ripley', email: 'ellen.r@jnj.com', avatar: 'ER' },
  { name: 'James Holden', email: 'james.h@jnj.com', avatar: 'JH' },
];

const ROLE_DATA = [
  { name: 'Admin', value: 12, color: '#6366f1' },
  { name: 'Launcher', value: 230, color: '#10b981' },
  { name: 'Planner', value: 186, color: '#f43f5e' },
];

const PERMISSION_DATA = [
  { name: 'View Only', count: 248, color: '#94a3b8' },
  { name: 'Full Edit', count: 142, color: '#6366f1' },
  { name: 'Admin Access', count: 38, color: '#4338ca' },
];

const CROSS_MODULE_STATS = [
  { metric: 'Total Permissions', aip: 342, launch: 287 },
  { metric: 'Unique Users', aip: 186, launch: 142 },
  { metric: 'Admin Level', aip: 12, launch: 8 },
  { metric: 'Edit Level', aip: 98, launch: 76 },
  { metric: 'View Level', aip: 232, launch: 203 },
];

const AccessGovernanceModule: React.FC<AccessGovernanceModuleProps> = ({ aipProjects, launchProjects, onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState<GovTab>('dashboard');
  
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedModules, setSelectedModules] = useState<('aip' | 'launch')[]>(['launch']);
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([]);
  const [entitySearchQuery, setEntitySearchQuery] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('view');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProjectListOpen, setIsProjectListOpen] = useState(true);

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const toggleModule = (mod: 'aip' | 'launch') => {
    setSelectedModules(prev => {
      const isAlreadySelected = prev.includes(mod);
      if (isAlreadySelected) {
        if (prev.length === 1) return prev; 
        return prev.filter(m => m !== mod);
      } else {
        return [...prev, mod];
      }
    });
    setSelectedEntityIds([]);
  };

  const currentOptions = [
    ...(selectedModules.includes('aip') ? aipProjects : []),
    ...(selectedModules.includes('launch') ? launchProjects : [])
  ];

  const filteredEntities = currentOptions.filter(o => 
    o.name.toLowerCase().includes(entitySearchQuery.toLowerCase())
  );

  const toggleEntitySelection = (id: string) => {
    setSelectedEntityIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEntityIds.length === currentOptions.length) {
      setSelectedEntityIds([]);
    } else {
      setSelectedEntityIds(currentOptions.map(o => o.id));
    }
  };

  const handleGrant = () => {
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* 1. User Management KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'TOTAL USERS', value: '428', icon: '👥', trend: '+14 this month', color: 'text-slate-900' },
          { label: 'ACTIVE TODAY', value: '127', icon: '⚡', trend: '30% of base', color: 'text-indigo-600' },
          { label: 'LAUNCH SCOPE', value: launchProjects.length.toString(), icon: '🚀', trend: 'Active Assets', color: 'text-emerald-600' },
          { label: 'AIP SCOPE', value: aipProjects.length.toString(), icon: '🔬', trend: 'Active Assets', color: 'text-red-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
              <h3 className={`text-4xl font-black ${kpi.color}`}>{kpi.value}</h3>
              <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{kpi.trend}</p>
            </div>
            <span className="text-3xl grayscale opacity-30">{kpi.icon}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. User Distribution by Role */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full mr-3"></span>
            USER DISTRIBUTION BY ROLE
          </h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ROLE_DATA} cx="40%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                  {ROLE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ paddingLeft: '20px', fontSize: '12px', fontWeight: '700', color: '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Permission Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center">
            <span className="w-1.5 h-4 bg-slate-400 rounded-full mr-3"></span>
            ACCESS LEVEL DISTRIBUTION
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERMISSION_DATA} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: '700'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                  {PERMISSION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 4. Cross-Module Access Summary */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">CROSS-MODULE ACCESS SUMMARY</h3>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div><span className="text-[10px] font-bold text-slate-400">AIP</span></div>
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div><span className="text-[10px] font-bold text-slate-400">LAUNCH</span></div>
            </div>
          </div>
          <div className="space-y-6">
            {CROSS_MODULE_STATS.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{stat.metric}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full transition-all" style={{ width: `${(stat.aip / 400) * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-800">{stat.aip}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(stat.launch / 400) * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-800">{stat.launch}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. System Health */}
        <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
           <h3 className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-8">SYSTEM HEALTH</h3>
           <div className="space-y-8">
              {[
                { label: 'API Response', val: '24ms', color: 'bg-emerald-400' },
                { label: 'Active Sessions', val: '86', color: 'bg-emerald-400' },
                { label: 'Error Rate', val: '0.02%', color: 'bg-emerald-400' },
                { label: 'DB Latency', val: '4ms', color: 'bg-emerald-400' },
              ].map((h, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                   <div>
                      <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">{h.label}</p>
                      <p className="text-xl font-black mt-0.5">{h.val}</p>
                   </div>
                   <div className={`w-2 h-2 rounded-full ${h.color} animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]`}></div>
                </div>
              ))}
              <div className="pt-4">
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">View Cloud Logs</button>
              </div>
           </div>
        </div>
      </div>

      {/* 6. Recent Access Changes */}
      <div className="bg-[#F8F9FB] rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 pb-6 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Access Changes</h3>
          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Download Audit Trail</button>
        </div>
        <div className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200">
                <th className="px-10 py-6">Action</th>
                <th className="px-10 py-6">User</th>
                <th className="px-10 py-6">Module / Resource</th>
                <th className="px-10 py-6">Permission</th>
                <th className="px-10 py-6 text-right">Time / By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { action: 'Granted', user: 'john.m@jnj.com', resource: 'Asset-X (AIP)', level: 'EDIT', time: '2h ago', by: 'Admin Hub' },
                { action: 'Revoked', user: 'sarah.c@jnj.com', resource: 'Asset Launch', level: 'VIEW', time: '4h ago', by: 'Admin Hub' },
                { action: 'Updated', user: 'ellen.r@jnj.com', resource: 'All Planning Modules', level: 'ADMIN', time: '1d ago', by: 'System' },
                { action: 'Granted', user: 'james.h@jnj.com', resource: 'Dermatology Portfolio', level: 'VIEW', time: '2d ago', by: 'Admin Hub' }
              ].map((log, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-8">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${log.action === 'Revoked' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-sm text-slate-500 font-bold">{log.user}</td>
                  <td className="px-10 py-8 text-sm font-bold text-slate-800 uppercase tracking-tight">{log.resource}</td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.level}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <p className="text-[11px] font-black text-slate-800">{log.time}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">by {log.by}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderGrantAccess = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-12">
        <section className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">STEP 1: TARGET PLATFORM USER</h3>
          
          <div className="relative group">
            <Icons.Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Users"
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-slate-700 font-bold text-sm shadow-sm"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
            
            {userSearchQuery && filteredUsers.length > 0 && (
               <div className="absolute z-50 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  {filteredUsers.map(user => (
                    <button 
                      key={user.email} 
                      onClick={() => { setSelectedUser(user); setUserSearchQuery(''); }} 
                      className="w-full flex items-center space-x-4 px-6 py-3 hover:bg-slate-50 transition-colors text-left"
                    >
                       <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">{user.avatar}</div>
                       <div><p className="text-[14px] font-bold text-slate-800">{user.name}</p><p className="text-[11px] font-medium text-slate-400">{user.email}</p></div>
                    </button>
                  ))}
               </div>
            )}
          </div>
          
          {selectedUser && (
            <div className="flex items-center space-x-5 p-4 bg-indigo-50/20 rounded-2xl border-2 border-indigo-600 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md">{selectedUser.avatar}</div>
               <div className="flex-1">
                 <p className="text-[15px] font-bold text-indigo-900 leading-tight">{selectedUser.name}</p>
                 <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">{selectedUser.email}</p>
               </div>
               <div className="px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-[9px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">SELECTED</div>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">STEP 2: SELECT MODULE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => toggleModule('aip')} 
              className={`flex flex-col items-start p-7 rounded-[2rem] border-2 transition-all text-left group ${selectedModules.includes('aip') ? 'border-red-600 bg-red-50/10 shadow-md ring-2 ring-red-600/20' : 'border-slate-50 bg-[#F9F9F9] hover:border-slate-200'}`}
            >
              <div className={`w-10 h-10 rounded-lg shadow-sm flex items-center justify-center mb-5 transition-all ${selectedModules.includes('aip') ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-white text-slate-400'}`}>
                <Icons.Project className="w-5 h-5" />
              </div>
              <h4 className="font-black text-[17px] text-slate-900 mb-1">Asset Innovation Planning</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed italic font-medium">Early-stage asset evaluation domain.</p>
            </button>
            <button 
              onClick={() => toggleModule('launch')} 
              className={`flex flex-col items-start p-7 rounded-[2rem] border-2 transition-all text-left group ${selectedModules.includes('launch') ? 'border-emerald-600 bg-emerald-50/10 shadow-md ring-2 ring-emerald-600/20' : 'border-slate-50 bg-[#F9F9F9] hover:border-slate-200'}`}
            >
              <div className={`w-10 h-10 rounded-lg shadow-sm flex items-center justify-center mb-5 transition-all ${selectedModules.includes('launch') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-400'}`}>
                <Icons.Launch className="w-5 h-5" />
              </div>
              <h4 className="font-black text-[17px] text-slate-900 mb-1">Launch Planning</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed italic font-medium">Commercial market entry domain.</p>
            </button>
          </div>
        </section>

        <section className="bg-[#F9FAFC] p-10 rounded-[2.5rem] border border-slate-100 space-y-12">
          <div className="space-y-10">
            {/* Specific Selection - Now Full Width Dropdown Style */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  STEP 3: SPECIFIC SELECTION ({selectedModules.map(m => m.toUpperCase()).join(' + ')})
                </h3>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col transition-all duration-300">
                <button 
                  onClick={() => setIsProjectListOpen(!isProjectListOpen)}
                  className="w-full flex items-center justify-between px-8 py-6 hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Icons.Search className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      {selectedEntityIds.length === 0 ? 'Click to select projects...' : `${selectedEntityIds.length} projects selected`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSelectAll(); }}
                      className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                    >
                      {selectedEntityIds.length === currentOptions.length ? 'DESELECT ALL' : 'SELECT ALL'}
                    </button>
                    <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isProjectListOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isProjectListOpen && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative border-b border-slate-50 bg-slate-50/30">
                      <Icons.Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        type="text"
                        placeholder="Search projects in selected modules..."
                        className="w-full pl-16 pr-8 py-5 text-sm font-medium outline-none text-slate-700 bg-transparent placeholder:text-slate-300"
                        value={entitySearchQuery}
                        onChange={(e) => setEntitySearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-50 grid grid-cols-1 md:grid-cols-2">
                      {filteredEntities.length > 0 ? filteredEntities.map((option) => (
                        <label key={option.id} className="flex items-center px-8 py-5 hover:bg-slate-50 cursor-pointer transition-colors group">
                          <div className="relative flex items-center">
                            <input 
                              type="checkbox"
                              className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-200 bg-white checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                              checked={selectedEntityIds.includes(option.id)}
                              onChange={() => toggleEntitySelection(option.id)}
                            />
                            <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.75 top-0.75 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className={`ml-5 text-[14px] font-bold transition-colors ${selectedEntityIds.includes(option.id) ? 'text-indigo-900' : 'text-slate-500 group-hover:text-slate-800'}`}>
                            {option.name}
                          </span>
                        </label>
                      )) : (
                        <div className="col-span-2 p-16 text-center">
                          <p className="text-sm font-bold text-slate-300 italic">No matches found for your search.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Permission Level - Now Below Specific Selection */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">STEP 4: PERMISSION LEVEL</h3>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                <div className="flex bg-[#F1F3F6] p-2 rounded-2xl border border-slate-100 shadow-inner">
                  <button 
                    onClick={() => setAccessLevel('view')} 
                    className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${accessLevel === 'view' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 ring-4 ring-indigo-500/20 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    VIEW ONLY
                  </button>
                  <button 
                    onClick={() => setAccessLevel('edit')} 
                    className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${accessLevel === 'edit' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 ring-4 ring-indigo-500/20 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    FULL EDIT
                  </button>
                  <button 
                    onClick={() => setAccessLevel('admin')} 
                    className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${accessLevel === 'admin' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 ring-4 ring-indigo-500/20 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    ADMIN ACCESS
                  </button>
                </div>
                <div className="p-8 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 mt-1">
                      <Icons.Governance className="w-4 h-4" />
                    </div>
                    <p className="text-[13px] text-slate-500 leading-relaxed font-medium italic">
                      {accessLevel === 'view' && "User can view all documents, timelines and captured innovations for selected items but cannot make any changes."}
                      {accessLevel === 'edit' && "User can modify timelines, upload documents, and capture new innovations for the selected projects/launches."}
                      {accessLevel === 'admin' && "User has full administrative control over the selected entities, including project settings and team management."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center pt-8">
          <button 
            disabled={isSuccess || !selectedUser || selectedEntityIds.length === 0} 
            onClick={handleGrant} 
            className={`w-full py-8 rounded-[2rem] font-black uppercase tracking-[0.25em] text-sm transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${isSuccess ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-400/30'}`}
          >
            {isSuccess ? '✓ PERMISSIONS GRANTED SUCCESSFULLY' : `GRANT ACCESS TO ${selectedModules.map(m => m.toUpperCase()).join(' & ')} (${selectedEntityIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar activeTab={activeTab as any} setActiveTab={(tab) => setActiveTab(tab as any)} onBack={onBack} onLogout={onLogout} moduleName="Administration" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors tracking-tight font-black">
              <span className="text-xl">←</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-5 py-2.5 bg-indigo-50 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] border border-indigo-100 shadow-sm">ADMIN MODE</div>
            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 font-black text-xs shadow-inner">AG</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-12 bg-[#F8F9FB]">
          <div className="max-w-7xl mx-auto">{activeTab === 'dashboard' ? renderDashboard() : renderGrantAccess()}</div>
        </main>
      </div>
    </div>
  );
};

export default AccessGovernanceModule;
