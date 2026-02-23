
import React, { useState } from 'react';
import { 
  ProjectPhase, 
  AIPProject, 
  Innovation, 
  InnovationCategory, 
  ImpactLevel, 
  TimeHorizon, 
  InnovationStatus,
  User,
  UserRole
} from './types';
import { Icons } from './constants';
import AssetPlanningModule from './modules/AssetPlanningModule';
import LaunchPlanningModule from './modules/LaunchPlanningModule';
import AccessGovernanceModule from './modules/AccessGovernanceModule';
import Login from './components/Login';
import MyTasks from './components/MyTasks';

const MOCK_AIP_PROJECTS: AIPProject[] = [
  {
    id: 'aip-1',
    name: 'Project 1',
    asset: 'Asset Name',
    therapeuticArea: 'Immunology',
    phase: ProjectPhase.PHASE_3,
    targetDate: '2025-06-30',
    region: 'EMEA',
    sharepointUrl: 'https://jnj.sharepoint.com/projects/2113',
    taggedDocuments: { lrfp: true, tpp: true, cdp: false }
  },
  {
    id: 'aip-2',
    name: 'Project 2',
    asset: 'Asset Name',
    therapeuticArea: 'Dermatology',
    phase: ProjectPhase.PHASE_2,
    targetDate: '2026-12-01',
    region: 'North America',
    sharepointUrl: 'https://jnj.sharepoint.com/projects/tremfya',
    taggedDocuments: { lrfp: true, tpp: true, cdp: true }
  },
  {
    id: 'aip-3',
    name: 'Project 3',
    asset: 'Asset Name',
    therapeuticArea: 'Immunology',
    phase: ProjectPhase.SUBMISSION,
    targetDate: '2024-11-15',
    region: 'North America',
    sharepointUrl: 'https://jnj.sharepoint.com/projects/stelara-psa',
    taggedDocuments: { lrfp: true, tpp: true, cdp: true }
  },
  {
    id: 'aip-4',
    name: 'Project 4',
    asset: 'Asset Name',
    therapeuticArea: 'Immunology',
    phase: ProjectPhase.PHASE_3,
    targetDate: '2025-09-12',
    region: 'Global',
    sharepointUrl: 'https://jnj.sharepoint.com/projects/guselkumab-uc',
    taggedDocuments: { lrfp: true, tpp: false, cdp: false }
  },
  {
    id: 'aip-5',
    name: 'Project 5',
    asset: 'Asset Name',
    therapeuticArea: 'Neuroscience',
    phase: ProjectPhase.PHASE_2,
    targetDate: '2027-02-20',
    region: 'EMEA',
    sharepointUrl: 'https://jnj.sharepoint.com/projects/nipocalimab',
    taggedDocuments: { lrfp: false, tpp: true, cdp: false }
  }
];

const MOCK_LAUNCH_PROJECTS: AIPProject[] = [
  {
    id: 'launch-1',
    name: 'Project 6',
    asset: 'Asset Name',
    therapeuticArea: 'Immunology',
    phase: ProjectPhase.SUBMISSION,
    targetDate: '2024-11-15',
    region: 'North America',
    sharepointUrl: 'https://jnj.sharepoint.com/launch/stelara',
    taggedDocuments: { lrfp: true, tpp: true, cdp: true }
  },
  {
    id: 'launch-2',
    name: 'Project 7',
    asset: 'Asset Name',
    therapeuticArea: 'Dermatology',
    phase: ProjectPhase.SUBMISSION,
    targetDate: '2025-03-20',
    region: 'EMEA',
    sharepointUrl: 'https://jnj.sharepoint.com/launch/tremfya-eu',
    taggedDocuments: { lrfp: true, tpp: true, cdp: true }
  }
];

