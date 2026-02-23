
import React from 'react';
import { Icons } from '../constants';

interface SidebarProps {
  activeTab: 'dashboard' | 'projects' | 'audit' | 'grant';
  setActiveTab: (tab: 'dashboard' | 'projects' | 'audit' | 'grant') => void;
  onBack: () => void;
  onLogout: () => void;
  moduleName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onBack, onLogout, moduleName }) => {
  const lowerModuleName = moduleName.toLowerCase();
  const isLaunchModule = lowerModuleName.includes('launch');
  const isAipModule = lowerModuleName.includes('asset');
  const isGovModule = lowerModuleName.includes('governance') || lowerModuleName.includes('administration');
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
  ];

  if (isLaunchModule || isAipModule) {
    // Standardize naming to 'Projects' as per UI request
    menuItems.push({ id: 'projects', label: 'Projects', icon: Icons.Project });
    menuItems.push({ id: 'audit', label: 'Audit Trail', icon: Icons.Governance });
  }

  if (isGovModule) {
    menuItems.push({ id: 'grant', label: 'Access Management', icon: Icons.Governance });
  }

  const activeColor = isLaunchModule ? 'text-emerald-500' : isAipModule ? 'text-red-500' : 'text-indigo-400';
  const buttonActiveBg = 'bg-[#1f2937] text-white shadow-sm';

  return (
    <aside className="w-64 bg-[#111827] text-slate-400 flex flex-col shrink-0 border-r border-slate-800">
      <div className="p-8">
        <div className="bg-red-600 w-10 h-10 flex items-center justify-center text-white font-black rounded mb-4 shadow-sm shadow-red-900/40">J&J</div>
        <h2 className="text-white font-bold text-lg tracking-tight mb-1">{moduleName}</h2>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all group ${
              activeTab === item.id 
              ? buttonActiveBg 
              : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? activeColor : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}

        <div className="pt-8 pb-4">
           <div className="h-px bg-slate-800 mx-4 mb-6 opacity-50"></div>
           <button 
             onClick={onBack}
             className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/50 transition-all"
           >
             <span className="text-lg">↩</span>
             <span className="font-semibold text-sm">Switch Module</span>
           </button>
        </div>
      </nav>

      <div className="p-8 border-t border-slate-800/50">
        <button 
          onClick={onLogout}
          className="text-slate-500 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center group"
        >
          <Icons.Logout className="w-4 h-4 mr-3 text-slate-500 group-hover:text-red-500 transition-colors" />
          <span>SIGN OUT</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
