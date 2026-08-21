import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  IndianRupee, 
  Globe, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Lead, LeadSource, LeadStatus } from '../types';
import { calculateLeadScore } from '../lib/storage';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'created_at' | 'score'> & { id?: string; score?: number }) => void;
  initialData?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [source, setSource] = useState<LeadSource>(initialData?.source_id || 'website');
  const [status, setStatus] = useState<LeadStatus>(initialData?.status || 'new');
  const [value, setValue] = useState<string>(initialData ? String(initialData.estimated_value) : '150000');
  const [service, setService] = useState(initialData?.service_interest || 'Full AI Automation Suite');
  const [notes, setNotes] = useState(initialData?.notes || '');

  if (!isOpen) return null;

  // Live AI Score preview
  const previewScore = calculateLeadScore({
    name,
    company,
    email,
    phone,
    source_id: source,
    estimated_value: Number(value || 0),
    status,
    notes,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialData?.id,
      name: name.trim(),
      company: company.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      source_id: source,
      status,
      estimated_value: Number(value || 0),
      service_interest: service,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialData ? 'Edit Opportunity' : 'Add New CRM Lead'}
            </h2>
            <p className="text-xs text-slate-400">
              Directly persisted to Supabase and synchronized across automations.
            </p>
          </div>
        </div>

        {/* Live Score Preview Strip */}
        <div className="p-3.5 rounded-xl bg-[#131b2e] border border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-300 font-medium">Estimated AI Qualification Score:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
              previewScore.score >= 80 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
              previewScore.score >= 60 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
              'bg-slate-700 text-slate-300'
            }`}>
              {previewScore.score}/100
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Company / Organization
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Corp"
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" /> WhatsApp / Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@company.com"
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-indigo-400" /> Deal Value (INR ₹)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="250000"
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Inbound Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="website">Website Form</option>
                <option value="meta_ads">Meta Ads</option>
                <option value="whatsapp">WhatsApp Inbound</option>
                <option value="instagram">Instagram DM</option>
                <option value="voice_call">Voice Agent</option>
                <option value="referral">Referral / Manual</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Pipeline Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="new">New Inbound</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="hot">Hot Deal</option>
                <option value="won">Closed Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Service / Solution Interested In</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. ElevenLabs AI Calling & Omnichannel CRM"
              className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" /> Discovery Notes & Requirements
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key requirements, budget timeline, specific challenges..."
              className="w-full bg-[#131b2e] border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              {initialData ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