const MOCK_INNOVATIONS: Innovation[] = [
  // Device - Large count (12)
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `inn-dev-${i}`, projectId: 'aip-1', title: `Device Innovation ${i}`, description: 'Strategic device optimization.', category: InnovationCategory.DEVICE, impactLevel: ImpactLevel.PATIENT, timeHorizon: TimeHorizon.NEAR, status: InnovationStatus.IN_PLAN, createdAt: '2024-01-15', createdBy: 'Admin'
  })),
  // Digital - Small count (2)
  ...Array.from({ length: 2 }).map((_, i) => ({
    id: `inn-dig-${i}`, projectId: 'aip-1', title: `Digital Innovation ${i}`, description: 'Digital health platform.', category: InnovationCategory.DIGITAL, impactLevel: ImpactLevel.PATIENT, timeHorizon: TimeHorizon.MID, status: InnovationStatus.IDEA, createdAt: '2024-02-10', createdBy: 'Lead'
  })),
  // Formulation - Medium count (6)
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `inn-for-${i}`, projectId: 'aip-2', title: `Formulation Innovation ${i}`, description: 'Next-gen formulation.', category: InnovationCategory.FORMULATION, impactLevel: ImpactLevel.CLINICAL, timeHorizon: TimeHorizon.LONG, status: InnovationStatus.UNDER_EVALUATION, createdAt: '2024-03-05', createdBy: 'Planner'
  })),
  // Access - Medium count (5)
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `inn-acc-${i}`, projectId: 'aip-3', title: `Access Innovation ${i}`, description: 'Market access strategy.', category: InnovationCategory.ACCESS, impactLevel: ImpactLevel.COMMERCIAL, timeHorizon: TimeHorizon.NEAR, status: InnovationStatus.IN_PLAN, createdAt: '2024-04-12', createdBy: 'Lead'
  })),
  // Indication Expansion - Small count (1)
  ...Array.from({ length: 1 }).map((_, i) => ({
    id: `inn-ie-${i}`, projectId: 'aip-3', title: `Indication Expansion ${i}`, description: 'Pediatric expansion study.', category: InnovationCategory.INDICATION_EXPANSION, impactLevel: ImpactLevel.CLINICAL, timeHorizon: TimeHorizon.MID, status: InnovationStatus.IN_PLAN, createdAt: '2024-05-01', createdBy: 'Planner'
  })),
  // Lifecycle - Medium-Small count (3)
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: `inn-lc-${i}`, projectId: 'aip-4', title: `Lifecycle Innovation ${i}`, description: 'Supply chain transparency.', category: InnovationCategory.LIFECYCLE, impactLevel: ImpactLevel.OPERATIONAL, timeHorizon: TimeHorizon.LONG, status: InnovationStatus.IDEA, createdAt: '2024-07-20', createdBy: 'Lead'
  }))
];

