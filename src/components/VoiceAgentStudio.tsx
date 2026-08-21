import React, { useState } from 'react';
import { 
  PhoneCall, 
  Plus, 
  Sparkles, 
  Play, 
  Volume2, 
  Globe, 
  Bot, 
  CheckCircle2, 
  Settings2, 
  Trash2, 
  Clock, 
  ShieldCheck,
  Radio,
  FileText
} from 'lucide-react';
import { VoiceAgentConfig, ElevenVoice, Lead } from '../types';
import { StorageService } from '../lib/storage';
import { supabase } from '../lib/supabase';

interface VoiceAgentStudioProps {
  agents: VoiceAgentConfig[];
  voices: ElevenVoice[];
  onTriggerCallWithAgent: (agent: VoiceAgentConfig) => void;
  onSaveAgent: (agent: VoiceAgentConfig) => void;
  onDeleteAgent: (agentId: string) => void;
}

export const VoiceAgentStudio: React.FC<VoiceAgentStudioProps> = ({
  agents,
  voices,
  onTriggerCallWithAgent,
  onSaveAgent,
  onDeleteAgent,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('Enterprise Sales Qualifier');
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM');
  const [language, setLanguage] = useState('en');
  const [firstMessage, setFirstMessage] = useState('Hi! This is Sarah calling from FlowPilot. I noticed your recent inquiry regarding sales automation—do you have 2 minutes to talk?');
  const [prompt, setPrompt] = useState('You are Sarah, an energetic and professional sales development representative for FlowPilot. Greet the prospect politely, ask about their monthly lead volume, evaluate their budget and urgency, and schedule a product demo.');

  const handlePreviewVoice = (voice: ElevenVoice) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlayingVoiceId(voice.voice_id);
      const text = `Hello! This is ${voice.name} from ElevenLabs. I can qualify leads and book appointments automatically.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setPlayingVoiceId(null);
      utterance.onerror = () => setPlayingVoiceId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedVoice = voices.find((v) => v.voice_id === voiceId);

    const newAgent: VoiceAgentConfig = {
      id: `va-${Date.now()}`,
      agent_id: `agent_eleven_${Date.now()}`,
      name,
      voice_id: voiceId,
      voice_name: selectedVoice ? selectedVoice.name : 'Rachel',
      language,
      first_message: firstMessage,
      system_prompt: prompt,
      status: 'active',
      calls_count: 0,
      last_active: 'Just created',
    };

    onSaveAgent(newAgent);
    setIsCreating(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-medium mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ELEVENLABS CONVERSATIONAL AI ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Voice Agent Studio</h1>
          <p className="text-xs text-slate-400">
            Build and test low-latency AI sales callers that speak naturally in multiple languages.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Voice Agent</span>
        </button>
      </div>

      {/* Hero Banner with Audio Wave */}
      <div className="bg-gradient-to-r from-[#131b2e] via-[#1c1836] to-[#161f36] border border-purple-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-xl">
          <h2 className="text-xl font-bold text-white">
            Human-Like Conversational Calling
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            FlowPilot integrates with ElevenLabs Conversational AI. Calls happen in real-time with sub-second latency, natural turn-taking, and automated CRM transcription.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Multi-Language & Bilingual</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Direct CRM Transcript Sync</span>
            </div>
          </div>
        </div>

        <div className="z-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#0b0f19] p-4 rounded-2xl border border-slate-800">
            {[30, 60, 45, 90, 75, 100, 50, 80, 40].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-full animate-pulse"
                style={{ height: `${h * 0.4}px`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-[11px] text-purple-300 font-mono">11Labs Real-Time Voice Pipeline</span>
        </div>
      </div>

      {/* Voice Agents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Your Deployed AI Callers ({agents.length})
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-[#0f172a] border border-[#1e293b] hover:border-purple-500/40 rounded-2xl p-6 space-y-4 shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {agent.name}
                    </h4>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Voice: <b className="text-slate-200">{agent.voice_name}</b></span>
                      <span>•</span>
                      <span className="capitalize">Lang: <b className="text-slate-200">{agent.language}</b></span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold uppercase">
                  {agent.status}
                </span>
              </div>

              <div className="bg-[#131b2e] border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
                <div className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
                  Initial Greeting Script:
                </div>
                <p className="line-clamp-2 leading-relaxed italic text-slate-200">
                  “{agent.first_message}”
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                <div>
                  <span className="font-bold text-white">{agent.calls_count}</span> calls completed
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteAgent(agent.id)}
                    className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete agent"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onTriggerCallWithAgent(agent)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Test Call</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Catalog Selector Strip */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Available ElevenLabs Voices
            </h3>
            <p className="text-xs text-slate-400">
              High-fidelity neural voices with custom emotion and dynamic pitch control.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {voices.map((voice) => (
            <div
              key={voice.voice_id}
              className="bg-[#131b2e] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span>{voice.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 capitalize">
                    {voice.gender || 'neutral'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{voice.description}</div>
              </div>

              <button
                onClick={() => handlePreviewVoice(voice)}
                className={`p-2 rounded-lg transition-colors ${
                  playingVoiceId === voice.voice_id
                    ? 'bg-purple-600 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-purple-400'
                }`}
                title="Preview voice"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Voice Agent Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative my-8 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Create Conversational Voice Agent</h3>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Agent Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Inbound Demo Qualifier"
                  className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">ElevenLabs Voice</label>
                  <select
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value)}
                    className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {voices.map((v) => (
                      <option key={v.voice_id} value={v.voice_id}>
                        {v.name} ({v.gender || 'neutral'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="en">English (Global)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="en-hi">English + Hindi Bilingual</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="mr">Marathi (मराठी)</option>
                    <option value="es">Spanish (Español)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Opening Greeting (First Message)</label>
                <textarea
                  rows={2}
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                  className="w-full bg-[#131b2e] border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">System Prompt & Qualification Rules</label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-[#131b2e] border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/20 transition-all"
                >
                  Deploy Voice Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
