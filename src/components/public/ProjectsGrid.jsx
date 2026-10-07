import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { getPublishedProjects } from '../../services/projectService';
import { ProjectCardSkeleton } from './Skeletons';

export default function ProjectsGrid({ limit, showFilters = true, title = 'Projects', subtitle = 'Selected Work' }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    getPublishedProjects()
      .then(setProjects)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    let list = activeCategory === 'ALL' ? projects : projects.filter((p) => p.category === activeCategory);
    if (limit) list = list.slice(0, limit);
    return list;
  }, [projects, activeCategory, limit]);

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-28">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">{subtitle}</p>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        {showFilters && categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider ${
                  activeCategory === c ? 'border-accent bg-accent/15 text-accent-glow' : 'border-line text-white/40 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="text-white/40">Couldn't load projects right now. Please try again later.</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-16 text-center text-white/40">No projects to show yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
              className="group overflow-hidden rounded-2xl border border-line bg-white/[0.02] transition-colors hover:border-accent/40"
            >
              <Link to={`/projects/${p.slug}`}>
                <div className="aspect-video overflow-hidden bg-black/40">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/25 to-transparent">
                      <span className="font-display text-xl font-bold text-white/20">{p.title?.[0]}</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-white/30">{p.category}</span>
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-white/40 hover:text-white">
                        <Github size={14} />
                      </a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noreferrer" aria-label="Live demo" className="text-white/40 hover:text-white">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <Link to={`/projects/${p.slug}`}>
                  <h3 className="font-display font-semibold text-white group-hover:text-accent-glow">{p.title}</h3>
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-white/50">{p.short_description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
