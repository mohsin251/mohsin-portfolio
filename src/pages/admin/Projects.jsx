import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Table as TableIcon,
  LayoutGrid,
  Pencil,
  Copy,
  Trash2,
  Eye,
  Star,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import {
  getAllProjects,
  deleteProject,
  duplicateProject,
  setPublished,
} from '../../services/projectService';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const FILTERS = ['All', 'Published', 'Draft', 'Featured'];

export default function Projects() {
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filter === 'Published' && !p.published) return false;
      if (filter === 'Draft' && p.published) return false;
      if (filter === 'Featured' && !p.featured) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${p.title} ${p.category} ${(p.technologies || []).join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [projects, search, filter]);

  const handleTogglePublish = async (project) => {
    try {
      await setPublished(project.id, !project.published);
      toast.success(project.published ? 'Project unpublished' : 'Project published');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDuplicate = async (project) => {
    try {
      await duplicateProject(project.id);
      toast.success('Project duplicated as draft');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteProject(pendingDelete.id);
      toast.success('Project deleted');
      setPendingDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-white/40">{projects.length} total</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-soft"
        >
          <Plus size={16} /> Add Project
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-bg-panel px-3 py-2 sm:w-80">
          <Search size={15} className="text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, tech, category…"
            className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                filter === f ? 'border-accent bg-accent/15 text-accent-glow' : 'border-line text-white/50 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
          <div className="ml-2 flex rounded-lg border border-line p-1">
            <button
              onClick={() => setView('table')}
              aria-label="Table view"
              className={`rounded-md p-1.5 ${view === 'table' ? 'bg-white/10 text-white' : 'text-white/40'}`}
            >
              <TableIcon size={15} />
            </button>
            <button
              onClick={() => setView('grid')}
              aria-label="Grid view"
              className={`rounded-md p-1.5 ${view === 'grid' ? 'bg-white/10 text-white' : 'text-white/40'}`}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-line bg-bg-panel" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-16 text-center text-white/40">
          No projects match this view yet.
        </div>
      ) : view === 'table' ? (
        <div className="overflow-x-auto rounded-2xl border border-line bg-bg-panel">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-white/40">
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md bg-black/40">
                        {p.image_url ? (
                          <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-accent/30 to-transparent" />
                        )}
                      </div>
                      <span className="font-medium text-white">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60">{p.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        p.published ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {p.published ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.featured && <Star size={15} className="fill-amber-400 text-amber-400" />}
                  </td>
                  <td className="px-4 py-3 text-white/40">{new Date(p.updated_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <a
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="View"
                        className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white"
                      >
                        <Eye size={15} />
                      </a>
                      <Link to={`/admin/projects/${p.id}/edit`} title="Edit" className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => handleDuplicate(p)} title="Duplicate" className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white">
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => handleTogglePublish(p)}
                        title={p.published ? 'Unpublish' : 'Publish'}
                        className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white"
                      >
                        {p.published ? <Circle size={15} /> : <CheckCircle2 size={15} />}
                      </button>
                      <button
                        onClick={() => setPendingDelete(p)}
                        title="Delete"
                        className="rounded-md p-1.5 text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-line bg-bg-panel">
              <div className="aspect-video bg-black/40">
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-accent/30 to-transparent" />
                )}
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-white">{p.title}</h3>
                  {p.featured && <Star size={14} className="fill-amber-400 text-amber-400" />}
                </div>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.published ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/10 text-white/50'
                  }`}
                >
                  {p.published ? 'Published' : 'Draft'}
                </span>
                <div className="mt-3 flex justify-between gap-1.5 border-t border-line pt-3">
                  <Link to={`/admin/projects/${p.id}/edit`} className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white">
                    <Pencil size={15} />
                  </Link>
                  <button onClick={() => handleDuplicate(p)} className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white">
                    <Copy size={15} />
                  </button>
                  <button onClick={() => handleTogglePublish(p)} className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white">
                    {p.published ? <Circle size={15} /> : <CheckCircle2 size={15} />}
                  </button>
                  <button onClick={() => setPendingDelete(p)} className="rounded-md p-1.5 text-red-400/70 hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title="DELETE PROJECT?"
        description="This action cannot be easily undone."
        confirmLabel="DELETE PROJECT"
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
