import { Lead, AutomationWorkflow, VoiceAgentConfig, ChatbotConfig, ActivityLog, ElevenVoice } from '../types';
import { INITIAL_LEADS, INITIAL_WORKFLOWS, INITIAL_VOICE_AGENTS, INITIAL_CHATBOT_CONFIG, INITIAL_VOICES } from '../data/initialData';
import { supabase, supabaseConfigured } from './supabase';

const LEADS_STORAGE_KEY = 'flowpilot_leads_data_v2';
const WORKFLOWS_STORAGE_KEY = 'flowpilot_workflows_data_v2';
const VOICE_AGENTS_STORAGE_KEY = 'flowpilot_voice_agents_data_v2';
const CHATBOT_STORAGE_KEY = 'flowpilot_chatbot_data_v2';
const ACTIVITIES_STORAGE_KEY = 'flowpilot_activities_data_v2';

export function calculateLeadScore(lead: Partial<Lead>): { score: number; qualification: Lead['qualification'] } {
  let score = 40; // baseline
  let intentScore = 50;
  let budgetFit = 50;
  let urgency = 50;

  // Value evaluation
  const val = Number(lead.estimated_value || 0);
  if (val > 1000000) {
    score += 25;
    budgetFit = 95;
  } else if (val > 400000) {
    score += 20;
    budgetFit = 85;
  } else if (val > 100000) {
    score += 12;
    budgetFit = 75;
  } else if (val > 0) {
    score += 6;
    budgetFit = 60;
  }

  // Source evaluation
  if (lead.source_id === 'website') {
    score += 15;
    intentScore += 20;
  } else if (lead.source_id === 'whatsapp' || lead.source_id === 'voice_call') {
    score += 18;
    intentScore += 25;
    urgency += 15;
  } else if (lead.source_id === 'meta_ads') {
    score += 12;
    intentScore += 15;
  }

  // Completeness check
  if (lead.email && lead.phone) {
    score += 10;
  }
  if (lead.company) {
    score += 5;
  }

  // Status multiplier
  if (lead.status === 'hot') score = Math.max(score, 85);
  if (lead.status === 'won') score = 98;
  if (lead.status === 'lost') score = Math.min(score, 30);

  const finalScore = Math.min(Math.max(score, 15), 99);

  return {
    score: finalScore,
    qualification: {
      intentScore: Math.min(intentScore, 98),
      budgetFit: Math.min(budgetFit, 95),
      urgency: Math.min(urgency, 95),
      notes: finalScore >= 80 
        ? 'High-priority prospect with strong buying signals. Immediate outreach recommended.' 
        : finalScore >= 60 
          ? 'Standard qualified lead. Nurture with automated case studies and follow-up.' 
          : 'Early stage interest. Requires further qualification.',
    },
  };
}

