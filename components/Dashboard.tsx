
import React from 'react';
import { AIPProject, Innovation, InnovationCategory, ImpactLevel, ProjectPhase } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

interface DashboardProps {
  projects: AIPProject[];
  innovations: Innovation[];
}

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

const READINESS_DATA = [
  { subject: 'LRFP Coverage', A: 85, fullMark: 100 },
  { subject: 'TPP Maturity', A: 70, fullMark: 100 },
  { subject: 'CDP Alignment', A: 60, fullMark: 100 },
  { subject: 'Access Strategy', A: 90, fullMark: 100 },
  { subject: 'Evidence Plan', A: 75, fullMark: 100 },
];

const Dashboard: React.FC<DashboardProps> = ({ projects, innovations }) => {
  const categoryData = [
    { name: 'Formulation', count: innovations.filter(i => i.category === InnovationCategory.FORMULATION).length },
    { name: 'Indication Expansion', count: innovations.filter(i => i.category === InnovationCategory.INDICATION_EXPANSION).length },
    { name: 'Lifecycle', count: innovations.filter(i => i.category === InnovationCategory.LIFECYCLE).length },
    { name: 'Access', count: innovations.filter(i => i.category === InnovationCategory.ACCESS).length },
    { name: 'Device', count: innovations.filter(i => i.category === InnovationCategory.DEVICE).length },
    { name: 'Digital', count: innovations.filter(i => i.category === InnovationCategory.DIGITAL).length },
  ];

  const impactData = Object.values(ImpactLevel).map(imp => ({
    name: imp,
    count: innovations.filter(i => i.impactLevel === imp).length
  }));

  const phaseDistribution = [
    { label: 'Phase 3', value: projects.filter(p => p.phase === ProjectPhase.PHASE_3).length, color: 'bg-red-600' },
    { label: 'Phase 2', value: projects.filter(p => p.phase === ProjectPhase.PHASE_2).length, color: 'bg-blue-500' },
    { label: 'Phase 1', value: projects.filter(p => p.phase === ProjectPhase.PHASE_1).length, color: 'bg-amber-400' },
    { label: 'Submission', value: projects.filter(p => p.phase === ProjectPhase.SUBMISSION).length, color: 'bg-emerald-500' },
  ];

  const stats = [
    { 
      label: 'ACTIVE PROJECTS', 
      value: projects.length, 
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-red-100 rounded-full blur-md opacity-30"></div>
          <span className="text-3xl">🚀</span>
        </div>
      ), 
      color: 'text-slate-900' 
    },
    { 
      label: 'TOTAL INNOVATIONS', 
      value: innovations.length, 
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-100 rounded-full blur-md opacity-30"></div>
          <span className="text-3xl">💡</span>
        </div>
      ), 
      color: 'text-red-600' 
    },
    { 
      label: 'INDICATION EXPANSIONS', 
      value: innovations.filter(i => i.category === InnovationCategory.INDICATION_EXPANSION).length, 
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-md opacity-30"></div>
          <span className="text-3xl">📈</span>
        </div>
      ), 
      color: 'text-blue-600' 
    },
    { 
      label: 'IN SUBMISSION', 
      value: projects.filter(p => p.phase === ProjectPhase.SUBMISSION).length, 
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-slate-100 rounded-full blur-md opacity-30"></div>
          <span className="text-3xl">📄</span>
        </div>
      ), 
      color: 'text-emerald-600' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className={`text-4xl font-black ${stat.color}`}>{stat.value}</h3>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Innovations by Category */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center">
             <span className="w-1.5 h-4 bg-red-600 rounded-full mr-3"></span>
             INNOVATIONS BY CATEGORY
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 40, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 11, fontWeight: '700'}} 
                  width={140}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#ef4444" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  className="transition-all duration-500 ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Impact Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center">
             <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-3"></span>
             IMPACT DISTRIBUTION
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={impactData} cx="50%" cy="50%" innerRadius={75} outerRadius={95} paddingAngle={5} dataKey="count">
                  {impactData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Phase Distribution */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10">PIPELINE HEALTH OVERVIEW</h3>
          <div className="space-y-8">
            {phaseDistribution.map((status, i) => {
              const total = projects.length || 1;
              const percentage = Math.round((status.value / total) * 100);
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.15em]">
                    <span className="text-slate-500">{status.label}</span>
                    <span className="text-slate-800">{percentage}% ({status.value})</span>
                  </div>
                  <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${status.color} transition-all duration-700`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strategic Readiness Scorecard */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">STRATEGIC READINESS</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={READINESS_DATA}>
                 <PolarGrid stroke="#e2e8f0" />
                 <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 9, fontWeight: '800'}} />
                 <Radar name="Readiness" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
               </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
      
      {/* Recent AIP Projects Table */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">RECENT AIP PROJECTS</h3>
          <button className="text-red-600 text-[10px] font-black uppercase tracking-widest hover:underline">View All Portfolio</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Asset Name</th>
                <th className="px-8 py-5">Therapeutic Area</th>
                <th className="px-8 py-5">Current Phase</th>
                <th className="px-8 py-5">Target Date</th>
                <th className="px-8 py-5">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {projects.slice(0, 5).map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 font-black text-slate-800 tracking-tight group-hover:text-red-600">{p.name}</td>
                  <td className="px-8 py-6 text-xs font-medium text-slate-500">{p.therapeuticArea}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-slate-200">{p.phase}</span>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400 tracking-tight">{new Date(p.targetDate).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
