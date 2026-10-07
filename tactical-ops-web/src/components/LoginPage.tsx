import React, { useState } from 'react';
import { Fingerprint, Lock, ArrowRight, UserCheck, X } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userName: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [emailOrId, setEmailOrId] = useState('');
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = emailOrId.trim() ? emailOrId.trim() : 'Duty Logistics Officer';
    onLogin(finalName);
  };

  return (
    <div className="min-h-screen w-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-zinc-800 selection:text-white font-sans antialiased">
      {/* Top Navbar Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-[#141414]">
        <div className="flex items-center gap-2.5">
          <img src="/tandem-logo.png" alt="Tandem" className="w-6 h-6 object-contain rounded" />
          <span className="font-bold text-sm tracking-tight text-white">Tandem</span>
        </div>
        <button
          onClick={() => onLogin('Officer Cadet (Evaluation Access)')}
          className="px-3.5 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#222222] hover:border-zinc-600 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          Sign Up
        </button>
      </header>

      {/* Main Authentication Center Box */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[340px] sm:max-w-[360px] space-y-6">
          {/* Headline */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Log in to Tandem
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                placeholder="Email Address or Service ID"
                className="w-full bg-[#0a0a0a] border border-[#222222] focus:border-zinc-500 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white hover:bg-zinc-200 text-black font-semibold text-sm py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Continue with Email</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          </form>

          {/* Subtle Horizontal Divider */}
          <div className="w-full h-px bg-[#1a1a1a]" />

          {/* Authentication Provider Buttons */}
          <div className="space-y-2.5">
            {/* Provider 1: Continue with Google (with Last Used badge) */}
            <button
              onClick={() => onLogin('Ankit Gupta')}
              className="w-full relative flex items-center justify-center gap-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#222222] hover:border-zinc-600 text-zinc-200 hover:text-white py-2.5 px-4 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.54 0 2.9.54 3.97 1.43l2.96-2.96C17.13 1.83 14.74 1 12 1 7.42 1 3.53 3.58 1.63 7.34l3.54 2.75C6.01 7.22 8.78 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.69 2.87c2.16-1.99 3.73-4.93 3.73-8.69z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.17 14.91c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.63 7.64C.59 9.69 0 11.99 0 14.41s.59 4.72 1.63 6.77l3.54-2.75z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.69-2.87c-1.07.72-2.45 1.15-4.24 1.15-3.22 0-5.99-2.22-6.83-5.09L1.63 15.91C3.53 19.67 7.42 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
              {/* Monochrome Last Used Badge matching layout */}
              <span className="absolute -top-2 right-3 px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[9px] font-bold">
                Last Used
              </span>
            </button>

            {/* Provider 2: GitHub Developer SSO */}
            <button
              onClick={() => onLogin('ankitgpt18')}
              className="w-full flex items-center justify-center gap-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#222222] hover:border-zinc-600 text-zinc-200 hover:text-white py-2.5 px-4 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-zinc-300 shrink-0" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            {/* Provider 3: Service Net SAML SSO */}
            <button
              onClick={() => onLogin('Col. Logistics Directorate')}
              className="w-full flex items-center justify-center gap-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#222222] hover:border-zinc-600 text-zinc-200 hover:text-white py-2.5 px-4 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Continue with SAML SSO</span>
            </button>

            {/* Provider 4: Hardware Passkey / FIDO2 */}
            <button
              onClick={() => onLogin('Tactical Edge Station')}
              className="w-full flex items-center justify-center gap-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#222222] hover:border-zinc-600 text-zinc-200 hover:text-white py-2.5 px-4 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Continue with Passkey</span>
            </button>

            {/* Provider 5: Instant Duty Officer */}
            <button
              onClick={() => onLogin('Duty Logistics Officer')}
              className="w-full flex items-center justify-center gap-2 bg-[#0d0f14] hover:bg-[#161a24] border border-zinc-800 text-zinc-300 hover:text-white py-2 px-3 rounded-lg text-[11px] font-mono transition-colors cursor-pointer mt-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Instant Access as Duty Officer</span>
            </button>
          </div>

          {/* Bottom links */}
          <div className="pt-2 text-center text-xs text-zinc-500 space-y-2">
            <div>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onLogin('Officer Cadet (Evaluation Access)')}
                className="text-white hover:underline cursor-pointer font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (with clickable Terms & Privacy Policy in exact positions) */}
      <footer className="h-12 border-t border-[#141414] px-6 flex items-center justify-center text-[11px] text-zinc-500 gap-4">
        <button
          onClick={() => setActiveModal('terms')}
          className="hover:text-zinc-200 transition-colors cursor-pointer"
        >
          Terms
        </button>
        <span>&bull;</span>
        <button
          onClick={() => setActiveModal('privacy')}
          className="hover:text-zinc-200 transition-colors cursor-pointer"
        >
          Privacy Policy
        </button>
      </footer>

      {/* Casual, Humanized Terms Modal (Monochrome Grey/White) */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0c0e15] border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4 text-xs text-zinc-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-bold text-sm text-white">Terms of Use</span>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 leading-relaxed text-[11.5px] text-zinc-400">
              <p>
                Tandem is built for real-time mountain corridor pathfinding and high-altitude stocking intelligence.
              </p>
              <div className="p-3 rounded-lg bg-[#11131a] border border-zinc-800/80 space-y-1.5 text-zinc-300">
                <div className="font-bold text-white">1. Keep it responsible</div>
                <p className="text-zinc-400 text-[11px]">
                  Use dispatch plans and consumption models for authorized testing, evaluation, and mission logistics only.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#11131a] border border-zinc-800/80 space-y-1.5 text-zinc-300">
                <div className="font-bold text-white">2. Local compute first</div>
                <p className="text-zinc-400 text-[11px]">
                  Models train on your machine. You control your local terminal and offline SQLite caches.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#11131a] border border-zinc-800/80 space-y-1.5 text-zinc-300">
                <div className="font-bold text-white">3. Zero lock-in</div>
                <p className="text-zinc-400 text-[11px]">
                  No hidden cloud telemetry, no surprise subscription limits, and zero external tracker cookies.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg bg-white text-slate-950 font-bold hover:bg-zinc-200 transition-colors cursor-pointer text-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Casual, Humanized Privacy Policy Modal (Monochrome Grey/White) */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0c0e15] border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4 text-xs text-zinc-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-bold text-sm text-white">Privacy Policy</span>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 leading-relaxed text-[11.5px] text-zinc-400">
              <p>
                Plain talk, no legal runarounds:
              </p>
              <div className="p-3 rounded-lg bg-[#11131a] border border-zinc-800/80 space-y-1.5 text-zinc-300">
                <div className="font-bold text-white">1. Your data stays on your device</div>
                <p className="text-zinc-400 text-[11px]">
                  Raw ammunition ledgers, fuel tank meters, and unit locations are never sent to a central cloud server.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#11131a] border border-zinc-800/80 space-y-1.5 text-zinc-300">
                <div className="font-bold text-white">2. Mathematical privacy</div>
                <p className="text-zinc-400 text-[11px]">
                  When models exchange weights over the radio mesh, Differential Privacy injects calibrated mathematical noise so no base ledger can be inverted.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#11131a] border border-zinc-800/80 space-y-1.5 text-zinc-300">
                <div className="font-bold text-white">3. Zero commercial tracking</div>
                <p className="text-zinc-400 text-[11px]">
                  We don't sell user data, track analytics across the web, or collect personal identifiers.
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg bg-white text-slate-950 font-bold hover:bg-zinc-200 transition-colors cursor-pointer text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
