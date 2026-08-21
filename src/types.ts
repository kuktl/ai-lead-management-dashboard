export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'hot' | 'won' | 'lost';

export type LeadSource = 'website' | 'whatsapp' | 'instagram' | 'meta_ads' | 'voice_call' | 'manual' | 'referral';

export interface QualificationBreakdown {
  intentScore: number;
  budgetFit: number;
  urgency: number;
  notes: string;
}

export interface ActivityLog {
  id: string;
  leadId: string;
  type: 'note' | 'call' | 'whatsapp' | 'email' | 'stage_change' | 'score_update';
  title: string;
  description: string;
  timestamp: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source_id: LeadSource;
  estimated_value: number;
  status: LeadStatus;
  score: number; // 0 to 100
  notes?: string;
  service_interest?: string;
  created_at: string;
  qualification?: QualificationBreakdown;
}

export type View = 'Overview' | 'Leads' | 'Automations' | 'AI Chat' | 'Voice Agent' | 'Integrations' | 'Settings';

export interface ElevenVoice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  preview_url?: string;
  gender?: 'female' | 'male' | 'neutral';
  accent?: string;
}

export interface VoiceAgentConfig {
  id: string;
  agent_id?: string;
  name: string;
  voice_id: string;
  voice_name: string;
  language: string;
  first_message: string;
  system_prompt: string;
  status: 'active' | 'draft' | 'archived';
  calls_count: number;
  last_active?: string;
}

export interface AutomationWorkflow {
  id: string;
  title: string;
  description: string;
  trigger: {
    type: 'new_lead' | 'score_threshold' | 'stage_change' | 'abandoned_chat';
    label: string;
    source?: string;
  };
  aiAction: {
    type: 'qualify' | 'summarize' | 'generate_script' | 'score_intent';
    label: string;
    details: string;
  };
  outboundAction: {
    type: 'voice_call' | 'whatsapp' | 'slack_alert' | 'assign_rep';
    label: string;
    recipient?: string;
  };
  enabled: boolean;
  executionsCount: number;
  successRate: number;
  lastRun?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'Pricing' | 'Services' | 'FAQ' | 'Company';
  content: string;
}

export interface ChatbotConfig {
  botName: string;
  greeting: string;
  persona: 'Friendly Consultant' | 'Executive Advisor' | 'Technical Specialist' | 'Direct Closer';
  qualificationQuestions: string[];
  autoCaptureLead: boolean;
  leadScoreBoost: number;
  knowledgeBase: KnowledgeItem[];
}

export interface UserSession {
  email: string;
  name: string;
  isDemo: boolean;
  avatarUrl?: string;
}
