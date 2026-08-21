import React, { useState } from 'react';
import { 
  Workflow, 
  Plus, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  PhoneCall, 
  MessageCircle, 
  Bell, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Sliders, 
  Globe, 
  Bot, 
  Check, 
  AlertCircle,
  Radio
} from 'lucide-react';
import { AutomationWorkflow, Lead } from '../types';
import { StorageService } from '../lib/storage';

interface AutomationsViewProps {
  workflows: AutomationWorkflow[];
  onToggleWorkflow: (id: string) => void;
  leads: Lead[];
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  workflows,
  onToggleWorkflow,
  leads,
}) => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'builder'>('workflows');
  const [selectedWf, setSelectedWf] = useState<AutomationWorkflow | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simLead, setSimLead] = useState<Lead>(leads[0] || {
    id: 'sim-lead',
    name: 'Aarav Sharma',
    company: 'Apex Innovations',
    email: 'aarav@apex.in',
    phone: '+91 98201 44520',
    source_id: 'website',
    estimated_value: 350000,
    status: 'new',
    score: 88,
    created_at: new Date().toISOString(),
  });

  const runSimulation = async (wf: AutomationWorkflow) => {
    setSelectedWf(wf);
    setIsSimulating(true);
    setSimStep(1);
    setSimLogs([`[0.0s] Trigger event received: ${wf.trigger.label} from ${simLead.name} (${simLead.company || 'Direct'})`]);

    await new Promise((r) => setTimeout(r, 900));
    setSimStep(2);
    setSimLogs((prev) => [
      ...prev,
      `[0.9s] AI Brain activated: ${wf.aiAction.label}`,
      `[1.2s] Calculating composite intent score... Result: 94/100`,
      `[1.5s] AI Lead brief generated: "High priority Enterprise lead looking for immediate setup."`,
    ]);

    await new Promise((r) => setTimeout(r, 1100));
    setSimStep(3);
    setSimLogs((prev) => [
      ...prev,
      `[2.0s] Outbound action initiated: ${wf.outboundAction.label}`,
      `[2.3s] Dispatched payload to ${simLead.phone || simLead.email || 'Destination Channel'}`,
      `[2.6s] Status: 200 OK • Workflow execution completed successfully.`,
    ]);

    StorageService.addActivity({
      id: `act-wf-${Date.now()}`,
      leadId: simLead.id,
      type: 'stage_change',
      title: `Automation Triggered: ${wf.title}`,
      description: `Executed step: ${wf.outboundAction.label}. Target: ${simLead.name}.`,
      timestamp: new Date().toISOString(),
      author: 'Workflow Engine',
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>AUTONOMOUS WORKFLOW RUNTIME</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Automation Builder & Triggers</h1>
          <p className="text-xs text-slate-400">
            Connect events, ElevenLabs AI callers, and WhatsApp templates into self-executing pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'workflows' ? 'bg-indigo-600 text-white' : 'bg-[#0f172a] text-slate-300 hover:bg-slate-800'
            }`}
          >
            Active Pipelines ({workflows.length})
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'builder' ? 'bg-indigo-600 text-white' : 'bg-[#0f172a] text-slate-300 hover:bg-slate-800'
            }`}
          >
            Visual Node Diagram
          </button>
        </div>
      </div>

      {activeTab === 'workflows' ? (
        <div className="grid md:grid-cols-2 gap-5">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className={`bg-[#0f172a] border rounded-2xl p-6 space-y-5 shadow-md transition-all ${
                wf.enabled ? 'border-[#1e293b] hover:border-indigo-500/40' : 'border-slate-800/60 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{wf.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{wf.description}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={wf.enabled}
                    onChange={() => onToggleWorkflow(wf.id)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* 3 Step Visual Sequence */}
              <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span className="font-semibold text-indigo-300">WHEN:</span>
                  <span className="truncate">{wf.trigger.label}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span className="font-semibold text-purple-300">AI:</span>
                  <span className="truncate">{wf.aiAction.label}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span className="font-semibold text-emerald-300">THEN:</span>
                  <span className="truncate">{wf.outboundAction.label}</span>
                </div>
              </div>

              {/* Workflow Meta & Simulation trigger */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span><b>{wf.executionsCount}</b> runs</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">{wf.successRate}% success</span>
                </div>

                <button
                  onClick={() => runSimulation(wf)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>Test Run</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Visual Node Diagram */
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-8 shadow-xl space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h2 className="text-xl font-bold text-white">Visual Autonomous Pipeline Graph</h2>
            <p className="text-xs text-slate-400">
              Inbound signals pass through real-time enrichment, scoring algorithms, and multi-channel responders.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* Step 1: Inbound Triggers */}
            <div className="bg-[#131b2e] border border-indigo-500/40 rounded-2xl p-5 space-y-3 relative shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                    01
                  </span>
                  <span className="text-sm font-bold text-white">Inbound Lead Capture Triggers</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  Event Listener
                </span>
              </div>
              <div className="grid sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800">
                  <Globe className="w-3.5 h-3.5 text-indigo-400 mb-1" />
                  <div className="font-semibold">Website Form POST</div>
                  <div className="text-[10px] text-slate-400">Via REST webhook</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                  <div className="font-semibold">Meta & WhatsApp</div>
                  <div className="text-[10px] text-slate-400">Inbound chats & ads</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800">
                  <PhoneCall className="w-3.5 h-3.5 text-purple-400 mb-1" />
                  <div className="font-semibold">Inbound Voice</div>
                  <div className="text-[10px] text-slate-400">Telephony trunk</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center text-slate-500 text-xl font-bold">↓</div>

            {/* Step 2: AI Lead Qualification Engine */}
            <div className="bg-[#131b2e] border border-purple-500/40 rounded-2xl p-5 space-y-3 relative shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                    02
                  </span>
                  <span className="text-sm font-bold text-white">AI Qualification & Intent Scoring</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  Machine Evaluation
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Extracts company size, budget capacity, timeline urgency, and ideal customer fit. Assigns dynamic 0–100 quality score.
              </p>
            </div>

            <div className="flex justify-center text-slate-500 text-xl font-bold">↓</div>

            {/* Step 3: Outbound Execution */}
            <div className="bg-[#131b2e] border border-emerald-500/40 rounded-2xl p-5 space-y-3 relative shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    03
                  </span>
                  <span className="text-sm font-bold text-white">Automated Multi-Channel Execution</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Real-Time Dispatch
                </span>
              </div>
              <div className="grid sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800">
                  <PhoneCall className="w-3.5 h-3.5 text-purple-400 mb-1" />
                  <div className="font-semibold">ElevenLabs Voice Call</div>
                  <div className="text-[10px] text-slate-400">Trigger within 60s</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                  <div className="font-semibold">WhatsApp Catalog / Link</div>
                  <div className="text-[10px] text-slate-400">Personalized greeting</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800">
                  <Bell className="w-3.5 h-3.5 text-amber-400 mb-1" />
                  <div className="font-semibold">Sales Rep Alert</div>
                  <div className="text-[10px] text-slate-400">Direct deal assignment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Simulation Modal */}
      {isSimulating && selectedWf && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Workflow Simulation</h3>
                  <div className="text-[11px] text-slate-400">{selectedWf.title}</div>
                </div>
              </div>
              <button
                onClick={() => setIsSimulating(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Step Progress Indicators */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`p-2.5 rounded-xl border text-center ${
                simStep >= 1 ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold' : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}>
                1. Trigger
              </div>
              <div className={`p-2.5 rounded-xl border text-center ${
                simStep >= 2 ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold' : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}>
                2. AI Qualification
              </div>
              <div className={`p-2.5 rounded-xl border text-center ${
                simStep >= 3 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}>
                3. Outbound Execution
              </div>
            </div>

            {/* Execution Console Logs */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 font-mono text-[11px] space-y-1.5 text-slate-300 min-h-[160px] max-h-[220px] overflow-y-auto">
              {simLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-indigo-400">› </span>
                  {log}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsSimulating(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
