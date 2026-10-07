import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { getFeaturedProjects } from '../../services/projectService';

export default function FeaturedProject() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProjects()
      .then((list) => setProject(list?.[0] || null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="h-96 animate-pulse rounded-3xl border border-line bg-white/[0.02]" />
      </section>
    );
  }

  if (!project) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">Featured Project</p>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="overflow-hidden rounded-3xl border border-line bg-white/[0.02]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-video bg-black/40 md:aspect-auto">
            {project.image_url ? (
              <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-accent/30 to-transparent" />
            )}
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <span className="mb-3 w-fit rounded-full border border-line px-3 py-1 text-xs uppercase tracking-widest text-white/40">
              {project.category}
            </span>
            <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">{project.title}</h3>
            <p className="mt-3 text-white/50">{project.short_description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(project.technologies || []).slice(0, 5).map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/50">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/projects/${project.slug}`}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-soft"
              >
                View Case Study <ArrowUpRight size={15} />
              </Link>
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-white/70 hover:text-white"
                >
                  <Github size={15} /> GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
