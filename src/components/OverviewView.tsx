import React from 'react';
import { 
  Users, 
  Flame, 
  PhoneCall, 
  IndianRupee, 
  ArrowUpRight, 
  Sparkles, 
  Workflow, 
  MessageSquare, 
  Blocks, 
  Activity,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Lead, View } from '../types';

interface OverviewViewProps {
  leads: Lead[];
  onNavigate: (view: View) => void;
  onOpenAddLead: () => void;
  onSelectLead: (lead: Lead) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  leads,
  onNavigate,
  onOpenAddLead,
  onSelectLead,
}) => {
  const totalValue = leads.reduce((sum, l) => sum + Number(l.estimated_value || 0), 0);
  const hotLeads = leads.filter((l) => l.score >= 80 || l.status === 'hot');
  const avgScore = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length) : 0;
  const wonLeads = leads.filter((l) => l.status === 'won');

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const stageCounts = {
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    hot: leads.filter((l) => l.status === 'hot').length,
    won: leads.filter((l) => l.status === 'won').length,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#131b2e] via-[#1a233d] to-[#161f36] border border-[#233152] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[11px] font-medium text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMAND CENTER & AUTOMATION STATUS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back to FlowPilot
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your sales operations, AI voice qualification agents, and omnichannel lead pipes are running smoothly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('Automations')}
            className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Workflow className="w-4 h-4 text-indigo-400" />
            <span>Active Workflows (4)</span>
          </button>
          <button
            onClick={onOpenAddLead}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <span>+ Add New Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-md relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Total CRM Leads</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {leads.length}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% from last week</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-md relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Hot Leads (Score ≥ 80)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {hotLeads.length}
          </div>
          <div className="text-[11px] text-rose-300 font-medium">
            High intent & ready for closing
          </div>
        </div>

        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-md relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Total Pipeline Value</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            ₹{(totalValue / 100000).toFixed(1)}L
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            {wonLeads.length} closed won deals
          </div>
        </div>

        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-md relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">AI Qualification Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {avgScore}/100
          </div>
          <div className="text-[11px] text-purple-300 font-medium">
            Avg lead qualification score
          </div>
        </div>
      </div>

      {/* Main Grid: Pipeline Breakdown + Recent Leads */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Pipeline Stage Health */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Pipeline Distribution</h2>
              <p className="text-xs text-slate-400">Current stage progression</p>
            </div>
            <button
              onClick={() => onNavigate('Leads')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View CRM</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { key: 'new', label: 'New Inbound', count: stageCounts.new, color: 'bg-indigo-500' },
              { key: 'contacted', label: 'Contacted / Engaged', count: stageCounts.contacted, color: 'bg-blue-500' },
              { key: 'qualified', label: 'AI Qualified', count: stageCounts.qualified, color: 'bg-purple-500' },
              { key: 'hot', label: 'Hot Opportunity', count: stageCounts.hot, color: 'bg-rose-500' },
              { key: 'won', label: 'Closed Won', count: stageCounts.won, color: 'bg-emerald-500' },
            ].map((stage) => {
              const pct = leads.length > 0 ? Math.round((stage.count / leads.length) * 100) : 0;
              return (
                <div key={stage.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{stage.label}</span>
                    <span className="text-slate-400 font-mono">{stage.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-[#131b2e] border border-[#1e293b] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Voice AI & WhatsApp sync</span>
            </div>
            <span className="text-emerald-400 font-medium">Operational</span>
          </div>
        </div>

        {/* Right: Recent Leads Feed */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Recent Inbound Opportunities</h2>
              <p className="text-xs text-slate-400">Real-time incoming leads across channels</p>
            </div>
            <button
              onClick={() => onNavigate('Leads')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>See All ({leads.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#1e293b]/70">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="py-3 px-2 rounded-xl hover:bg-[#131b2e] cursor-pointer flex items-center justify-between gap-4 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {lead.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {lead.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {lead.company || lead.email || lead.phone || 'Direct Lead'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-200">
                      ₹{Number(lead.estimated_value || 0).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {lead.source_id.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      lead.score >= 80 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      lead.score >= 60 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      'bg-slate-700/50 text-slate-300 border border-slate-600'
                    }`}>
                      {lead.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Launchpad Modules */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Automation Studio Modules
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('Automations')}
            className="bg-[#0f172a] hover:bg-[#131b2e] border border-[#1e293b] hover:border-indigo-500/40 rounded-2xl p-5 text-left transition-all group shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300">Automations Studio</h3>
            <p className="text-xs text-slate-400 mt-1">
              Trigger instant actions, WhatsApp messages & rep assignments.
            </p>
            <div className="mt-3 text-xs text-indigo-400 font-medium flex items-center gap-1">
              <span>Open Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('Voice Agent')}
            className="bg-[#0f172a] hover:bg-[#131b2e] border border-[#1e293b] hover:border-purple-500/40 rounded-2xl p-5 text-left transition-all group shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-purple-300">ElevenLabs Voice</h3>
            <p className="text-xs text-slate-400 mt-1">
              Test and deploy human-like voice callers for rapid qualification.
            </p>
            <div className="mt-3 text-xs text-purple-400 font-medium flex items-center gap-1">
              <span>Launch Voice Bot</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('AI Chat')}
            className="bg-[#0f172a] hover:bg-[#131b2e] border border-[#1e293b] hover:border-pink-500/40 rounded-2xl p-5 text-left transition-all group shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-pink-300">AI Chat Copilot</h3>
            <p className="text-xs text-slate-400 mt-1">
              Embeddable AI sales chat with live website qualification brain.
            </p>
            <div className="mt-3 text-xs text-pink-400 font-medium flex items-center gap-1">
              <span>Open Chat Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('Integrations')}
            className="bg-[#0f172a] hover:bg-[#131b2e] border border-[#1e293b] hover:border-emerald-500/40 rounded-2xl p-5 text-left transition-all group shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Blocks className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300">Omnichannel Hub</h3>
            <p className="text-xs text-slate-400 mt-1">
              Connect Meta Ads, WhatsApp Cloud, Google, and Webhooks.
            </p>
            <div className="mt-3 text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span>Manage Channels</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
