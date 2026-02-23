import React, { useState } from 'react';
import { 
  AIPProject, 
  Innovation, 
  ImpactLevel, 
  ProjectPhase, 
  InnovationCategory, 
  TimeHorizon, 
  InnovationStatus 
} from '../types';
import { Icons } from '../constants';
import InnovationHub from './InnovationHub';

interface ProjectDetailViewProps {
  project: AIPProject;
  innovations: Innovation[];
  onAddInnovation: (i: Innovation) => void;
  onBack: () => void;
}

type SubTab = 'Overview' | 'Documents' | 'Innovations' | 'Planning' | 'Access';

interface ProjectDoc {
  id: string;
  name: string;
  url: string;
  tags: string[];
  date: string;
  user: string;
}

const Toggle = ({ enabled, setEnabled }: { enabled: boolean; setEnabled: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => setEnabled(!enabled)}
    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      enabled ? 'bg-slate-700' : 'bg-slate-300'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const IntakeField = ({ label, children, required = true, description }: { label: string; children?: React.ReactNode; required?: boolean; description?: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-6 py-5 border-b border-slate-50 items-start last:border-0">
    <div className="space-y-1.5 pt-1">
      <label className="text-slate-800 text-[13px] font-bold flex items-start leading-tight">
        {required && <span className="text-red-500 mr-1.5 mt-0.5">*</span>}
        {label}
      </label>
      {description && <p className="text-[10px] text-slate-400 font-medium leading-relaxed pr-4">{description}</p>}
    </div>
    <div className="flex items-center w-full">
      {children}
    </div>
  </div>
);

const PlanningStepLabel = ({ label }: { label: string }) => (
  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
    {label}
  </label>
);

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, innovations, onAddInnovation, onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Overview');
  const [planningStep, setPlanningStep] = useState(1);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [activeCriteriaSection, setActiveCriteriaSection] = useState('Innovation Opportunities');

  const criteriaSections = [
    'Innovation Opportunities',
    'Market Understanding',
    'Product Characteristics',
    'Protection',
    'Financial'
  ];

  // Intake Form State (Step 1)
  const [intakeData, setIntakeData] = useState({
    assetInnovation: '',
    disclosurePlanComplete: false,
    addressDisclosurePlan: '',
    pediatricPlanAgreed: false,
    addressPediatricPlan: '',
    pediatricExclusivityTrials: false,
    addressPediatricExclusivity: '',
    outsideTAApplicability: false,
    addressOutsideTA: '',
    gflsNamingStrategyStarted: false,
  });

  // Innovation Form State (Step 2)
  const [innovationData, setInnovationData] = useState({
    title: '',
    description: '',
    category: InnovationCategory.FORMULATION,
    impactLevel: ImpactLevel.COMMERCIAL,
    timeHorizon: TimeHorizon.NEAR,
    startDate: '',
    endDate: ''
  });

  // Criteria by Event Form State (Step 3)
  const [criteriaData, setCriteriaData] = useState({
    innovationOpp: '',
    unmetNeeds: '',
    targetOppSize: '',
    upa: '',
    doseRegimen: '',
    presentationFormulation: '',
    ipDetails: '',
    patentCount: '',
    estRevenue: '',
    pricingDynamic: '',
    costDev: '',
    commercialCOGS: 'Medium'
  });

  const [documents, setDocuments] = useState<ProjectDoc[]>([
    { id: 'doc-1', name: '2024 Strategic LRFP Final', url: 'https://jnj.sharepoint.com/sites/AIP/Docs/LRFP_2024.pdf', tags: ['LRFP'], date: '2024-03-10', user: 'Jane Doe' },
    { id: 'doc-2', name: 'Target Product Profile v2.1', url: 'https://jnj.sharepoint.com/sites/AIP/Docs/TPP_Rev.docx', tags: ['TPP'], date: '2024-04-15', user: 'John Smith' },
  ]);

  const [newDoc, setNewDoc] = useState({ name: '', url: '', tags: [] as string[] });

  const subTabs: SubTab[] = ['Overview', 'Documents', 'Innovations', 'Planning', 'Access'];

  const toggleTag = (tag: string) => {
    setNewDoc(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const doc: ProjectDoc = {
      id: `doc-${Date.now()}`,
      name: newDoc.name,
      url: newDoc.url,
      tags: newDoc.tags,
      date: new Date().toISOString().split('T')[0],
      user: 'Current User'
    };
    setDocuments([doc, ...documents]);
    setIsDocModalOpen(false);
    setNewDoc({ name: '', url: '', tags: [] });
  };

  const handleSaveInnovationFromPlanning = () => {
    if (!innovationData.title) {
        alert("Please provide an innovation title.");
        return;
    }
    const newInn: Innovation = {
      id: `inn-${Math.random().toString(36).substr(2, 5)}`,
      projectId: project.id,
      title: innovationData.title,
      description: innovationData.description,
      category: innovationData.category,
      impactLevel: innovationData.impactLevel,
      timeHorizon: innovationData.timeHorizon,
      startDate: innovationData.startDate,
      endDate: innovationData.endDate,
      status: InnovationStatus.IDEA,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    onAddInnovation(newInn);
    setPlanningStep(3);
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Documents</p>
            <h4 className="text-3xl font-black text-slate-900">{documents.length}</h4>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Synced from SharePoint</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 ml-4">
             <Icons.Project className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Innovations</p>
            <h4 className="text-3xl font-black text-slate-900">{innovations.length}</h4>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              {innovations.filter(i => i.impactLevel === ImpactLevel.PATIENT || i.impactLevel === ImpactLevel.CLINICAL).length} High Impact
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0 ml-4">
             <Icons.Innovation className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Strategic Alignment</p>
            <h4 className="text-3xl font-black text-slate-900 mb-4">88%</h4>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full w-[88%]"></div>
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 ml-4">
             <span className="text-xl">🎯</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h4 className="font-bold text-slate-800">Linked SharePoint Folder</h4>
          <button className="text-xs font-bold text-red-600 hover:underline">Sync Now</button>
        </div>
        <div className="p-20 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              <Icons.Project className="w-10 h-10 text-slate-300" />
           </div>
           <h5 className="font-bold text-slate-800 mb-1">Source of Truth</h5>
           <p className="text-sm text-slate-500 max-w-sm mb-6">
             All files are stored securely in the linked SharePoint site. Changes made here are reflected immediately.
           </p>
           <a 
            href={project.sharepointUrl} 
            target="_blank" 
            rel="noreferrer"
            className="px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center"
           >
             <span className="mr-2">↗</span> Open Folder in SharePoint
           </a>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Strategic Document Inventory ({documents.length})</h3>
        <button 
          onClick={() => setIsDocModalOpen(true)}
          className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-red-700 transition-all shadow-xl shadow-red-500/30 active:scale-95"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Link Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white px-8 py-6 rounded-[1.25rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Icons.Project className="w-6 h-6 text-slate-300" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-[16px] font-black text-slate-800 tracking-tight leading-tight">{doc.name}</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    {doc.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest rounded border border-red-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-300 font-bold tracking-tight">{doc.date} • {doc.user}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href={doc.url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center space-x-2 text-slate-400 hover:text-red-600 text-[11px] font-bold transition-colors"
              >
                <span>SharePoint</span>
                <span className="text-sm">↗</span>
              </a>
              <button className="p-2 text-slate-200 hover:text-slate-400 transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isDocModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-red-600 p-8 text-white">
              <h3 className="text-xl font-black tracking-tight">Link SharePoint Document</h3>
              <p className="text-sm opacity-80 mt-1">Link an existing SharePoint file to a strategic AIP tag.</p>
            </div>
            
            <form onSubmit={handleAddDocument} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Document Title</label>
                <input 
                  required 
                  value={newDoc.name} 
                  onChange={e => setNewDoc({...newDoc, name: e.target.value})} 
                  className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-red-500/10 focus:border-red-600 outline-none transition-all text-slate-700 font-bold text-sm" 
                  placeholder="e.g. 2025 Market Access Strategy" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">SharePoint File Link</label>
                <input 
                  required 
                  type="url"
                  value={newDoc.url} 
                  onChange={e => setNewDoc({...newDoc, url: e.target.value})} 
                  className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-red-500/10 focus:border-red-600 outline-none transition-all text-slate-700 font-medium text-sm" 
                  placeholder="https://jnj.sharepoint.com/..." 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Apply Strategic Tags</label>
                <div className="flex space-x-3">
                  {['LRFP', 'TPP', 'CDP'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        newDoc.tags.includes(tag) 
                        ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200' 
                        : 'bg-white text-slate-400 border-slate-200 hover:border-red-600/30'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-6 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsDocModalOpen(false)} 
                  className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-4 bg-red-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 active:scale-95 transition-all"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderPlanning = () => {
    const steps = [
      { id: 1, label: 'Intake Form', icon: '📝' },
      { id: 2, label: 'Innovation Creation', icon: '💡' },
      { id: 3, label: 'Criteria by Event', icon: '⚡' },
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Asset Planning Workflow</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Complete the three primary steps to finalize asset strategy.</p>
          </div>
          <div className="flex space-x-2">
            <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              STEP {planningStep} OF 3
            </span>
          </div>
        </div>

        {/* Stepper UI */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative">
           {/* Line connecting steps */}
           <div className="absolute top-[52px] left-[15%] right-[15%] h-1 bg-slate-100 rounded-full z-0"></div>
           <div 
             className="absolute top-[52px] left-[15%] h-1 bg-red-600 rounded-full z-0 transition-all duration-500" 
             style={{ width: `${planningStep === 1 ? '0%' : planningStep === 2 ? '35%' : '70%'}` }}
           ></div>

          <div className="flex items-center justify-between max-w-2xl mx-auto relative z-10">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setPlanningStep(step.id)}
                className="flex flex-col items-center"
              >
                <div className={`w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all duration-300 ${
                  planningStep === step.id ? 'bg-red-600 text-white scale-110' : 
                  planningStep > step.id ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  <span className="text-lg font-bold">{step.id}</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest mt-4 transition-colors ${
                  planningStep === step.id ? 'text-red-600' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[500px] overflow-hidden">
          {planningStep === 1 && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Form Header */}
              <div className="bg-[#D30303] p-6 text-white flex items-center space-x-4">
                <div className="bg-white text-[#D30303] p-2 rounded-lg font-black text-xs shadow-lg">J&J</div>
                <h4 className="text-lg font-bold tracking-tight">Asset Innovation Planning Intake ...</h4>
              </div>

              {/* Form Fields */}
              <div className="p-10 space-y-2">
                <IntakeField label="Asset Innovation">
                  <input 
                    type="text"
                    value={intakeData.assetInnovation}
                    onChange={e => setIntakeData({...intakeData, assetInnovation: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-red-500 transition-colors"
                  />
                </IntakeField>

                <IntakeField label="Asset Strategic Disclosure Plan Complete?">
                  <Toggle enabled={intakeData.disclosurePlanComplete} setEnabled={v => setIntakeData({...intakeData, disclosurePlanComplete: v})} />
                </IntakeField>

                <IntakeField label="Plan to address: Asset Strategic Disclosure Plan Complete?">
                  <input 
                    type="text"
                    value={intakeData.addressDisclosurePlan}
                    onChange={e => setIntakeData({...intakeData, addressDisclosurePlan: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-red-500 transition-colors"
                  />
                </IntakeField>

                <IntakeField label="Asset Pediatric Plan agreed with FDA/EMEA?">
                  <Toggle enabled={intakeData.pediatricPlanAgreed} setEnabled={v => setIntakeData({...intakeData, pediatricPlanAgreed: v})} />
                </IntakeField>

                <IntakeField label="Plan to address: Asset Pediatric Plan agreed with FDA/EMEA?">
                  <input 
                    type="text"
                    value={intakeData.addressPediatricPlan}
                    onChange={e => setIntakeData({...intakeData, addressPediatricPlan: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-red-500 transition-colors"
                  />
                </IntakeField>

                <IntakeField label="Asset Pediatric Exclusivity Trials Underway?">
                  <Toggle enabled={intakeData.pediatricExclusivityTrials} setEnabled={v => setIntakeData({...intakeData, pediatricExclusivityTrials: v})} />
                </IntakeField>

                <IntakeField label="Plan to address: Asset Pediatric Exclusivity Trials Underway?">
                  <input 
                    type="text"
                    value={intakeData.addressPediatricExclusivity}
                    onChange={e => setIntakeData({...intakeData, addressPediatricExclusivity: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-red-500 transition-colors"
                  />
                </IntakeField>

                <IntakeField label="Outside TA applicability considered?">
                  <Toggle enabled={intakeData.outsideTAApplicability} setEnabled={v => setIntakeData({...intakeData, outsideTAApplicability: v})} />
                </IntakeField>

                <IntakeField label="Plan to address: Outside TA applicability considered?">
                  <input 
                    type="text"
                    value={intakeData.addressOutsideTA}
                    onChange={e => setIntakeData({...intakeData, addressOutsideTA: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-red-500 transition-colors"
                  />
                </IntakeField>

                <IntakeField label="GFLS & Naming Strategy Started?">
                  <Toggle enabled={intakeData.gflsNamingStrategyStarted} setEnabled={v => setIntakeData({...intakeData, gflsNamingStrategyStarted: v})} />
                </IntakeField>
              </div>
            </div>
          )}

          {planningStep === 2 && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
               <div className="p-8 border-b border-slate-100 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm">💡</div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">2. Innovation Creation</h4>
                    <p className="text-sm text-slate-500 font-medium">Ideate and document specific optimization opportunities.</p>
                  </div>
               </div>
              
              <div className="p-10 space-y-8">
                <div>
                   <PlanningStepLabel label="Innovation Title" />
                   <input 
                    required 
                    value={innovationData.title} 
                    onChange={e => setInnovationData({...innovationData, title: e.target.value})} 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-red-500/10 focus:border-red-600 outline-none transition-all text-slate-700 font-bold text-sm" 
                    placeholder="e.g. Next-Gen Auto-injector" 
                  />
                </div>

                <div>
                   <PlanningStepLabel label="Detailed Description" />
                   <textarea 
                    rows={3} 
                    value={innovationData.description} 
                    onChange={e => setInnovationData({...innovationData, description: e.target.value})} 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-red-500/10 focus:border-red-600 outline-none transition-all text-slate-700 font-medium text-sm" 
                    placeholder="Describe the mechanism, benefit, and requirements..." 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <PlanningStepLabel label="Category (Innovation Type)" />
                      <div className="relative">
                        <select 
                          value={innovationData.category} 
                          onChange={e => setInnovationData({...innovationData, category: e.target.value as InnovationCategory})} 
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm appearance-none cursor-pointer focus:border-red-600 transition-all"
                        >
                          {Object.values(InnovationCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </div>
                      </div>
                   </div>

                   <div>
                      <PlanningStepLabel label="Impact Level" />
                      <div className="relative">
                        <select 
                          value={innovationData.impactLevel} 
                          onChange={e => setInnovationData({...innovationData, impactLevel: e.target.value as ImpactLevel})} 
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm appearance-none cursor-pointer focus:border-red-600 transition-all"
                        >
                          {Object.values(ImpactLevel).map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div>
                      <PlanningStepLabel label="Time Horizon" />
                      <div className="relative">
                        <select 
                          value={innovationData.timeHorizon} 
                          onChange={e => setInnovationData({...innovationData, timeHorizon: e.target.value as TimeHorizon})} 
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm appearance-none cursor-pointer focus:border-red-600 transition-all"
                        >
                          {Object.values(TimeHorizon).map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        </div>
                      </div>
                   </div>

                   <div>
                      <PlanningStepLabel label="Start Date" />
                      <input 
                        type="date" 
                        value={innovationData.startDate} 
                        onChange={e => setInnovationData({...innovationData, startDate: e.target.value})} 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm focus:border-red-600 transition-all" 
                      />
                   </div>

                   <div>
                      <PlanningStepLabel label="End Date" />
                      <input 
                        type="date" 
                        value={innovationData.endDate} 
                        onChange={e => setInnovationData({...innovationData, endDate: e.target.value})} 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-bold text-sm focus:border-red-600 transition-all" 
                      />
                   </div>
                </div>
              </div>
            </div>
          )}

          {planningStep === 3 && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col h-full">
              <div className="p-8 border-b border-slate-100 flex items-center space-x-4 shrink-0">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm">⚡</div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">3. Criteria by Event</h4>
                    <p className="text-sm text-slate-500 font-medium">Establish success criteria and triggers for key strategic milestones.</p>
                  </div>
               </div>

               <div className="flex flex-1 min-h-[500px]">
                 {/* Left Sidebar for Categories */}
                 <div className="w-64 bg-[#1E3A8A] border-r border-slate-200 shrink-0 py-6">
                    <div className="space-y-1">
                      {criteriaSections.map(section => (
                        <button
                          key={section}
                          onClick={() => setActiveCriteriaSection(section)}
                          className={`w-full text-left px-8 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                            activeCriteriaSection === section 
                            ? 'text-white bg-white/10' 
                            : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                          }`}
                        >
                          {activeCriteriaSection === section && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600"></div>
                          )}
                          {section}
                        </button>
                      ))}
                    </div>
                 </div>

                 {/* Right Panel for Form Content */}
                 <div className="flex-1 p-10 bg-white">
                    <div className="max-w-3xl space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">SELECTED CRITERIA</h5>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{activeCriteriaSection}</h4>
                      </div>

                      {activeCriteriaSection === 'Innovation Opportunities' && (
                        <IntakeField label="Innovation Opportunity Type, Description & Timing">
                          <textarea 
                            rows={4} 
                            value={criteriaData.innovationOpp}
                            onChange={e => setCriteriaData({...criteriaData, innovationOpp: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            placeholder="Detail the strategic alignment and expected execution timeline..."
                          />
                        </IntakeField>
                      )}

                      {activeCriteriaSection === 'Market Understanding' && (
                        <div className="space-y-4">
                          <IntakeField label="Unmet Needs Addressed (SOC at time of event)">
                             <textarea 
                              rows={2} 
                              value={criteriaData.unmetNeeds}
                              onChange={e => setCriteriaData({...criteriaData, unmetNeeds: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            />
                          </IntakeField>
                          <IntakeField label="Target Opportunity Size (Peak)">
                             <input 
                              type="text"
                              value={criteriaData.targetOppSize}
                              onChange={e => setCriteriaData({...criteriaData, targetOppSize: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            />
                          </IntakeField>
                          <IntakeField label="UPA: Unique Promotable Advantage" description="innovation vs. competitive landscape. Inc Number of relevant competitors. First mover?">
                             <textarea 
                              rows={3} 
                              value={criteriaData.upa}
                              onChange={e => setCriteriaData({...criteriaData, upa: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            />
                          </IntakeField>
                        </div>
                      )}

                      {activeCriteriaSection === 'Product Characteristics' && (
                        <div className="space-y-4">
                          <IntakeField label="Dose / Regimen">
                             <input 
                              type="text"
                              value={criteriaData.doseRegimen}
                              onChange={e => setCriteriaData({...criteriaData, doseRegimen: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            />
                          </IntakeField>
                          <IntakeField label="Presentation / Formulation">
                             <input 
                              type="text"
                              value={criteriaData.presentationFormulation}
                              onChange={e => setCriteriaData({...criteriaData, presentationFormulation: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            />
                          </IntakeField>
                        </div>
                      )}

                      {activeCriteriaSection === 'Protection' && (
                        <div className="space-y-4">
                          <IntakeField label="Intellectual Property Details" description="Label Inclusion. COM: 2041 Reg; +12 yrs post launch">
                             <textarea 
                              rows={2} 
                              value={criteriaData.ipDetails}
                              onChange={e => setCriteriaData({...criteriaData, ipDetails: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            />
                          </IntakeField>
                          <IntakeField label="# of Patents by Family Type">
                             <input 
                              type="text"
                              value={criteriaData.patentCount}
                              onChange={e => setCriteriaData({...criteriaData, patentCount: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            />
                          </IntakeField>
                        </div>
                      )}

                      {activeCriteriaSection === 'Financial' && (
                        <div className="space-y-4">
                          <IntakeField label="Estimated Revenue (LRFP 2023)">
                             <input 
                              type="text"
                              value={criteriaData.estRevenue}
                              onChange={e => setCriteriaData({...criteriaData, estRevenue: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            />
                          </IntakeField>
                          <IntakeField label="Pricing Dynamic at Launch">
                             <input 
                              type="text"
                              value={criteriaData.pricingDynamic}
                              onChange={e => setCriteriaData({...criteriaData, pricingDynamic: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            />
                          </IntakeField>
                          <IntakeField label="Cost: Next Decision | Total Dev">
                             <input 
                              type="text"
                              value={criteriaData.costDev}
                              onChange={e => setCriteriaData({...criteriaData, costDev: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-medium"
                            />
                          </IntakeField>
                          <IntakeField label="Commercial COGS (H/M/L)">
                             <select 
                              value={criteriaData.commercialCOGS}
                              onChange={e => setCriteriaData({...criteriaData, commercialCOGS: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all font-bold cursor-pointer appearance-none"
                            >
                              <option>High</option>
                              <option>Medium</option>
                              <option>Low</option>
                            </select>
                          </IntakeField>
                        </div>
                      )}
                    </div>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-4">
          <button 
            disabled={planningStep === 1}
            onClick={() => setPlanningStep(prev => prev - 1)}
            className="px-8 py-3 bg-slate-100 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-all"
          >
            Previous Step
          </button>
          <button 
            onClick={() => {
              if (planningStep === 1) setPlanningStep(2);
              else if (planningStep === 2) handleSaveInnovationFromPlanning();
              else {
                alert('Planning criteria saved and strategy finalized!');
                onBack();
              }
            }}
            className="px-10 py-3 bg-red-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-100 transition-all active:scale-95"
          >
            {planningStep === 1 ? 'Save & Continue' : planningStep === 2 ? 'Save Innovation' : 'Finalize Planning'}
          </button>
        </div>
      </div>
    );
  };

  const renderAccess = () => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-in fade-in duration-300 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Team Access & Roles</h3>
          <p className="text-sm text-slate-500 mt-1">Manage who can view and edit this project workspace.</p>
        </div>
        <button className="flex items-center space-x-2 bg-[#D30303] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 transition-all shadow-md shadow-red-100">
          <Icons.Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="p-8">
        <div className="bg-[#fff9e6] border border-[#fce4a4] rounded-xl p-6 flex items-start space-x-4 mb-10">
          <div className="text-[#a67c00] mt-1">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <div>
            <h5 className="font-bold text-[#a67c00] text-sm">SharePoint Permissions Remain Unchanged</h5>
            <p className="text-xs text-[#a67c00] mt-1">Adding users here only grants access to this framework UI. Document access is managed directly in SharePoint.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { name: 'Jane Doe', email: 'jane.doe@pharma.com', initials: 'JD', role: 'Admin' },
            { name: 'John Smith', email: 'john.smith@pharma.com', initials: 'JS', role: 'Contributor' },
            { name: 'Sarah Connor', email: 'sarah.connor@pharma.com', initials: 'SC', role: 'Viewer' }
          ].map((member, idx) => (
            <div key={idx} className="py-6 flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-xs font-bold border border-slate-200">
                  {member.initials}
                </div>
                <div>
                  <h6 className="text-sm font-bold text-slate-900">{member.name}</h6>
                  <p className="text-xs text-slate-400">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <select 
                  defaultValue={member.role}
                  className="bg-transparent text-sm text-slate-500 font-medium outline-none cursor-pointer focus:text-red-600 transition-colors"
                >
                  <option>Admin</option>
                  <option>Contributor</option>
                  <option>Viewer</option>
                </select>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{project.name}</h2>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-widest">Active</span>
        </div>
        <div className="flex items-center space-x-4 text-sm font-medium text-slate-500">
          <span>{project.therapeuticArea}</span>
          <span className="text-slate-300">•</span>
          <span>Phase {project.phase.split(' ').pop()}</span>
          <span className="text-slate-300">•</span>
          <a href={project.sharepointUrl} target="_blank" rel="noreferrer" className="text-red-600 flex items-center hover:underline">
            <span className="mr-1.5">🔗</span> SharePoint Linked
          </a>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <div className="flex space-x-8">
          {subTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeSubTab === tab ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeSubTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        {activeSubTab === 'Overview' && renderOverview()}
        {activeSubTab === 'Documents' && renderDocuments()}
        {activeSubTab === 'Innovations' && (
          <InnovationHub 
            innovations={innovations} 
            projects={[project]} 
            onAddInnovation={onAddInnovation} 
            hideHeader={true}
          />
        )}
        {activeSubTab === 'Planning' && renderPlanning()}
        {activeSubTab === 'Access' && renderAccess()}
      </div>
    </div>
  );
};

export default ProjectDetailView;