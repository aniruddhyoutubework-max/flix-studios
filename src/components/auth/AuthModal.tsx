import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle, Database } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    resetPassword,
    pendingBriefDraft,
    isBackendConfigured,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotView, setIsForgotView] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (!isBackendConfigured) {
        setErrorMsg(
          'Supabase credentials are not configured. To enable live account creation and ticket persistence, populate VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
        );
        setIsSubmitting(false);
        return;
      }

      if (isForgotView) {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMsg(res.message);
        } else {
          setErrorMsg(res.message);
        }
        setIsSubmitting(false);
        return;
      }

      if (authModalMode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Authentication rejected. Verify credentials.');
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Full name or username is required.');
          setIsSubmitting(false);
          return;
        }
        const res = await register(email, fullName, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed.');
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0D0E12] border border-white/10 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D7FF3F]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#D7FF3F] mb-3">
            <Lock className="w-3 h-3" />
            <span>SECURE STUDIO ACCESS</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            {isForgotView
              ? 'Reset Account Access'
              : authModalMode === 'login'
              ? 'Welcome to Flix Studios'
              : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-white/50 mt-1">
            {isForgotView
              ? 'Enter your registered email to request password reset authorization.'
              : authModalMode === 'login'
              ? 'Sign in to access your custom plugin tickets and verified review submissions.'
              : 'Register to submit custom development tickets and track progress.'}
          </p>
        </div>

        {/* Supabase backend status notice if unconfigured */}
        {!isBackendConfigured && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <Database className="w-4 h-4 shrink-0" />
              <span>Backend Configuration Required</span>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed">
              Customer accounts and tickets require Supabase. Please configure{' '}
              <code className="text-[#D7FF3F] font-mono">VITE_SUPABASE_URL</code> and{' '}
              <code className="text-[#D7FF3F] font-mono">VITE_SUPABASE_ANON_KEY</code> in your{' '}
              <code className="text-[#D7FF3F] font-mono">.env</code> file.
            </p>
          </div>
        )}

        {/* Draft preserved alert banner */}
        {pendingBriefDraft && (
          <div className="mb-4 p-3 rounded-xl bg-[#D7FF3F]/10 border border-[#D7FF3F]/30 flex items-start gap-2.5 text-xs text-[#D7FF3F]">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Project Brief Draft Preserved:</span> Your inquiry will be submitted
              automatically once authenticated.
            </div>
          </div>
        )}

        {/* Tab Toggle (Sign In / Register) */}
        {!isForgotView && (
          <div className="flex rounded-xl bg-white/5 p-1 mb-5 border border-white/5">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authModalMode === 'login'
                  ? 'bg-[#181920] text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authModalMode === 'register'
                  ? 'bg-[#181920] text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-2 text-xs text-green-400">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'register' && !isForgotView && (
            <div>
              <label className="block text-xs font-mono text-white/70 mb-1.5">FULL NAME / USERNAME</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full bg-[#14151B] border border-white/10 rounded-xl px-10 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-white/70 mb-1.5">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#14151B] border border-white/10 rounded-xl px-10 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>
          </div>

          {!isForgotView && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-white/70">PASSWORD</label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotView(true);
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-[#D7FF3F] hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#14151B] border border-white/10 rounded-xl px-10 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#c2eb2f] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D7FF3F]/20 disabled:opacity-50"
          >
            <span>
              {isSubmitting
                ? 'Processing...'
                : isForgotView
                ? 'Send Reset Link'
                : authModalMode === 'login'
                ? 'Sign In to Studio'
                : 'Complete Registration'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {isForgotView && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsForgotView(false);
                setErrorMsg('');
              }}
              className="text-xs text-white/60 hover:text-white"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
