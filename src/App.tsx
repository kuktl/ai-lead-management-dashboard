import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { View, Lead, UserSession, VoiceAgentConfig, AutomationWorkflow, ChatbotConfig } from './types';
import { StorageService } from './lib/storage';
import { supabase, supabaseConfigured } from './lib/supabase';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LandingPage } from './components/LandingPage';
import { OverviewView } from './components/OverviewView';
import { LeadsView } from './components/LeadsView';
import { LeadModal } from './components/LeadModal';
import { LeadDetailDrawer } from './components/LeadDetailDrawer';
import { AutomationsView } from './components/AutomationsView';
import { AIChatStudio } from './components/AIChatStudio';
import { VoiceAgentStudio } from './components/VoiceAgentStudio';
import { VoiceCallModal } from './components/VoiceCallModal';
import { IntegrationsView } from './components/IntegrationsView';
import { SettingsView } from './components/SettingsView';

export function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState<View>('Overview');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [voiceAgents, setVoiceAgents] = useState<VoiceAgentConfig[]>([]);
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig>(StorageService.getChatbotConfig());
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals and Drawers
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Voice Call Modal state
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [activeCallingLead, setActiveCallingLead] = useState<Lead | null>(null);
  const [activeCallingAgent, setActiveCallingAgent] = useState<VoiceAgentConfig | null>(null);

  // Check initial session & load data
  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initApp = async () => {
      setLoading(true);

      // Check Supabase session if configured
      if (supabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            setSession({
              email: data.session.user.email || 'user@flowpilot.ai',
              name: data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || 'Team Admin',
              isDemo: false,
            });
          }

          // Subscribe to auth state changes (OAuth redirects, popup callbacks, magic links)
          const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (newSession?.user) {
              setSession({
                email: newSession.user.email || 'user@flowpilot.ai',
                name: newSession.user.user_metadata?.full_name || newSession.user.email?.split('@')[0] || 'Team Admin',
                isDemo: false,
              });
            } else if (event === 'SIGNED_OUT') {
              setSession(null);
            }
          });
          authSubscription = authListener.subscription;
        } catch (e) {
          console.warn('Supabase auth session check failed', e);
        }
      }

      // Load initial storage data
      const loadedLeads = await StorageService.getLeads();
      setLeads(loadedLeads);
      setWorkflows(StorageService.getWorkflows());
      setVoiceAgents(StorageService.getVoiceAgents());
      setChatbotConfig(StorageService.getChatbotConfig());
      setLoading(false);
    };

    initApp();

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const refreshLeads = async () => {
    setLoading(true);
    const data = await StorageService.getLeads();
    setLeads(data);
    setLoading(false);
  };

  const handleEnterApp = (isDemo: boolean, user?: { email: string; name: string }) => {
    setSession({
      email: user?.email || 'demo.admin@flowpilot.ai',
      name: user?.name || 'Demo Workspace',
      isDemo,
    });
    setCurrentView('Overview');
  };

  const handleSignOut = async () => {
    if (supabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setSession(null);
    setCurrentView('Overview');
  };

  const handleSaveLead = async (leadData: any) => {
    const isNew = !leadData.id;
    const saved = await StorageService.saveLead(leadData);
    await refreshLeads();

    if (isNew) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    if (selectedLead && selectedLead.id === saved.id) {
      setSelectedLead(saved);
    }
  };

  const handleDeleteLead = async (id: string) => {
    await StorageService.deleteLead(id);
    if (selectedLead?.id === id) setSelectedLead(null);
    await refreshLeads();
  };

  const handleUpdateStatus = async (id: string, status: any) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    const updated = await StorageService.saveLead({
      ...lead,
      status,
    });

    if (status === 'won') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    await refreshLeads();
    if (selectedLead?.id === id) {
      setSelectedLead(updated);
    }
  };

  const handleToggleWorkflow = (id: string) => {
    const updated = workflows.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w));
    setWorkflows(updated);
    StorageService.saveWorkflows(updated);
  };

  const handleSaveVoiceAgent = (agent: VoiceAgentConfig) => {
    const updated = [agent, ...voiceAgents];
    setVoiceAgents(updated);
    StorageService.saveVoiceAgents(updated);
  };

  const handleDeleteVoiceAgent = (id: string) => {
    const updated = voiceAgents.filter((a) => a.id !== id);
    setVoiceAgents(updated);
    StorageService.saveVoiceAgents(updated);
  };

  const handleResetData = async () => {
    const fresh = await StorageService.resetToDemoData();
    setLeads(fresh);
    setWorkflows(StorageService.getWorkflows());
    setVoiceAgents(StorageService.getVoiceAgents());
    setChatbotConfig(StorageService.getChatbotConfig());
    setSelectedLead(null);
  };

  const handleTriggerVoiceCall = (lead?: Lead | null, agent?: VoiceAgentConfig | null) => {
    setActiveCallingLead(lead || null);
    setActiveCallingAgent(agent || voiceAgents[0] || null);
    setIsVoiceCallOpen(true);
  };

  // If no session, show Landing Page
  if (!session) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        session={session}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace Frame */}
      <div className="pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <Topbar
          currentView={currentView}
          session={session}
          onOpenAddLead={() => {
            setEditingLead(null);
            setIsAddLeadOpen(true);
          }}
          onResetData={handleResetData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* View Routing */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {currentView === 'Overview' && (
            <OverviewView
              leads={leads}
              onNavigate={setCurrentView}
              onOpenAddLead={() => {
                setEditingLead(null);
                setIsAddLeadOpen(true);
              }}
              onSelectLead={setSelectedLead}
            />
          )}

          {currentView === 'Leads' && (
            <LeadsView
              leads={leads}
              onAddLead={() => {
                setEditingLead(null);
                setIsAddLeadOpen(true);
              }}
              onSelectLead={setSelectedLead}
              onUpdateStatus={handleUpdateStatus}
              onDeleteLead={handleDeleteLead}
              onTriggerCall={(lead) => handleTriggerVoiceCall(lead)}
              onRefresh={refreshLeads}
              loading={loading}
            />
          )}

          {currentView === 'Automations' && (
            <AutomationsView
              workflows={workflows}
              onToggleWorkflow={handleToggleWorkflow}
              leads={leads}
            />
          )}

          {currentView === 'AI Chat' && (
            <AIChatStudio
              config={chatbotConfig}
              onSaveConfig={(cfg) => {
                setChatbotConfig(cfg);
                StorageService.saveChatbotConfig(cfg);
              }}
              onLeadCaptured={async (name, phone, email, budget) => {
                await StorageService.saveLead({
                  name,
                  company: null,
                  phone,
                  email,
                  source_id: 'website',
                  status: 'new',
                  estimated_value: budget || 150000,
                  service_interest: 'AI Chatbot Inbound Inquiry',
                });
                await refreshLeads();
              }}
            />
          )}

          {currentView === 'Voice Agent' && (
            <VoiceAgentStudio
              agents={voiceAgents}
              voices={StorageService.getVoices()}
              onTriggerCallWithAgent={(ag) => handleTriggerVoiceCall(leads[0], ag)}
              onSaveAgent={handleSaveVoiceAgent}
              onDeleteAgent={handleDeleteVoiceAgent}
            />
          )}

          {currentView === 'Integrations' && (
            <IntegrationsView
              onLeadCaptured={async (lead) => {
                await refreshLeads();
                setSelectedLead(lead);
              }}
            />
          )}

          {currentView === 'Settings' && (
            <SettingsView session={session} onResetData={handleResetData} />
          )}
        </main>
      </div>

      {/* Add / Edit Lead Modal */}
      {isAddLeadOpen && (
        <LeadModal
          isOpen={isAddLeadOpen}
          onClose={() => {
            setIsAddLeadOpen(false);
            setEditingLead(null);
          }}
          onSave={handleSaveLead}
          initialData={editingLead}
        />
      )}

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onEdit={(lead) => {
            setEditingLead(lead);
            setIsAddLeadOpen(true);
          }}
          onDelete={handleDeleteLead}
          onUpdateStatus={handleUpdateStatus}
          onTriggerCall={(lead) => handleTriggerVoiceCall(lead)}
          onRescored={(updated) => {
            setSelectedLead(updated);
            refreshLeads();
          }}
        />
      )}

      {/* Interactive Voice Calling Modal */}
      {isVoiceCallOpen && (
        <VoiceCallModal
          isOpen={isVoiceCallOpen}
          onClose={() => setIsVoiceCallOpen(false)}
          lead={activeCallingLead}
          agent={activeCallingAgent}
        />
      )}
    </div>
  );
}
export default App;
