import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { getProjectBySlug } from '../../services/projectService';

function Section({ title, children }) {
  if (!children) return null;
  return (
    <div className="border-t border-line pt-8">
      <h2 className="mb-3 font-display text-lg font-semibold text-white">{title}</h2>
      <p className="whitespace-pre-line leading-relaxed text-white/60">{children}</p>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getProjectBySlug(slug)
      .then((data) => {
        if (!data) {
          setNotFound(true);
        } else {
          setProject(data);
          document.title = `${data.title} — Mohsin`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', data.short_description || data.title);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
        <div className="h-8 w-40 animate-pulse rounded bg-white/5" />
        <div className="mt-6 aspect-video animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-3xl font-bold text-white">Project not found</h1>
        <p className="text-white/50">This project may be unpublished or no longer exists.</p>
        <Link to="/projects" className="mt-2 text-accent-soft hover:underline">
          Back to all projects
        </Link>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl px-6 pb-28 pt-28"
    >
      <Link to="/projects" className="mb-8 flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft size={15} /> Back to Projects
      </Link>

      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">{project.category}</p>
      <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{project.title}</h1>
      {project.short_description && <p className="mt-4 text-lg text-white/50">{project.short_description}</p>}

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/40">
        {project.role && <span>Role: {project.role}</span>}
        {project.project_date && <span>{new Date(project.project_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>}
        {project.client_type && <span>{project.client_type}</span>}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-white/80 hover:border-white/30 hover:text-white"
          >
            <Github size={15} /> GitHub
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-soft"
          >
            <ExternalLink size={15} /> Live Demo
          </a>
        )}
      </div>

      <div className="mt-10 aspect-video overflow-hidden rounded-2xl border border-line bg-black/40">
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/25 to-transparent">
            <span className="font-display text-3xl font-bold text-white/20">{project.title?.[0]}</span>
          </div>
        )}
      </div>

      {project.technologies?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 space-y-8">
        <Section title="Overview">{project.description}</Section>
        <Section title="Key Features">{project.key_features}</Section>
        <Section title="The Problem">{project.challenges}</Section>
        <Section title="The Solution">{project.solution}</Section>
        <Section title="Results">{project.results}</Section>
      </div>
    </motion.article>
  );
}
