import React from 'react';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  Bell, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { View, UserSession } from '../types';

interface TopbarProps {
  currentView: View;
  session: UserSession;
  onOpenAddLead: () => void;
  onResetData: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentView,
  session,
  onOpenAddLead,
  onResetData,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="h-16 bg-[#0f172a]/90 backdrop-blur-md border-b border-[#1e293b] px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Breadcrumbs & View Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Workspace</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-200">{currentView}</span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${currentView.toLowerCase()}, names, companies...`}
          className="w-full bg-[#1e293b]/70 border border-[#334155] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Right Action Items */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onResetData}
          title="Reset sample data"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-slate-300 text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        <button
          onClick={onOpenAddLead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Lead</span>
        </button>

        <div className="h-4 w-px bg-[#1e293b] mx-1" />

        {/* Notifications & Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1e293b] border border-[#334155] text-indigo-400 flex items-center justify-center text-xs font-bold shadow-inner">
            {session.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
