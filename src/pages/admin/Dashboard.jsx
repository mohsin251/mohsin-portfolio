import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, CheckCircle2, FileEdit, Star, Mail, Plus } from 'lucide-react';
import { getAllProjects } from '../../services/projectService';
import { getAllMessages } from '../../services/messageService';

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-line bg-bg-panel p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-white/40">{label}</p>
        <Icon size={18} className={accent} />
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, m] = await Promise.all([getAllProjects(), getAllMessages()]);
        setProjects(p);
        setMessages(m);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = {
    total: projects.length,
    published: projects.filter((p) => p.published).length,
    drafts: projects.filter((p) => !p.published).length,
    featured: projects.filter((p) => p.featured).length,
    messages: messages.filter((m) => m.status !== 'ARCHIVED').length,
  };

  const recentActivity = [...projects]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 6);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/40">Overview of your portfolio content.</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-soft"
        >
          <Plus size={16} /> Add Project
        </Link>
      </div>

      {error && <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-line bg-bg-panel" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCard label="Total Projects" value={stats.total} icon={FolderKanban} accent="text-accent-soft" />
          <StatCard label="Published" value={stats.published} icon={CheckCircle2} accent="text-emerald-400" />
          <StatCard label="Drafts" value={stats.drafts} icon={FileEdit} accent="text-amber-400" />
          <StatCard label="Featured" value={stats.featured} icon={Star} accent="text-pink-400" />
          <StatCard label="Messages" value={stats.messages} icon={Mail} accent="text-sky-400" />
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Recent Activity</h2>
        <div className="rounded-2xl border border-line bg-bg-panel divide-y divide-line">
          {recentActivity.length === 0 && !loading && (
            <p className="p-6 text-sm text-white/40">No project activity yet. Add your first project to get started.</p>
          )}
          {recentActivity.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{p.title}</p>
                <p className="text-xs text-white/40">
                  {p.published ? 'Published' : 'Draft'} · updated {new Date(p.updated_at).toLocaleString()}
                </p>
              </div>
              <Link to={`/admin/projects/${p.id}/edit`} className="shrink-0 text-xs font-medium text-accent-soft hover:underline">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
