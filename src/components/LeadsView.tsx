import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Flame, 
  Phone, 
  Mail, 
  Building2, 
  ArrowUpDown, 
  Sparkles, 
  LayoutList, 
  Kanban,
  MoreVertical,
  Trash2,
  PhoneCall,
  MessageSquare,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Lead, LeadStatus, LeadSource } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  onAddLead: () => void;
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onDeleteLead: (leadId: string) => void;
  onTriggerCall: (lead: Lead) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onAddLead,
  onSelectLead,
  onUpdateStatus,
  onDeleteLead,
  onTriggerCall,
  onRefresh,
  loading,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'value' | 'newest'>('newest');

  const filteredLeads = leads
    .filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.company && l.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (l.phone && l.phone.includes(searchQuery));
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchSource = sourceFilter === 'all' || l.source_id === sourceFilter;
      return matchSearch && matchStatus && matchSource;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'value') return Number(b.estimated_value || 0) - Number(a.estimated_value || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const exportCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Source', 'Estimated Value (INR)', 'Status', 'Score', 'Created At'];
    const rows = filteredLeads.map((l) => [
      `"${l.name}"`,
      `"${l.company || ''}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.source_id}"`,
      l.estimated_value,
      l.status,
      l.score,
      `"${l.created_at}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `flowpilot_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const STAGES: { id: LeadStatus; label: string; color: string }[] = [
    { id: 'new', label: 'New', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' },
    { id: 'contacted', label: 'Contacted', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
    { id: 'qualified', label: 'Qualified', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
    { id: 'hot', label: 'Hot Deal', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
    { id: 'won', label: 'Closed Won', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leads & CRM Pipeline</h1>
          <p className="text-xs text-slate-400">
            Real-time lead scoring, qualification metrics, and omnichannel stage management.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-[#1e293b] text-slate-300 transition-colors"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-[#1e293b] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onAddLead}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Filters & View Switcher */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, phone..."
              className="w-full bg-[#131b2e] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#131b2e] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Stages ({leads.length})</option>
            <option value="new">New Inbound</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="hot">Hot Deals</option>
            <option value="won">Closed Won</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-[#131b2e] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="website">Website Form</option>
            <option value="meta_ads">Meta Ads</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="voice_call">Voice Agent</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#131b2e] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="score">Sort: Highest AI Score</option>
            <option value="value">Sort: Deal Value</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-[#131b2e] border border-[#1e293b] p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              viewMode === 'table' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              viewMode === 'kanban' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
        </div>
      </div>

      {/* Leads Content */}
      {viewMode === 'table' ? (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e293b] bg-[#131b2e]/60 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4">Lead Name & Company</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">Deal Value</th>
                  <th className="py-3.5 px-4">AI Score</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/70 text-xs">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-[#131b2e]/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectLead(lead)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                          {lead.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {lead.name}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>{lead.company || 'Individual / SMB'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="text-slate-300 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{lead.phone || 'No phone'}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[160px]">{lead.email || 'No email'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#1e293b] text-slate-300 border border-[#334155] text-[11px] capitalize">
                        {lead.source_id.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      ₹{Number(lead.estimated_value || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                            lead.score >= 80
                              ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                              : lead.score >= 60
                              ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                              : 'bg-slate-700/50 border-slate-600 text-slate-400'
                          }`}
                        >
                          {lead.score}
                        </span>
                        {lead.score >= 80 && <Flame className="w-3.5 h-3.5 text-rose-400" />}
                      </div>
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className="bg-[#131b2e] border border-[#1e293b] text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer capitalize"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="hot">Hot Deal</option>
                        <option value="won">Closed Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onTriggerCall(lead)}
                          title="Call with Voice Agent"
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          title="Delete lead"
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <div className="text-center py-16 space-y-3">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="text-sm font-semibold text-slate-300">No matching leads found</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search query or filters, or add a new lead to populate the CRM.
                </p>
                <button
                  onClick={onAddLead}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Lead</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            const stageTotal = stageLeads.reduce((s, l) => s + Number(l.estimated_value || 0), 0);

            return (
              <div
                key={stage.id}
                className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-3.5 flex flex-col min-h-[550px] shadow-sm space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-[#1e293b] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="text-xs font-mono text-slate-400">({stageLeads.length})</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-400">
                    ₹{(stageTotal / 1000).toFixed(0)}k
                  </div>
                </div>

                {/* Column Cards */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="bg-[#131b2e] hover:bg-[#1a233d] border border-[#1e293b] hover:border-indigo-500/40 rounded-xl p-3 space-y-2 cursor-pointer transition-all group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors">
                          {lead.name}
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            lead.score >= 80
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-indigo-500/20 text-indigo-300'
                          }`}
                        >
                          {lead.score}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 truncate">
                        {lead.company || lead.phone || 'Direct Prospect'}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#1e293b] text-[11px]">
                        <span className="font-bold text-slate-200">
                          ₹{Number(lead.estimated_value || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-400 text-[10px] capitalize">
                          {lead.source_id.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="h-32 border border-dashed border-[#1e293b] rounded-xl flex items-center justify-center text-xs text-slate-400">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
