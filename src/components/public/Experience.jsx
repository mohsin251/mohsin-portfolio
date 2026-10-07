import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPublishedExperience } from '../../services/experienceService';

export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedExperience()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-28">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">Journey</p>
      <h2 className="mb-12 font-display text-3xl font-bold text-white sm:text-4xl">Experience</h2>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-line bg-white/[0.02]" />
          ))}
        </div>
      ) : (
        <div className="relative space-y-8 border-l border-line pl-8">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative"
            >
              <span className="absolute -left-[38px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-accent-soft">{item.year}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-white">{item.title}</h3>
              {item.company && <p className="text-sm text-white/40">{item.company}</p>}
              <p className="mt-2 text-sm leading-relaxed text-white/50">{item.description}</p>
              {item.technologies?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.technologies.map((t) => (
                    <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/40">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
