
import React, { useState, useRef, useEffect } from 'react';
import { 
  Innovation, 
  AIPProject, 
  InnovationCategory, 
  ImpactLevel, 
  TimeHorizon, 
  InnovationStatus 
} from '../types';
import { Icons } from '../constants';

interface InnovationHubProps {
  innovations: Innovation[];
  projects: AIPProject[];
  onAddInnovation: (i: Innovation) => void;
  hideHeader?: boolean;
}

const MultiSelectDropdown: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}> = ({ label, options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="flex-1 min-w-[200px]" ref={dropdownRef}>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-left flex justify-between items-center hover:bg-white transition-all focus:ring-2 focus:ring-red-500/10"
        >
          <span className="text-sm font-medium text-slate-700 truncate">
            {selected.length === 0 ? (placeholder || 'Select...') : selected.join(', ')}
          </span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-30 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-150">
            {options.map(option => (
              <label key={option} className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white checked:bg-red-600 checked:border-red-600 transition-all"
                    checked={selected.includes(option)}
                    onChange={() => toggleOption(option)}
                  />
                  <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 top-0.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`ml-3 text-sm font-medium transition-colors ${selected.includes(option) ? 'text-red-600' : 'text-slate-600 group-hover:text-slate-900'}`}>{option}</span>
              </label>
            ))}
            {selected.length > 0 && (
              <div className="border-t border-slate-50 mt-1 px-4 pt-2">
                <button 
                  onClick={() => onChange([])}
                  className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InnovationHub: React.FC<InnovationHubProps> = ({ innovations, projects, onAddInnovation, hideHeader = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedImpactLevels, setSelectedImpactLevels] = useState<string[]>([]);
  const [selectedTimeHorizons, setSelectedTimeHorizons] = useState<string[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Innovation>>({
    title: '',
    description: '',
    projectId: projects[0]?.id || '',
    category: InnovationCategory.FORMULATION,
    impactLevel: ImpactLevel.COMMERCIAL,
    timeHorizon: TimeHorizon.NEAR,
    status: InnovationStatus.IDEA,
    startDate: '',
    endDate: ''
  });

  const filteredInnovations = innovations.filter(inn => {
    const matchesSearch = inn.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         inn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(inn.category);
    const matchesImpact = selectedImpactLevels.length === 0 || selectedImpactLevels.includes(inn.impactLevel);
    const matchesHorizon = selectedTimeHorizons.length === 0 || selectedTimeHorizons.includes(inn.timeHorizon);
    
    return matchesSearch && matchesCategory && matchesImpact && matchesHorizon;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInn: Innovation = {
      ...formData as Innovation,
      id: `inn-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    onAddInnovation(newInn);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      category: InnovationCategory.FORMULATION,
      impactLevel: ImpactLevel.COMMERCIAL,
      timeHorizon: TimeHorizon.NEAR,
      status: InnovationStatus.IDEA,
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="space-y-8">
      {!hideHeader && (
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Innovation Repository</h2>
            <p className="text-slate-500 mt-1 font-medium">Cross-portfolio view of tactical and strategic innovations.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-7 py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center hover:from-red-700 hover:to-red-600 shadow-xl shadow-red-200 active:scale-95 transition-all"
          >
            <Icons.Plus className="w-4 h-4 mr-2" /> Capture Innovation
          </button>
        </div>
      )}

      {hideHeader && (
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-black text-slate-900 text-lg">Captured Innovations ({filteredInnovations.length})</h4>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center shadow-lg shadow-red-100 active:scale-95"
          >
            <Icons.Plus className="w-4 h-4 mr-2" /> New Innovation
          </button>
        </div>
      )}

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Search Innovations</label>
            <div className="relative group">
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Find specific optimization opportunities..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MultiSelectDropdown 
            label="Category"
            options={Object.values(InnovationCategory)}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="All Categories"
          />
          <MultiSelectDropdown 
            label="Impact Level"
            options={Object.values(ImpactLevel)}
            selected={selectedImpactLevels}
            onChange={setSelectedImpactLevels}
            placeholder="All Impacts"
          />
          <MultiSelectDropdown 
            label="Time Horizon"
            options={Object.values(TimeHorizon)}
            selected={selectedTimeHorizons}
            onChange={setSelectedTimeHorizons}
            placeholder="All Horizons"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredInnovations.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Innovation className="w-8 h-8 text-slate-200" />
            </div>
            <h4 className="text-xl font-black text-slate-300 italic">No innovations match filters.</h4>
            <p className="text-sm font-medium text-slate-300 mt-2">Adjust your search criteria to discover opportunities.</p>
          </div>
        ) : filteredInnovations.map(inn => {
          const project = projects.find(p => p.id === inn.projectId);
          return (
            <div key={inn.id} className="group bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-red-600/20 hover:shadow-2xl transition-all flex items-start gap-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all group-hover:scale-110 ${
                inn.impactLevel === ImpactLevel.PATIENT ? 'bg-blue-50 text-blue-500' :
                inn.impactLevel === ImpactLevel.CLINICAL ? 'bg-emerald-50 text-emerald-500' :
                'bg-slate-50 text-slate-400 group-hover:text-red-500'
              }`}>
                <Icons.Innovation className="w-7 h-7" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-[19px] font-black text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">{inn.title}</h4>
                    {!hideHeader && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">Project: {project?.name || 'Unknown'}</p>}
                    {(inn.startDate || inn.endDate) && (
                      <p className="text-[10px] font-bold text-slate-400 mt-1">
                        Timeline: {inn.startDate || 'TBD'} to {inn.endDate || 'TBD'}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                      inn.status === InnovationStatus.IN_PLAN ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {inn.status}
                    </span>
                    <div className="text-right">
                      <p className="text-[8px] text-slate-300 uppercase font-black tracking-widest">Created</p>
                      <p className="text-[11px] font-black text-slate-500">{new Date(inn.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium max-w-3xl">{inn.description}</p>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50/50">
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">{inn.category}</span>
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">{inn.impactLevel}</span>
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">{inn.timeHorizon}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="bg-[#D30303] p-10 text-white">
                <h3 className="text-2xl font-black tracking-tight">Capture Asset Innovation</h3>
                <p className="opacity-80 font-medium mt-1">Record tactical or strategic optimization opportunities.</p>
             </div>
             
             <form onSubmit={handleSubmit} className="p-10 grid grid-cols-2 gap-7">
                <div className="col-span-2">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">INNOVATION TITLE</label>
                   <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-red-500/10 focus:border-red-600 outline-none transition-all text-slate-700 font-bold text-sm" placeholder="e.g. Next-Gen Auto-injector" />
                </div>

                <div className="col-span-2">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">DETAILED DESCRIPTION</label>
                   <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-red-500/10 focus:border-red-600 outline-none transition-all text-slate-700 font-medium text-sm" placeholder="Describe the mechanism, benefit, and requirements..." />
                </div>

                {!hideHeader && (
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ASSOCIATED PROJECT</label>
                    <select value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm appearance-none cursor-pointer">
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                )}

                <div className={hideHeader ? 'col-span-1' : 'col-span-2 md:col-span-1'}>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">CATEGORY</label>
                   <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm appearance-none cursor-pointer">
                     {Object.values(InnovationCategory).map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">IMPACT LEVEL</label>
                   <select value={formData.impactLevel} onChange={e => setFormData({...formData, impactLevel: e.target.value as any})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm appearance-none cursor-pointer">
                     {Object.values(ImpactLevel).map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">TIME HORIZON</label>
                   <select value={formData.timeHorizon} onChange={e => setFormData({...formData, timeHorizon: e.target.value as any})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm appearance-none cursor-pointer">
                     {Object.values(TimeHorizon).map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">START DATE</label>
                        <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">END DATE</label>
                        <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm" />
                      </div>
                   </div>
                </div>

                <div className="col-span-2 flex justify-end items-center space-x-12 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">CANCEL</button>
                  <button type="submit" className="relative px-12 py-4 bg-[#D30303] text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-[0_4px_15px_rgba(211,3,3,0.3)] hover:bg-red-700 active:scale-95 transition-all">
                    SAVE INNOVATION
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InnovationHub;
