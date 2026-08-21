import React, { useState } from 'react';
import { 
  MessageSquare, 
  Bot, 
  Send, 
  Plus, 
  Trash2, 
  Code, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  Sliders, 
  HelpCircle,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { ChatbotConfig, KnowledgeItem } from '../types';
import { StorageService } from '../lib/storage';

interface AIChatStudioProps {
  config: ChatbotConfig;
  onSaveConfig: (config: ChatbotConfig) => void;
  onLeadCaptured?: (name: string, phone: string, email: string, budget: number) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const AIChatStudio: React.FC<AIChatStudioProps> = ({
  config,
  onSaveConfig,
  onLeadCaptured,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: config.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<'persona' | 'knowledge' | 'embed'>('persona');
  const [copiedCode, setCopiedCode] = useState(false);

  // New Knowledge Item state
  const [newKbTitle, setNewKbTitle] = useState('');
  const [newKbContent, setNewKbContent] = useState('');
  const [newKbCategory, setNewKbCategory] = useState<KnowledgeItem['category']>('FAQ');

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Dynamic AI Sales Response logic based on Knowledge Base & Persona
    setTimeout(() => {
      let botResponse = "Thank you for sharing! Our AI platform automates lead qualification, voice callbacks, and CRM synchronization. May I have your name and contact number to arrange a live walkthrough?";
      const lower = userText.toLowerCase();

      // Check KB matches
      const matchedKb = config.knowledgeBase.find((item) =>
        lower.includes(item.title.toLowerCase()) || 
        item.content.toLowerCase().split(' ').some((word) => word.length > 5 && lower.includes(word))
      );

      if (matchedKb) {
        botResponse = `${matchedKb.content} Would you like me to connect you with our solutions specialist?`;
      } else if (lower.includes('price') || lower.includes('plan') || lower.includes('cost')) {
        botResponse = "Our plans start at ₹14,999/mo (Starter) and ₹39,999/mo (Growth with AI Voice Calling). What is your current monthly lead volume?";
      } else if (lower.includes('whatsapp') || lower.includes('meta') || lower.includes('instagram')) {
        botResponse = "Yes! FlowPilot integrates directly with Meta Cloud API for WhatsApp, Instagram DM automation, and instant CRM lead sync.";
      } else if (lower.includes('voice') || lower.includes('calling') || lower.includes('elevenlabs')) {
        botResponse = "We use ElevenLabs Conversational AI for sub-second latency voice calls in English, Hindi, and regional languages. It qualifies leads in under 90 seconds!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleAddKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKbTitle.trim() || !newKbContent.trim()) return;

    const newItem: KnowledgeItem = {
      id: `kb-${Date.now()}`,
      title: newKbTitle.trim(),
      category: newKbCategory,
      content: newKbContent.trim(),
    };

    const updated = {
      ...config,
      knowledgeBase: [newItem, ...config.knowledgeBase],
    };
    onSaveConfig(updated);
    setNewKbTitle('');
    setNewKbContent('');
  };

  const handleDeleteKnowledge = (id: string) => {
    const updated = {
      ...config,
      knowledgeBase: config.knowledgeBase.filter((k) => k.id !== id),
    };
    onSaveConfig(updated);
  };

  const embedScript = `<!-- FlowPilot AI Sales Chatbot Embed -->
<script 
  src="https://cdn.flowpilot.ai/widget.js" 
  data-bot-id="flowpilot_sales_prod_01"
  data-theme="dark"
  async>
</script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Chat Studio</h1>
          <p className="text-xs text-slate-400">
            Train your 24/7 sales brain, customize conversational tone, and embed on your website.
          </p>
        </div>

        <button
          onClick={() => setActiveConfigTab('embed')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-pink-600/20 flex items-center gap-2 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Code className="w-4 h-4" />
          <span>Get Embed Code</span>
        </button>
      </div>

      {/* Main Studio Grid: Chat Sandbox + Config Tabs */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Interactive Chatbot Sandbox */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl flex flex-col h-[640px]">
          {/* Chat Window Header */}
          <div className="p-4 bg-[#131b2e] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{config.botName}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-400">Persona: {config.persona}</div>
              </div>
            </div>

            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'reset-1',
                    sender: 'bot',
                    text: config.greeting,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ])
              }
              className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 transition-colors"
            >
              Reset Chat
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b0f19]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 text-xs ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
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
                  <div className="text-[9px] text-slate-400 mt-1 text-right">{m.timestamp}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#131b2e] border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about pricing, services, or leave contact info..."
              className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right: Configuration & Knowledge Base */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-xl flex flex-col h-[640px] overflow-y-auto space-y-5 text-xs">
          {/* Nav Tabs */}
          <div className="flex items-center gap-1 bg-[#131b2e] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveConfigTab('persona')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeConfigTab === 'persona' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Persona & Tone
            </button>
            <button
              onClick={() => setActiveConfigTab('knowledge')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeConfigTab === 'knowledge' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Knowledge Base ({config.knowledgeBase.length})
            </button>
            <button
              onClick={() => setActiveConfigTab('embed')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeConfigTab === 'embed' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Website Embed
            </button>
          </div>

          {activeConfigTab === 'persona' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Chatbot Display Name</label>
                <input
                  type="text"
                  value={config.botName}
                  onChange={(e) => onSaveConfig({ ...config, botName: e.target.value })}
                  className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Sales Persona</label>
                <select
                  value={config.persona}
                  onChange={(e) => onSaveConfig({ ...config, persona: e.target.value as any })}
                  className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Friendly Consultant">Friendly Consultant (Empathetic & Helpful)</option>
                  <option value="Executive Advisor">Executive Advisor (B2B Enterprise Tone)</option>
                  <option value="Technical Specialist">Technical Specialist (Feature-Driven)</option>
                  <option value="Direct Closer">Direct Closer (High-Intent Conversion Focus)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Opening Welcome Message</label>
                <textarea
                  rows={3}
                  value={config.greeting}
                  onChange={(e) => onSaveConfig({ ...config, greeting: e.target.value })}
                  className="w-full bg-[#131b2e] border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#131b2e] border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Auto-Capture Inbound Leads</div>
                  <div className="text-[10px] text-slate-400">Extract name & phone into CRM automatically</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoCaptureLead}
                  onChange={(e) => onSaveConfig({ ...config, autoCaptureLead: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeConfigTab === 'knowledge' && (
            <div className="space-y-4">
              <form onSubmit={handleAddKnowledge} className="bg-[#131b2e] border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="font-semibold text-white">Add Knowledge Article / FAQ</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    required
                    type="text"
                    value={newKbTitle}
                    onChange={(e) => setNewKbTitle(e.target.value)}
                    placeholder="Title (e.g. Pricing FAQ)"
                    className="bg-[#0f172a] border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={newKbCategory}
                    onChange={(e) => setNewKbCategory(e.target.value as any)}
                    className="bg-[#0f172a] border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Pricing">Pricing</option>
                    <option value="Services">Services</option>
                    <option value="FAQ">FAQ</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
                <textarea
                  required
                  rows={2}
                  value={newKbContent}
                  onChange={(e) => setNewKbContent(e.target.value)}
                  placeholder="Knowledge text or answer snippet..."
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none text-xs"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Brain</span>
                </button>
              </form>

              <div className="space-y-2">
                {config.knowledgeBase.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-[#131b2e] border border-slate-800 space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          {item.category}
                        </span>
                        <button
                          onClick={() => handleDeleteKnowledge(item.id)}
                          className="text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeConfigTab === 'embed' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#131b2e] border border-slate-800 rounded-xl space-y-3">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>Embed on Any Web Page</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Paste this script inside your website’s <code className="text-indigo-300">&lt;head&gt;</code> or <code className="text-indigo-300">&lt;body&gt;</code> tags.
                </p>

                <div className="relative">
                  <pre className="bg-[#0b0f19] border border-slate-800 p-3 rounded-xl text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre">
                    {embedScript}
                  </pre>
                  <button
                    onClick={copyEmbedCode}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[10px]"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-[#131b2e] border border-slate-800 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-slate-300">
                  Leads captured in the chatbot automatically sync into your CRM table.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
