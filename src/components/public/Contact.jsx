import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { submitContactMessage } from '../../services/messageService';

const PROJECT_TYPES = ['Web App', 'AI / ML', 'Landing Page', 'Consulting', 'Other'];

export default function Contact({ settings }) {
  const [form, setForm] = useState({ name: '', email: '', project_type: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.message.trim()) errs.message = 'Please write a message.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      await submitContactMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', project_type: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-28">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">Contact</p>
      <h2 className="mb-4 font-display text-3xl font-bold text-white sm:text-4xl">Let's build something</h2>
      <p className="mb-10 text-white/50">
        {settings?.email ? `Reach me directly at ${settings.email}, or ` : ''}send a message below.
      </p>

      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-emerald-200"
        >
          <CheckCircle2 size={22} />
          <p>Thanks — your message has been sent. I'll get back to you soon.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Project Type</label>
            <select
              value={form.project_type}
              onChange={(e) => setForm({ ...form, project_type: e.target.value })}
              className="w-full rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
            >
              <option value="">Select one (optional)</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg border border-line bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
            />
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
          </div>

          {status === 'error' && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              Something went wrong sending your message. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-soft disabled:opacity-60"
          >
            {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {status === 'loading' ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </section>
  );
}
