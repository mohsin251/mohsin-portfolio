import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const publicCommands = [
    { label: 'Go Home', action: () => navigate('/') },
    { label: 'Go About', action: () => navigate('/about') },
    { label: 'Go Skills', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Go Projects', action: () => navigate('/projects') },
    { label: 'Go Experience', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Go Contact', action: () => navigate('/contact') },
    { label: 'Download Resume', action: () => window.open('/resume.pdf', '_blank') },
    { label: 'Open GitHub', action: () => window.open('https://github.com', '_blank') },
    { label: 'Open LinkedIn', action: () => window.open('https://linkedin.com', '_blank') },
  ];

  const adminCommands = isAdmin
    ? [
        { label: 'Go Dashboard', action: () => navigate('/admin/dashboard') },
        { label: 'Go Admin Projects', action: () => navigate('/admin/projects') },
        { label: 'Add Project', action: () => navigate('/admin/projects/new') },
        { label: 'Go Messages', action: () => navigate('/admin/messages') },
        { label: 'Go Settings', action: () => navigate('/admin/settings') },
      ]
    : [];

  const commands = [...publicCommands, ...adminCommands].filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const run = (cmd) => {
    cmd.action();
    setOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9995] flex items-start justify-center bg-black/70 px-4 pt-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-bg-panel shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search size={16} className="text-white/30" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command…"
                className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-white/30">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {commands.length === 0 && <p className="px-4 py-6 text-center text-sm text-white/30">No matching commands.</p>}
              {commands.map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => run(cmd)}
                  className="flex w-full items-center px-4 py-2.5 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
