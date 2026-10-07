import React, { useState } from 'react';
import { Shield, Fingerprint, Lock, ArrowRight, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userName: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [emailOrId, setEmailOrId] = useState('');

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
            {/* Provider 1: Defense PKI / SmartCard (with Last Used badge) */}
            <button
              onClick={() => onLogin('Maj. Ankit Gupta (14 Corps Log)')}
              className="w-full relative flex items-center justify-center gap-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#222222] hover:border-zinc-600 text-zinc-200 hover:text-white py-2.5 px-4 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-zinc-300" />
              <span>Continue with Defense PKI / SmartCard</span>
              {/* Monochrome Last Used Badge matching Vercel layout */}
              <span className="absolute -top-2 right-3 px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono text-[9px] font-bold">
                Last Used
              </span>
            </button>

            {/* Provider 2: Service Net SAML SSO */}
            <button
              onClick={() => onLogin('Col. Logistics Directorate (HQ)')}
              className="w-full flex items-center justify-center gap-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#222222] hover:border-zinc-600 text-zinc-200 hover:text-white py-2.5 px-4 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4 text-zinc-400" />
              <span>Continue with SAML SSO</span>
            </button>

            {/* Provider 3: Hardware Passkey / FIDO2 */}
            <button
              onClick={() => onLogin('Tactical Edge Station (DBO Post)')}
              className="w-full flex items-center justify-center gap-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#222222] hover:border-zinc-600 text-zinc-200 hover:text-white py-2.5 px-4 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-zinc-400" />
              <span>Continue with Passkey</span>
            </button>

            {/* Provider 4: GitHub Developer SSO */}
            <button
              onClick={() => onLogin('ankitgpt18 (GitHub Verified)')}
              className="w-full flex items-center justify-center gap-2.5 bg-[#0a0a0a] hover:bg-[#141414] border border-[#222222] hover:border-zinc-600 text-zinc-200 hover:text-white py-2.5 px-4 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-zinc-300" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            {/* Provider 5: Instant Demo Bypass */}
            <button
              onClick={() => onLogin('Duty Logistics Officer')}
              className="w-full flex items-center justify-center gap-2 bg-[#0d0f14] hover:bg-[#161a24] border border-zinc-800 text-zinc-300 hover:text-white py-2 px-3 rounded-lg text-[11px] font-mono transition-colors cursor-pointer mt-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Instant Access as Duty Officer (Demo)</span>
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

      {/* Footer */}
      <footer className="h-12 border-t border-[#141414] px-6 flex items-center justify-center text-[11px] text-zinc-600 gap-4">
        <span>Terms</span>
        <span>&bull;</span>
        <span>Privacy Policy</span>
        <span>&bull;</span>
        <span>Defense Information Security Directive (OPSEC Level 1)</span>
      </footer>
    </div>
  );
};

export default LoginPage;
