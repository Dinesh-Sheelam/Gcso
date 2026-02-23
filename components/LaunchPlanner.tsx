
import React, { useState, useEffect } from 'react';
import { AIPProject, LaunchPlan, ProjectPhase, Milestone } from '../types';
import { generateLaunchPlanMilestones } from '../geminiService';
import { Icons } from '../constants';

interface LaunchPlannerProps {
  projects: AIPProject[];
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onAddLaunch?: (p: AIPProject) => void;
}

const THERAPEUTIC_AREAS = [
  'Oncology', 'Immunology', 'Neuroscience', 'Cardiovascular & Metabolism', 'Pulmonary Hypertension', 'Infectious Diseases & Vaccines', 'Retina/Ophthalmology'
];

const REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM'];

const LaunchPlanner: React.FC<LaunchPlannerProps> = ({ projects, selectedProjectId, onSelectProject, onAddLaunch }) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<LaunchPlan | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const [form, setForm] = useState({ productName: '', therapeuticArea: '', targetLaunchDate: '', region: '' });

  useEffect(() => {
    if (selectedProject) {
      setForm({ 
        productName: selectedProject.name, 
        therapeuticArea: selectedProject.therapeuticArea, 
        targetLaunchDate: selectedProject.targetDate, 
        region: selectedProject.region || 'North America' 
      });
      // Reset plan when switching projects if it doesn't match
      if (plan && plan.projectId !== selectedProjectId) {
         setPlan(null);
      }
    }
  }, [selectedProjectId, selectedProject]);

  const handleNewLaunchClick = () => {
    setForm({ productName: '', therapeuticArea: '', targetLaunchDate: '', region: '' });
    setIsManualModalOpen(true);
  };

  const handleManualFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddLaunch) {
      const newLaunch: AIPProject = {
        id: `launch-${Math.random().toString(36).substr(2, 5)}`,
        name: form.productName,
        asset: form.productName,
        therapeuticArea: form.therapeuticArea,
        phase: ProjectPhase.SUBMISSION,
        targetDate: form.targetLaunchDate,
        region: form.region,
        sharepointUrl: '',
        taggedDocuments: { lrfp: false, tpp: false, cdp: false }
      };
      onAddLaunch(newLaunch);
      onSelectProject(newLaunch.id);
    }
    setIsManualModalOpen(false);
  };

  const handleGeneratePlan = async () => {
    if (!form.productName || !form.targetLaunchDate || !form.therapeuticArea || !form.region) {
      alert("Please ensure all project details are set before generating.");
      return;
    }
    setLoading(true);
    try {
      const milestones = await generateLaunchPlanMilestones(form.therapeuticArea, form.targetLaunchDate, form.region);
      setPlan({
        projectId: selectedProjectId || 'manual',
        region: form.region,
        targetLaunchDate: form.targetLaunchDate,
        milestones: milestones.map((m: any, i: number) => ({ 
            ...m, 
            id: `ms-${i}`,
            status: i < 2 ? 'Completed' : (i < 4 ? 'In Progress' : 'Planned')
        }))
      });
    } catch (error) {
      console.error("Plan generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProjectId) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Launch Portfolio</h2>
            <p className="text-slate-500 mt-1 font-medium text-sm">Choose a commercialized product for execution planning.</p>
          </div>
          <button onClick={handleNewLaunchClick} className="flex items-center space-x-2 text-[#059669] bg-[#ecfdf5] hover:bg-[#d1fae5] px-4 py-2 rounded-xl font-bold text-sm transition-all border border-[#d1fae5] shadow-sm">
            <Icons.Plus className="w-4 h-4" /> <span>New Launch Plan</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map(p => (
            <div key={p.id} onClick={() => onSelectProject(p.id)} className="group bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:border-[#10b981]/20 transition-all flex flex-col min-h-[180px] relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-[#ecfdf5] text-[#059669] text-[10px] font-black rounded uppercase tracking-[0.1em] border border-[#d1fae5]">STATUS</span>
                <div className="text-slate-200 group-hover:text-[#10b981] transition-colors">
                  <Icons.Project className="w-5 h-5" />
                </div>
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-8 group-hover:text-[#059669] transition-colors tracking-tight leading-tight">{p.name}</h3>
              
              <div className="mt-auto grid grid-cols-3 gap-6 pt-5 border-t border-slate-50/80">
                 <div>
                   <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.1em] mb-1.5">REGION</p>
                   <p className="text-[11px] font-bold text-slate-700 leading-none">{p.region || 'N/A'}</p>
                 </div>
                 <div>
                   <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.1em] mb-1.5">TA</p>
                   <p className="text-[11px] font-bold text-slate-700 leading-none truncate">{p.therapeuticArea}</p>
                 </div>
                 <div>
                   <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.1em] mb-1.5">TARGET</p>
                   <p className="text-[11px] font-bold text-slate-700 leading-none">{p.targetDate}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
              <div className="p-6 pb-3 border-b border-slate-50"><h3 className="text-xl font-black text-slate-900 tracking-tight">Initialize Launch Plan</h3></div>
              <form onSubmit={handleManualFormSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Launch Name</label>
                  <input required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none transition-all text-slate-700 text-sm font-medium" placeholder="e.g. Brand-X Launch" value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Therapeutic Area</label>
                    <select required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-700 text-sm font-medium" value={form.therapeuticArea} onChange={e => setForm({...form, therapeuticArea: e.target.value})}>
                      <option value="" disabled>Select TA</option>
                      {THERAPEUTIC_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Region</label>
                    <select required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-700 text-sm font-medium" value={form.region} onChange={e => setForm({...form, region: e.target.value})}>
                      <option value="" disabled>Select Region</option>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Target Launch Date</label>
                  <input type="date" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-700 text-sm font-medium" value={form.targetLaunchDate} onChange={e => setForm({...form, targetLaunchDate: e.target.value})} />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-2">
                  <button type="button" onClick={() => setIsManualModalOpen(false)} className="text-xs font-bold text-slate-500">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all">Initialize Launch</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Launch Back-Scheduling</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Automated launch planning based on TA-specific commercial excellence frameworks.</p>
        </div>
        <div className="flex items-center">
           <button 
             onClick={handleGeneratePlan} 
             disabled={loading} 
             className="flex items-center space-x-2 px-6 py-3.5 bg-[#059669] text-white rounded-xl font-bold text-sm hover:bg-[#047857] shadow-xl shadow-emerald-100 disabled:opacity-50 transition-all"
           >
             {loading ? <span className="animate-pulse">Building...</span> : <><Icons.Launch className="w-5 h-5 mr-1" /><span>Generate Launch Plan</span></>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Launch Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[600px] relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Launch Timeline</h3>
               <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">DRAFT V1.0</span>
            </div>
            
            {plan ? (
               <div className="relative space-y-12">
                 {/* Vertical line connector */}
                 <div className="absolute left-[13px] top-2 bottom-12 w-0.5 bg-slate-100"></div>
                 
                 {plan.milestones.map((ms) => (
                   <div key={ms.id} className="relative pl-12 flex group items-start">
                     {/* Milestone Circle */}
                     <div className={`absolute left-0 top-1.5 w-7 h-7 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
                       ms.status === 'Completed' ? 'bg-[#10b981]' : 
                       ms.status === 'In Progress' ? 'bg-[#3b82f6]' : 
                       ms.status === 'Risk' ? 'bg-[#f59e0b]' : 'bg-[#94a3b8]'
                     }`} />
                     
                     <div className="flex-1">
                       <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                         <div>
                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{ms.date}</span>
                            <h4 className="text-[17px] font-black text-slate-800 tracking-tight mt-0.5 group-hover:text-emerald-600 transition-colors">{ms.title}</h4>
                            <p className="text-slate-400 text-[13px] mt-1 italic leading-relaxed max-w-xl">"{ms.description || 'Action item generated by commercial excellence engine.'}"</p>
                         </div>
                         <div className="flex flex-col items-end gap-3 text-right shrink-0">
                            <div>
                               <p className="text-[7px] text-slate-300 font-black tracking-widest uppercase mb-0.5">OWNER</p>
                               <p className="text-[11px] font-black text-slate-700">{ms.owner}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                              ms.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                              ms.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                              'bg-slate-50 text-slate-400'
                            }`}>
                              {ms.status}
                            </span>
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-40 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <Icons.Launch className="w-8 h-8 text-slate-200" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-400 italic">No plan active.</h4>
                    <p className="text-sm font-medium text-slate-300 max-w-xs mx-auto">Initialize a launch plan to view the commercial execution timeline.</p>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Summary & Risk */}
        <div className="space-y-6">
          {/* Plan Summary Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">PLAN SUMMARY</h4>
             <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                   <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">DURATION</span>
                   <span className="text-xs font-black text-slate-900">~18 Months</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                   <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">MILESTONES</span>
                   <span className="text-xs font-black text-slate-900">{plan ? plan.milestones.length : 0} Key Events</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                   <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">CRITICAL RISKS</span>
                   <span className="text-xs font-black text-red-600">2 Identified</span>
                </div>
                
                <button className="w-full py-5 bg-[#1e293b] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 mt-4 hover:bg-black transition-all active:scale-95">
                   Export to PPTX
                </button>
             </div>
          </div>

          {/* Risk Assessment Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">RISK ASSESSMENT</h4>
             <div className="space-y-6">
                <div className="pl-3 border-l-4 border-amber-500 py-1">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">MEDIUM RISK</p>
                   <p className="text-[11px] font-medium text-slate-600 leading-relaxed">Competitor approval likely 2 months prior to launch in North America.</p>
                </div>
                <div className="pl-3 border-l-4 border-red-500 py-1">
                   <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">HIGH RISK</p>
                   <p className="text-[11px] font-medium text-slate-600 leading-relaxed">Potential supply chain delay in EU manufacturing hub affecting initial stock.</p>
                </div>
             </div>
          </div>

          {/* Scope Card (Simplified) */}
          <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">LAUNCH SCOPE</h4>
             <div className="space-y-2">
                <div className="flex justify-between"><span className="text-[10px] text-slate-400 font-bold">PRODUCT</span><span className="text-[10px] font-bold text-slate-800">{form.productName || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-[10px] text-slate-400 font-bold">TARGET</span><span className="text-[10px] font-bold text-slate-800">{form.targetLaunchDate || 'N/A'}</span></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPlanner;
