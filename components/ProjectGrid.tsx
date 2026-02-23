import React, { useState } from 'react';
import { AIPProject, ProjectPhase } from '../types';
import { Icons } from '../constants';

interface ProjectGridProps {
  projects: AIPProject[];
  onAddProject: (p: AIPProject) => void;
  onSelectProject: (id: string) => void;
}

const THERAPEUTIC_AREAS = [
  'Oncology',
  'Immunology',
  'Neuroscience',
  'Cardiovascular & Metabolism',
  'Pulmonary Hypertension',
  'Infectious Diseases & Vaccines',
  'Retina/Ophthalmology',
  'Dermatology'
];

const ChevronDown = () => (
  <svg className="w-4 h-4 text-slate-400 pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onAddProject, onSelectProject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<AIPProject>>({
    name: '',
    asset: '',
    therapeuticArea: 'Immunology',
    phase: ProjectPhase.PHASE_1,
    targetDate: new Date().toISOString().split('T')[0],
    sharepointUrl: '',
    taggedDocuments: { lrfp: false, tpp: false, cdp: false }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: AIPProject = {
      ...formData as AIPProject,
      id: Math.random().toString(36).substr(2, 9),
      asset: formData.asset || formData.name || 'Asset Name',
    };
    onAddProject(newProject);
    setIsModalOpen(false);
    setFormData({
      name: '',
      asset: '',
      therapeuticArea: 'Immunology',
      phase: ProjectPhase.PHASE_1,
      targetDate: new Date().toISOString().split('T')[0],
      sharepointUrl: '',
      taggedDocuments: { lrfp: false, tpp: false, cdp: false }
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Project Portfolio</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage and track your commercial asset planning projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-7 py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] hover:from-red-700 hover:to-red-600 shadow-xl shadow-red-200 transition-all active:scale-95"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className="group bg-white rounded-[1.5rem] p-7 shadow-sm border border-slate-100 cursor-pointer hover:shadow-2xl hover:border-red-600/20 transition-all flex flex-col relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded uppercase tracking-[0.1em] border border-red-100">
                PHASE {project.phase.split(' ').pop()}
              </span>
              <div className="text-slate-200 group-hover:text-red-500 transition-colors">
                <Icons.Project className="w-5 h-5" />
              </div>
            </div>
            
            <h3 className="text-[19px] font-black text-slate-800 mb-1 group-hover:text-red-600 transition-colors tracking-tight leading-tight">{project.name}</h3>
            {/* Asset detailed replaced with static "Asset Name" as per request for mock confidentiality */}
            <p className="text-slate-400 text-xs font-medium mb-8">Asset Name</p>
            
            <div className="space-y-4 pt-6 border-t border-slate-50/80">
              <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-[0.15em]">
                <span>Tagged Docs</span>
                <span className="text-slate-400">{Object.values(project.taggedDocuments).filter(Boolean).length}/3</span>
              </div>
              <div className="flex space-x-2">
                {['LRFP', 'TPP', 'CDP'].map((doc, idx) => {
                  const key = doc.toLowerCase() as keyof typeof project.taggedDocuments;
                  return (
                    <div 
                      key={idx} 
                      className={`flex-1 text-[10px] font-black text-center py-2 rounded-lg border transition-all ${
                        project.taggedDocuments[key] 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-50 text-slate-300 border-slate-100'
                      }`}
                    >
                      {doc}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50/80 flex flex-col">
               <span className="text-[9px] text-slate-400 uppercase font-black tracking-[0.15em] mb-1">Therapeutic Area</span>
               <span className="text-xs font-bold text-slate-800 leading-none">{project.therapeuticArea}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-10 pb-4">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create New AIP Project</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Initialize a new asset planning record.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 pt-4 space-y-7">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Project Name</label>
                  <input 
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-red-500/10 focus:border-red-600 outline-none transition-all text-slate-700 font-bold text-sm"
                    placeholder="e.g. J&J-Project"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Therapeutic Area</label>
                    <div className="relative">
                      <select 
                        className="w-full px-5 py-4 pr-12 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 text-slate-700 font-bold text-sm appearance-none cursor-pointer transition-all"
                        value={formData.therapeuticArea}
                        onChange={e => setFormData({...formData, therapeuticArea: e.target.value})}
                      >
                        {THERAPEUTIC_AREAS.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Project Phase</label>
                    <div className="relative">
                      <select 
                        className="w-full px-5 py-4 pr-12 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 text-slate-700 font-bold text-sm appearance-none cursor-pointer transition-all"
                        value={formData.phase}
                        onChange={e => setFormData({...formData, phase: e.target.value as ProjectPhase})}
                      >
                        <option value={ProjectPhase.PHASE_1}>Phase 1</option>
                        <option value={ProjectPhase.PHASE_2}>Phase 2</option>
                        <option value={ProjectPhase.PHASE_3}>Phase 3</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">SharePoint URL</label>
                  <input 
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 text-slate-700 font-bold text-sm"
                    placeholder="https://jnj.sharepoint.com/sites/project"
                    value={formData.sharepointUrl}
                    onChange={e => setFormData({...formData, sharepointUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-8 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-12 py-4 bg-red-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 hover:shadow-red-300 transition-all active:scale-95"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;