type ActiveModule = 'home' | 'asset' | 'launch' | 'governance';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  
  // Independent States
  const [aipProjects, setAipProjects] = useState<AIPProject[]>(MOCK_AIP_PROJECTS);
  const [launchProjects, setLaunchProjects] = useState<AIPProject[]>(MOCK_LAUNCH_PROJECTS);
  const [innovations, setInnovations] = useState<Innovation[]>(MOCK_INNOVATIONS);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveModule('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveModule('home');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const isModuleLocked = (module: ActiveModule) => {
    if (currentUser?.role === UserRole.ADMIN) return false;
    if (currentUser?.role === UserRole.PLANNER && module === 'asset') return false;
    if (currentUser?.role === UserRole.LAUNCHER && module === 'launch') return false;
    return true;
  };

  if (activeModule === 'home') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-start p-6 animate-in fade-in duration-700 pt-8 overflow-y-auto relative">
        {/* Header Icons */}
        <div className="absolute top-6 right-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer">
            <Icons.User className="w-5 h-5" />
          </div>
        </div>

        <div className="max-w-4xl w-full text-center mb-6">
          <div className="inline-block bg-[#D30303] text-white font-black px-3 py-1.5 rounded-md mb-4 shadow-lg shadow-red-200">J&J</div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Choose Your Workspace</h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Hello, {currentUser.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full px-4 mb-8">
          {/* Asset Planning Module */}
          <button 
            onClick={() => !isModuleLocked('asset') && setActiveModule('asset')} 
            className={`group relative border rounded-[2rem] p-6 text-left transition-all shadow-sm ${
              isModuleLocked('asset') 
                ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-75' 
                : 'bg-white border-slate-100 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200 hover:border-red-600'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
              isModuleLocked('asset') 
                ? 'bg-slate-200' 
                : 'bg-red-50 group-hover:bg-red-600'
            }`}>
              {isModuleLocked('asset') ? (
                <Icons.Lock className="w-6 h-6 text-slate-400" />
              ) : (
                <Icons.Project className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              )}
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isModuleLocked('asset') ? 'text-slate-400' : 'text-slate-900'}`}>
              Asset Innovation Planning
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 min-h-[40px]">
              Strategize early-stage asset lifecycles and innovation captures.
            </p>
            <div className={`flex items-center font-bold text-sm transition-transform ${
              isModuleLocked('asset') 
                ? 'text-slate-400' 
                : 'text-red-600 group-hover:translate-x-1'
            }`}>
              {isModuleLocked('asset') ? (
                <span className="flex items-center"><Icons.Lock className="w-4 h-4 mr-2" /> Locked</span>
              ) : (
                <>Enter <span className="ml-2">→</span></>
              )}
            </div>
          </button>

          {/* Launch Planning Module */}
          <button 
            onClick={() => !isModuleLocked('launch') && setActiveModule('launch')} 
            className={`group relative border rounded-[2rem] p-6 text-left transition-all shadow-sm ${
              isModuleLocked('launch') 
                ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-75' 
                : 'bg-white border-slate-100 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200 hover:border-emerald-600'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
              isModuleLocked('launch') 
                ? 'bg-slate-200' 
                : 'bg-emerald-50 group-hover:bg-emerald-600'
            }`}>
              {isModuleLocked('launch') ? (
                <Icons.Lock className="w-6 h-6 text-slate-400" />
              ) : (
                <Icons.Launch className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              )}
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isModuleLocked('launch') ? 'text-slate-400' : 'text-slate-900'}`}>
              Launch Planning
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 min-h-[40px]">
              Manage execution timelines and commercial readiness for product market entry.
            </p>
            <div className={`flex items-center font-bold text-sm transition-transform ${
              isModuleLocked('launch') 
                ? 'text-slate-400' 
                : 'text-emerald-600 group-hover:translate-x-1'
            }`}>
              {isModuleLocked('launch') ? (
                <span className="flex items-center"><Icons.Lock className="w-4 h-4 mr-2" /> Locked</span>
              ) : (
                <>Enter <span className="ml-2">→</span></>
              )}
            </div>
          </button>

          {/* Governance Module */}
          <button 
            onClick={() => !isModuleLocked('governance') && setActiveModule('governance')} 
            className={`group relative border rounded-[2rem] p-6 text-left transition-all shadow-sm ${
              isModuleLocked('governance') 
                ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-75' 
                : 'bg-white border-slate-100 hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200 hover:border-indigo-600'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
              isModuleLocked('governance') 
                ? 'bg-slate-200' 
                : 'bg-indigo-50 group-hover:bg-indigo-600'
            }`}>
              {isModuleLocked('governance') ? (
                <Icons.Lock className="w-6 h-6 text-slate-400" />
              ) : (
                <Icons.Governance className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
              )}
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isModuleLocked('governance') ? 'text-slate-400' : 'text-slate-900'}`}>
              Administration
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 min-h-[40px]">
              Control permissions across AIP and Launch Hub independently.
            </p>
            <div className={`flex items-center font-bold text-sm transition-transform ${
              isModuleLocked('governance') 
                ? 'text-slate-400' 
                : 'text-indigo-600 group-hover:translate-x-1'
            }`}>
              {isModuleLocked('governance') ? (
                <span className="flex items-center"><Icons.Lock className="w-4 h-4 mr-2" /> Locked</span>
              ) : (
                <>Enter <span className="ml-2">→</span></>
              )}
            </div>
          </button>
        </div>

        <div className="w-full max-w-6xl px-4 pb-8">
          <MyTasks />
        </div>

        <button 
          onClick={handleLogout} 
          className="mt-4 text-slate-400 hover:text-red-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center group mb-8"
        >
          <Icons.Logout className="w-4 h-4 mr-2.5 text-slate-400 group-hover:text-red-600 transition-colors" />
          <span>SIGN OUT</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex bg-slate-50">
      {activeModule === 'asset' && (
        <AssetPlanningModule 
          projects={aipProjects} 
          setProjects={setAipProjects}
          innovations={innovations}
          setInnovations={setInnovations}
          onBack={() => setActiveModule('home')} 
          onLogout={handleLogout}
        />
      )}
      {activeModule === 'launch' && (
        <LaunchPlanningModule 
          projects={launchProjects}
          setProjects={setLaunchProjects}
          onBack={() => setActiveModule('home')} 
          onLogout={handleLogout}
        />
      )}
      {activeModule === 'governance' && (
        <AccessGovernanceModule 
          aipProjects={aipProjects}
          launchProjects={launchProjects}
          onBack={() => setActiveModule('home')} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