export const StorageService = {
  // --- LEADS ---
  async getLeads(): Promise<Lead[]> {
    if (supabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: String(item.id),
            name: item.name || 'Anonymous Lead',
            company: item.company || null,
            email: item.email || null,
            phone: item.phone || null,
            source_id: (item.source_id as any) || 'website',
            estimated_value: Number(item.estimated_value || 0),
            status: item.status || 'new',
            score: Number(item.score || 50),
            notes: item.notes || '',
            service_interest: item.service_interest || '',
            created_at: item.created_at || new Date().toISOString(),
            qualification: item.qualification || {
              intentScore: 70,
              budgetFit: 70,
              urgency: 70,
              notes: 'Imported from Supabase database.',
            },
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch from Supabase, falling back to local store', err);
      }
    }

    // Local storage fallback
    const local = localStorage.getItem(LEADS_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }

    // Default seed
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
    return INITIAL_LEADS;
  },

  async saveLead(leadData: Omit<Lead, 'id' | 'created_at' | 'score'> & { id?: string; score?: number }): Promise<Lead> {
    const isEdit = Boolean(leadData.id);
    const id = leadData.id || `lead-${Date.now()}`;
    const calculated = calculateLeadScore(leadData);

    const fullLead: Lead = {
      ...leadData,
      id,
      score: leadData.score !== undefined ? leadData.score : calculated.score,
      qualification: calculated.qualification,
      created_at: new Date().toISOString(),
    };

    if (supabaseConfigured && supabase) {
      try {
        if (isEdit) {
          await supabase.from('leads').update({
            name: fullLead.name,
            company: fullLead.company,
            email: fullLead.email,
            phone: fullLead.phone,
            source_id: fullLead.source_id,
            estimated_value: fullLead.estimated_value,
            status: fullLead.status,
            score: fullLead.score,
          }).eq('id', fullLead.id);
        } else {
          await supabase.from('leads').insert({
            id: fullLead.id,
            name: fullLead.name,
            company: fullLead.company,
            email: fullLead.email,
            phone: fullLead.phone,
            source_id: fullLead.source_id,
            estimated_value: fullLead.estimated_value,
            status: fullLead.status,
            score: fullLead.score,
          });
        }
      } catch (e) {
        console.warn('Supabase write error, keeping in local store', e);
      }
    }

    // Always keep local storage in sync
    const current = await this.getLeads();
    let updated: Lead[];
    if (isEdit) {
      updated = current.map(l => l.id === fullLead.id ? { ...l, ...fullLead } : l);
    } else {
      updated = [fullLead, ...current];
    }
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));

    // Log activity
    this.addActivity({
      id: `act-${Date.now()}`,
      leadId: fullLead.id,
      type: isEdit ? 'stage_change' : 'note',
      title: isEdit ? `Lead Updated: ${fullLead.name}` : `New Lead Created: ${fullLead.name}`,
      description: isEdit ? `Status is now ${fullLead.status}, Score: ${fullLead.score}` : `Added via ${fullLead.source_id} with estimated value ₹${fullLead.estimated_value.toLocaleString('en-IN')}`,
      timestamp: new Date().toISOString(),
      author: 'FlowPilot System',
    });

    return fullLead;
  },

  async deleteLead(id: string): Promise<void> {
    if (supabaseConfigured && supabase) {
      try {
        await supabase.from('leads').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete error', e);
      }
    }
    const current = await this.getLeads();
    const filtered = current.filter(l => l.id !== id);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(filtered));
  },

  async resetToDemoData(): Promise<Lead[]> {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
    localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(INITIAL_WORKFLOWS));
    localStorage.setItem(VOICE_AGENTS_STORAGE_KEY, JSON.stringify(INITIAL_VOICE_AGENTS));
    localStorage.setItem(CHATBOT_STORAGE_KEY, JSON.stringify(INITIAL_CHATBOT_CONFIG));
    return INITIAL_LEADS;
  },

  // --- WORKFLOWS ---
  getWorkflows(): AutomationWorkflow[] {
    const raw = localStorage.getItem(WORKFLOWS_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(INITIAL_WORKFLOWS));
    return INITIAL_WORKFLOWS;
  },

  saveWorkflows(workflows: AutomationWorkflow[]) {
    localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(workflows));
  },

  // --- VOICE AGENTS ---
  getVoiceAgents(): VoiceAgentConfig[] {
    const raw = localStorage.getItem(VOICE_AGENTS_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    localStorage.setItem(VOICE_AGENTS_STORAGE_KEY, JSON.stringify(INITIAL_VOICE_AGENTS));
    return INITIAL_VOICE_AGENTS;
  },

  saveVoiceAgents(agents: VoiceAgentConfig[]) {
    localStorage.setItem(VOICE_AGENTS_STORAGE_KEY, JSON.stringify(agents));
  },

  getVoices(): ElevenVoice[] {
    return INITIAL_VOICES;
  },

  // --- CHATBOT ---
  getChatbotConfig(): ChatbotConfig {
    const raw = localStorage.getItem(CHATBOT_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    localStorage.setItem(CHATBOT_STORAGE_KEY, JSON.stringify(INITIAL_CHATBOT_CONFIG));
    return INITIAL_CHATBOT_CONFIG;
  },

  saveChatbotConfig(config: ChatbotConfig) {
    localStorage.setItem(CHATBOT_STORAGE_KEY, JSON.stringify(config));
  },

  // --- ACTIVITIES ---
  getActivities(): ActivityLog[] {
    const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return [
      {
        id: 'act-1',
        leadId: 'lead-1',
        type: 'call',
        title: 'Voice Call Completed',
        description: 'Rachel completed 1m 45s qualification call. Lead verified ₹3.5L budget.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        author: 'Voice Agent Rachel',
      },
      {
        id: 'act-2',
        leadId: 'lead-2',
        type: 'whatsapp',
        title: 'WhatsApp Catalog Sent',
        description: 'Automated workflow #1 delivered product deck to +91 98450 88211.',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        author: 'FlowPilot Automation',
      },
    ];
  },

  addActivity(activity: ActivityLog) {
    const current = this.getActivities();
    const updated = [activity, ...current].slice(0, 50);
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(updated));
  },
};
