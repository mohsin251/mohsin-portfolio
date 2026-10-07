import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Briefcase,
  History,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Sparkles },
  { to: '/admin/services', label: 'Services', icon: Briefcase },
  { to: '/admin/experience', label: 'Experience', icon: History },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onNavigate }) {
  const { signOut } = useAuth();

  return (
    <div className="flex h-full flex-col bg-bg-panel border-r border-line">
      <div className="flex items-center justify-between px-5 py-5 border-b border-line">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.3em] text-white">MOHSIN</p>
          <p className="text-[10px] uppercase tracking-widest text-accent-soft">Admin System</p>
        </div>
        <button className="md:hidden text-white/50" onClick={onNavigate} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-accent/15 text-accent-glow' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={17} /> View Portfolio
        </a>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-300/80 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );
}
