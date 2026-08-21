import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare,
  Bot,
  User,
  Clock
} from 'lucide-react';
import { Lead, VoiceAgentConfig } from '../types';
import { StorageService } from '../lib/storage';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  agent?: VoiceAgentConfig | null;
}

interface MessageItem {
  sender: 'agent' | 'user';
  text: string;
  time: string;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  isOpen,
  onClose,
  lead,
  agent,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [transcriptInput, setTranscriptInput] = useState('');
  
  const timerRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const activeAgentName = agent?.name || 'FlowPilot Sales Qualifier';
  const activeVoiceName = agent?.voice_name || 'Rachel (ElevenLabs)';
  const firstGreeting = agent?.first_message || `Hi ${lead?.name || 'there'}! This is Rachel calling from FlowPilot regarding your inquiry. Do you have 2 minutes to discuss your team’s automation goals?`;

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setCallState('connecting');
      setMessages([]);
      if (timerRef.current) clearInterval(timerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Connect call after 1.2s
    const connectTimer = setTimeout(() => {
      setCallState('connected');
      speakText(firstGreeting);
      setMessages([
        {
          sender: 'agent',
          text: firstGreeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ]);

      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }, 1200);

    return () => {
      clearTimeout(connectTimer);
      if (timerRef.current) clearInterval(timerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [isOpen]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setIsSpeaking(false);
      }
    }
  };

  const handleUserReply = (replyText: string) => {
    if (!replyText.trim() || callState !== 'connected') return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const userMsg: MessageItem = {
      sender: 'user',
      text: replyText,
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setTranscriptInput('');

    // Generate intelligent AI Voice response
    setTimeout(() => {
      let agentReply = "That sounds like a great fit. Our system automates WhatsApp, Instagram DMs, and voice callbacks seamlessly with full CRM sync.";
      const lower = replyText.toLowerCase();

      if (lower.includes('price') || lower.includes('cost') || lower.includes('budget')) {
        agentReply = "Our Starter plan begins at ₹14,999/mo, and our AI Voice Calling Growth plan is ₹39,999/mo. We can also customize according to your lead volume.";
      } else if (lower.includes('crm') || lower.includes('leads') || lower.includes('volume')) {
        agentReply = "Understood! We connect directly to your website forms and Meta Ads, qualification is instant, and hot deals push directly to your sales reps.";
      } else if (lower.includes('demo') || lower.includes('meeting') || lower.includes('yes') || lower.includes('sure')) {
        agentReply = "Fantastic! I have booked a 15-minute live screen walkthrough for you. Our team will send the Google Meet invitation to your email right away.";
      } else if (lower.includes('call back') || lower.includes('busy') || lower.includes('later')) {
        agentReply = "No problem at all! I will schedule a follow-up reminder for tomorrow at 11 AM. Thank you and have a wonderful day!";
      }

      speakText(agentReply);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: agentReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ]);
    }, 900);
  };

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setCallState('ended');
    setIsSpeaking(false);

    // Save activity to lead log
    if (lead) {
      StorageService.addActivity({
        id: `act-call-${Date.now()}`,
        leadId: lead.id,
        type: 'call',
        title: `Voice Call Completed (${Math.floor(callDuration / 60)}m ${callDuration % 60}s)`,
        description: `Conversational AI call with ${activeAgentName}. Discussed requirements & solutions. Transcripts logged.`,
        timestamp: new Date().toISOString(),
        author: `Voice Bot ${activeVoiceName}`,
      });
    }
  };

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with Call Meta */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <PhoneCall className={`w-5 h-5 ${callState === 'connected' ? 'animate-bounce' : ''}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{activeAgentName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  ElevenLabs AI
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Calling: <span className="text-slate-200 font-medium">{lead?.name || 'Live Prospect'}</span> ({lead?.phone || '+91 98201 44520'})
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-mono font-bold text-slate-200">
              {callState === 'connected' ? formatTimer(callDuration) : callState === 'connecting' ? 'Connecting...' : 'Call Ended'}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{callState === 'connected' ? 'HD Voice Stream' : callState}</span>
            </div>
          </div>
        </div>

        {/* Voice Visualizer Waveform */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-1.5 h-16">
            {[40, 65, 30, 85, 55, 95, 45, 75, 35, 90, 60, 40].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-gradient-to-t from-indigo-500 to-purple-400 animate-pulse'
                    : 'bg-slate-700 h-3'
                }`}
                style={{
                  height: isSpeaking ? `${Math.max(12, (h * ((i % 3) + 1)) % 55)}px` : '8px',
                }}
              />
            ))}
          </div>

          <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Voice: {activeVoiceName} • Low-Latency Conversational AI</span>
          </div>
        </div>

        {/* Real-time Transcription Stream */}
        <div className="flex-1 min-h-[160px] max-h-[220px] overflow-y-auto bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 text-xs ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'agent' && (
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                  AI
                </div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-[#1a233d] text-slate-200 rounded-bl-none border border-slate-700'
                }`}
              >
                <div>{m.text}</div>
                <div className="text-[9px] text-slate-400 mt-1 text-right">{m.time}</div>
              </div>
              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                  You
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preset Quick Voice Dialogue Actions */}
        {callState === 'connected' && (
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400 font-medium">Quick Lead Response Prompts:</div>
            <div className="flex flex-wrap gap-2">
              {[
                'We need an AI CRM setup for 500 leads/month.',
                'What is your pricing model for Voice Agents?',
                'Yes, please schedule a 15-minute live demo.',
                'Can you call back tomorrow morning at 11 AM?',
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUserReply(preset)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/40 text-[11px] text-slate-200 transition-colors text-left"
                >
                  “{preset}”
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input & Call Controls */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          {callState === 'connected' ? (
            <>
              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="text"
                  value={transcriptInput}
                  onChange={(e) => setTranscriptInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUserReply(transcriptInput)}
                  placeholder="Speak or type customer response…"
                  className="flex-1 bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleUserReply(transcriptInput)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                >
                  Send
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-xl border ${
                    isMuted
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Call ended. All transcripts and qualification notes logged to CRM.
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Close Summary
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
