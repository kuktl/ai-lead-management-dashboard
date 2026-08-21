import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Database, 
  ShieldCheck, 
  Key, 
  User, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  IndianRupee,
  DollarSign,
  Radio
} from 'lucide-react';
import { supabaseConfigured } from '../lib/supabase';
import { UserSession } from '../types';

interface SettingsViewProps {
  session: UserSession;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ session, onResetData }) => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [minHotScore, setMinHotScore] = useState(80);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-xs">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-slate-400">
          Manage database sync, authentication providers, qualification rules, and team workspace.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Workspace preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account & Profile */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Account & Authentication</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Administrator Email</label>
              <input
                type="email"
                value={session.email}
                readOnly
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Workspace Identity</label>
              <input
                type="text"
                value={session.name}
                readOnly
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Cloud Infrastructure & API Connections */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Cloud Infrastructure & Credentials</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#131b2e] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Supabase PostgreSQL Database</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Stores live leads, edge function webhooks, and auth sessions with Row Level Security (RLS).
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                supabaseConfigured
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {supabaseConfigured ? 'Connected' : 'Local Fallback Active'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#131b2e] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">ElevenLabs Conversational AI Voice Server</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Managed server-side in Supabase Edge Functions with secret API key masking.
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Lead Qualification & CRM Preferences */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">CRM & AI Qualification Rules</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="INR">₹ Indian Rupee (INR)</option>
                <option value="USD">$ US Dollar (USD)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Minimum Score for "Hot Deal" Alert</label>
              <input
                type="number"
                min={50}
                max={95}
                value={minHotScore}
                onChange={(e) => setMinHotScore(Number(e.target.value))}
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Danger Zone: Data Reset */}
        <div className="bg-[#0f172a] border border-rose-900/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-rose-300 text-sm">Demo Data & Cache Management</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Reset all sample leads, voice callers, and workflows to default clean state.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all leads and automations to factory demo data?')) {
                  onResetData();
                }
              }}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
