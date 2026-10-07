import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { signIn, session, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!authLoading && session && isAdmin) {
    return <Navigate to={location.state?.from?.pathname || '/admin/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await signIn(email, password);
      setStatus('success');
      setTimeout(() => navigate('/admin/dashboard'), 600);
    } catch (err) {
      if (err.message?.toLowerCase().includes('invalid')) {
        setStatus('invalid');
        setErrorMsg('Invalid email or password.');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'Connection error. Please try again.');
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm rounded-2xl border border-line bg-bg-panel/80 p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
            <ShieldCheck className="text-accent-glow" size={22} />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-[0.2em] text-white">MOHSIN</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-accent-soft">Admin System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Email
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-black/30 px-3 py-2.5 focus-within:border-accent">
              <Mail size={16} className="text-white/30" />
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
                placeholder="you@domain.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-line bg-black/30 px-3 py-2.5 focus-within:border-accent">
              <Lock size={16} className="text-white/30" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {(status === 'invalid' || status === 'error') && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-accent-soft disabled:opacity-70"
          >
            {status === 'loading' && (
              <>
                <Loader2 size={16} className="animate-spin" /> Authenticating...
              </>
            )}
            {status === 'success' && <>Authenticated ✓</>}
            {(status === 'idle' || status === 'invalid' || status === 'error') && <>Authenticate</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
