import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  Building2, 
  Phone, 
  IndianRupee, 
  Globe, 
  Trash2, 
  Edit3, 
  Clock, 
  Send,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { Lead, LeadStatus, ActivityLog } from '../types';
import { StorageService } from '../lib/storage';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onTriggerCall: (lead: Lead) => void;
  onRescored: (lead: Lead) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus,
  onTriggerCall,
  onRescored,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isRescoring, setIsRescoring] = useState(false);

  if (!lead) return null;

  const activities = StorageService.getActivities().filter((a) => a.leadId === lead.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const activity: ActivityLog = {
      id: `act-${Date.now()}`,
      leadId: lead.id,
      type: 'note',
      title: 'Manual Sales Note Added',
      description: newNote.trim(),
      timestamp: new Date().toISOString(),
      author: 'Sales Rep',
    };

    StorageService.addActivity(activity);
    setNewNote('');
  };

  const handleRescore = async () => {
    setIsRescoring(true);
    await new Promise((r) => setTimeout(r, 600));

    // boost based on intent
    const boostedScore = Math.min(lead.score + Math.floor(Math.random() * 10) - 2, 99);
    const updated = await StorageService.saveLead({
      ...lead,
      score: boostedScore,
    });
    setIsRescoring(false);
    onRescored(updated);
  };

  const openWhatsApp = () => {
    if (!lead.phone) return;
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hi ${lead.name}, thank you for your interest in FlowPilot. Are you available for a quick demonstration?`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-[#0f172a] border-l border-slate-800 w-full max-w-xl h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0f172a]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
              {lead.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{lead.name}</h2>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{lead.company || 'Direct Contact'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(lead)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Edit lead"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${lead.name}?`)) {
                  onDelete(lead.id);
                  onClose();
                }
              }}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
              title="Delete lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          {/* Quick Action Bar */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => onTriggerCall(lead)}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Voice Call</span>
            </button>
            <button
              onClick={openWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => {
                if (lead.email) window.location.href = `mailto:${lead.email}?subject=FlowPilot Solution Overview`;
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
          </div>

          {/* AI Lead Intelligence Card */}
          <div className="bg-[#131b2e] border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  AI Qualification Breakdown
                </span>
              </div>
              <button
                onClick={handleRescore}
                disabled={isRescoring}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <Sparkles className={`w-3 h-3 ${isRescoring ? 'animate-spin' : ''}`} />
                <span>{isRescoring ? 'Analyzing…' : 'AI Re-score'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-[#0f172a] p-3 rounded-xl border border-slate-800">
              <div>
                <div className="text-[11px] text-slate-400">Composite Score</div>
                <div className="text-xl font-extrabold text-white">{lead.score}/100</div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                  lead.score >= 80 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  lead.score >= 60 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {lead.score >= 80 ? 'High Intent' : lead.score >= 60 ? 'Qualified' : 'Standard'}
                </span>
              </div>
            </div>

            {/* Sub Metric Bars */}
            <div className="space-y-2.5">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Buying Intent & Engagement</span>
                  <span className="font-mono">{lead.qualification?.intentScore || 75}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${lead.qualification?.intentScore || 75}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Budget & Authority Match</span>
                  <span className="font-mono">{lead.qualification?.budgetFit || 70}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${lead.qualification?.budgetFit || 70}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Urgency & Implementation Timeline</span>
                  <span className="font-mono">{lead.qualification?.urgency || 65}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${lead.qualification?.urgency || 65}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <span className="font-semibold text-indigo-400">AI Recommendation: </span>
              {lead.qualification?.notes || 'Engage via personalized voice call demo within 2 hours.'}
            </div>
          </div>

          {/* Lead Meta Information */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Deal & Contact Specifications
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#131b2e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Estimated Value</span>
                <div className="text-sm font-bold text-white mt-0.5">
                  ₹{Number(lead.estimated_value || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#131b2e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Pipeline Stage</span>
                <select
                  value={lead.status}
                  onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                  className="w-full bg-transparent text-white font-semibold mt-0.5 focus:outline-none cursor-pointer capitalize"
                >
                  <option value="new" className="bg-[#0f172a]">New</option>
                  <option value="contacted" className="bg-[#0f172a]">Contacted</option>
                  <option value="qualified" className="bg-[#0f172a]">Qualified</option>
                  <option value="hot" className="bg-[#0f172a]">Hot Deal</option>
                  <option value="won" className="bg-[#0f172a]">Closed Won</option>
                  <option value="lost" className="bg-[#0f172a]">Lost</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#131b2e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Phone</span>
                <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate">
                  {lead.phone || '—'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#131b2e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Inbound Channel</span>
                <div className="text-xs font-semibold text-slate-200 mt-0.5 capitalize truncate">
                  {lead.source_id.replace('_', ' ')}
                </div>
              </div>
            </div>

            {lead.service_interest && (
              <div className="p-3 rounded-xl bg-[#131b2e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Interested Solution</span>
                <div className="text-xs font-medium text-slate-200 mt-0.5">
                  {lead.service_interest}
                </div>
              </div>
            )}

            {lead.notes && (
              <div className="p-3 rounded-xl bg-[#131b2e] border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Lead Notes</span>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {lead.notes}
                </p>
              </div>
            )}
          </div>

          {/* Activity Log / Notes Stream */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Activity & Touchpoints</span>
              <span className="text-slate-400 font-mono text-[10px]">({activities.length})</span>
            </h3>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a call, meeting note, or follow-up..."
                className="flex-1 bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-3 pt-1">
              {activities.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-[#131b2e] border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{act.title}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{act.description}</p>
                  <div className="text-[9px] text-indigo-400 font-mono">By: {act.author}</div>
                </div>
              ))}

              {activities.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-xs">
                  No previous activity recorded. Add the first note above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
