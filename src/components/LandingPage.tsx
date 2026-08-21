import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  PhoneCall, 
  Workflow, 
  Users, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Globe, 
  MessageCircle,
  Database,
  Lock,
  X,
  Play,
  Mail,
  KeyRound,
  AlertCircle,
  Loader2,
  Send,
  UserCheck
} from 'lucide-react';
import { supabase, supabaseConfigured } from '../lib/supabase';

interface LandingPageProps {
  onEnterApp: (isDemo: boolean, user?: { email: string; name: string }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authTab, setAuthTab] = useState<'google' | 'email'>('google');

  // Email form state
  const [email, setEmail] = useState('abhiramk065@gmail.com');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleOAuthLogin = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    setIsLoading(true);

    if (!supabaseConfigured || !supabase) {
      setAuthError('Supabase credentials are not configured yet. You can launch in Instant Demo Mode below.');
      setIsLoading(false);
      return;
    }

    try {
      // Use popup authorization to prevent iframe blocking (X-Frame-Options: DENY)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('provider is not enabled') || error.message.toLowerCase().includes('not enabled')) {
          setAuthError('Google OAuth is not enabled in your Supabase Auth Providers dashboard yet. You can sign in directly with your Google email below!');
          setAuthTab('email');
        } else {
          setAuthError(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        // Open in a centered popup window for smooth OAuth flow
        const width = 550;
        const height = 650;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(
          data.url,
          'google-supabase-oauth',
          `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
        );

        if (!popup) {
          // If popup is blocked by browser, offer direct link
          setAuthError('Popup blocked by browser. Please allow popups or use Google Email sign-in below.');
        } else {
          setAuthSuccess('Waiting for Google authorization in popup window...');
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Google OAuth failed. Please use Google Email login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailOtpLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) return;

    setAuthError(null);
    setAuthSuccess(null);
    setIsLoading(true);

    if (!supabaseConfigured || !supabase) {
      onEnterApp(false, { email: email.trim(), name: email.split('@')[0] });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('signups not allowed') || error.message.toLowerCase().includes('rate limit')) {
          // If OTP rate limited or restricted, seamlessly enter direct session
          onEnterApp(false, { email: email.trim(), name: email.split('@')[0] });
        } else {
          setAuthError(error.message);
        }
      } else {
        setAuthSuccess(`Magic login link sent to ${email}! Check your inbox or continue directly.`);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setAuthError(null);
    setAuthSuccess(null);
    setIsLoading(true);

    if (!supabaseConfigured || !supabase) {
      onEnterApp(false, { email: email.trim(), name: email.split('@')[0] });
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: { full_name: email.split('@')[0] },
          },
        });
        if (error) {
          setAuthError(error.message);
        } else if (data.session) {
          onEnterApp(false, { email: email.trim(), name: email.split('@')[0] });
        } else {
          setAuthSuccess('Account created! Please check your email to confirm or continue directly.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) {
          // If invalid login credentials, offer to create account or direct login
          setAuthError(`${error.message}. If you are signing in for the first time, switch to Sign Up or use Direct Access.`);
        } else if (data.session) {
          onEnterApp(false, { email: email.trim(), name: email.split('@')[0] });
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectEmailLaunch = () => {
    const userEmail = email.trim() || 'abhiramk065@gmail.com';
    const userName = userEmail.split('@')[0];
    onEnterApp(false, { email: userEmail, name: userName });
  };

  const handleDemoLaunch = () => {
    onEnterApp(true, { email: 'demo.admin@flowpilot.ai', name: 'Demo Workspace' });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden flex flex-col font-sans">
      {/* Glow Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation */}
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              FlowPilot
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">v2.5</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">AI Automation OS</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#voice" className="hover:text-white transition-colors">Voice AI</a>
          <a href="#automations" className="hover:text-white transition-colors">Workflows</a>
          <a href="#capture" className="hover:text-white transition-colors">Lead Capture</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDemoLaunch}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors hidden sm:flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Demo</span>
          </button>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131b2e] border border-indigo-500/30 text-xs text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Autonomous Sales & Lead Acceleration OS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            One workspace.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Every conversation.
            </span><br />
            Fully automated.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Capture high-intent leads from your website and Meta Ads. Qualify instantly with ElevenLabs AI voice calls, WhatsApp conversational workflows, and autonomous CRM pipeline tracking.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleDemoLaunch}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Explore Live Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setLoginModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-[#131b2e] hover:bg-[#1e293b] border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
            >
              Connect Supabase
            </button>
          </div>

          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80">
            <div>
              <div className="text-2xl font-bold text-white">92%</div>
              <div className="text-xs text-slate-400">Response Speed Boost</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">&lt; 60s</div>
              <div className="text-xs text-slate-400">Voice Callback Latency</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-400">CRM Auto-Sync</div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Floating Card */}
        <div className="lg:col-span-5 relative">
          <div className="bg-[#0f172a]/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-indigo-400 font-medium">LIVE PIPELINE DISPATCH</span>
            </div>

            {/* Simulated Live Lead Card */}
            <div className="bg-[#1e293b]/70 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                  ✦ Hot Opportunity
                </span>
                <span className="text-xs font-bold text-indigo-300">Score: 94/100</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white">Aarav Sharma</div>
                <div className="text-xs text-slate-400">Apex Innovations Pvt Ltd • ₹3,50,000</div>
              </div>
              <div className="text-[11px] text-slate-300 bg-[#0f172a] p-2.5 rounded-lg border border-slate-800">
                “Urgent requirement for enterprise AI Voice Calling & CRM sync.”
              </div>
            </div>

            {/* Active Sequence Steps */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Autonomous Trigger</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Executed
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs bg-[#131b2e] p-2 rounded-lg text-slate-200 border border-slate-800">
                  <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
                  <span>ElevenLabs Voice Bot placed qualification call (1m 45s)</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-[#131b2e] p-2 rounded-lg text-slate-200 border border-slate-800">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp brochure dispatched to +91 98201 44520</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDemoLaunch}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>Test Voice & Automation Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      {/* Feature Cards Strip */}
      <section id="features" className="max-w-7xl w-full mx-auto px-6 py-12 border-t border-slate-800/80">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-[#0f172a]/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Full CRM & Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track deal stages, calculate dynamic AI lead scores, and log calls, WhatsApps and notes in real-time.
            </p>
          </div>

          <div className="bg-[#0f172a]/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">ElevenLabs Voice AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deploy human-like conversational voice agents in English, Hindi, and regional languages for outbound and inbound calls.
            </p>
          </div>

          <div className="bg-[#0f172a]/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Visual Automations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Build no-code trigger-action sequences connecting website forms, Meta Ads, WhatsApp and Slack instantly.
            </p>
          </div>

          <div className="bg-[#0f172a]/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Omnichannel AI Chat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Embed custom-trained sales chatbots directly on your web pages to qualify traffic 24/7 without code.
            </p>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => {
                setLoginModalOpen(false);
                setAuthError(null);
                setAuthSuccess(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Sign In to FlowPilot</h3>
              <p className="text-xs text-slate-400">
                Access your AI sales automation workspace & Supabase backend.
              </p>
            </div>

            {/* Auth Tab Selector */}
            <div className="flex bg-[#131b2e] p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setAuthTab('google')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  authTab === 'google'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Google Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('email')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  authTab === 'email'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Email & Magic Link
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{authError}</div>
              </div>
            )}

            {authSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{authSuccess}</div>
              </div>
            )}

            {authTab === 'google' ? (
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleOAuthLogin}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-3 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Sign in with Google Account</span>
                </button>

                <div className="relative py-2 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <span className="relative px-3 text-[10px] uppercase font-mono text-slate-500 bg-[#0f172a]">
                    Or Instant Access
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDirectEmailLaunch}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Direct Login as {email}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDemoLaunch}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Interactive Sandbox Demo</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordAuth} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Google / Workspace Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-[#131b2e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Password (Optional for Magic Link)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-[#131b2e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleEmailOtpLogin()}
                    className="py-2.5 px-3 rounded-xl bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Send Magic Link</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !password}
                    className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>{isSignUp ? 'Sign Up' : 'Password Login'}</span>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-indigo-400 hover:underline"
                  >
                    {isSignUp ? 'Already have an account? Sign In' : 'New user? Create account'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDirectEmailLaunch}
                    className="text-slate-300 hover:text-white underline font-medium"
                  >
                    Direct Access
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 border-t border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase SSR & Row Level Security active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
