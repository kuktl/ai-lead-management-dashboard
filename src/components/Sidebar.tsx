import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Workflow, 
  MessageSquare, 
  PhoneCall, 
  Blocks, 
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  Database,
  Radio
} from 'lucide-react';
import { View, UserSession } from '../types';
import { supabaseConfigured } from '../lib/supabase';

interface SidebarProps {
  currentView: View;
  onSelectView: (view: View) => void;
  session: UserSession;
  onSignOut: () => void;
}

const NAV_ITEMS: { name: View; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { name: 'Overview', icon: LayoutDashboard, desc: 'Command center' },
  { name: 'Leads', icon: Users, desc: 'CRM & pipeline' },
  { name: 'Automations', icon: Workflow, desc: 'Workflows & triggers' },
  { name: 'AI Chat', icon: MessageSquare, desc: 'Omnichannel bot' },
  { name: 'Voice Agent', icon: PhoneCall, desc: 'ElevenLabs calling' },
  { name: 'Integrations', icon: Blocks, desc: 'Channels & APIs' },
  { name: 'Settings', icon: SettingsIcon, desc: 'Workspace settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  session,
  onSignOut,
}) => {
  return (
    <aside className="w-64 bg-[#0d1322] border-r border-[#1e293b] text-[#94a3b8] flex flex-col fixed inset-y-0 left-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1e293b]/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-semibold text-base tracking-tight flex items-center gap-1.5">
              FlowPilot
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-normal">v2.5</span>
            </div>
            <div className="text-[11px] text-[#64748b] tracking-wider uppercase font-medium">AI Automation OS</div>
          </div>
        </div>
      </div>

      {/* Workspace Badge */}
      <div className="px-4 py-3">
        <div className="bg-[#131b2e] border border-[#1e293b] rounded-xl p-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-900 to-slate-800 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
            {session.name.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">{session.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{session.email}</div>
          </div>
          {session.isDemo ? (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              Demo
            </span>
          ) : (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Live
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onSelectView(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white border border-indigo-500/30 font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full" />
              )}
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs leading-none">{item.name}</div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Status & Sign Out */}
      <div className="p-3 border-t border-[#1e293b]/70 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-[#131b2e]/60 border border-[#1e293b] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{supabaseConfigured ? 'Supabase Connected' : 'Local Persistence'}</span>
          </div>
          <Database className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  );
};
