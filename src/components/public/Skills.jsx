import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { getPublishedSkills } from '../../services/skillService';
import { SkillsSkeleton } from './Skeletons';

function Icon({ name, ...props }) {
  const Cmp = Icons[name] || Icons.Sparkles;
  return <Cmp {...props} />;
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPublishedSkills()
      .then(setSkills)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const grouped = skills.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-28">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">Skills</p>
      <h2 className="mb-12 font-display text-3xl font-bold text-white sm:text-4xl">What I work with</h2>

      {loading ? (
        <SkillsSkeleton />
      ) : error ? (
        <p className="text-white/40">Couldn't load skills right now.</p>
      ) : skills.length === 0 ? (
        <p className="text-white/40">Skills coming soon.</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {items.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] px-4 py-3 hover:border-accent/40"
                    title={s.description || ''}
                  >
                    {s.icon && <Icon name={s.icon} size={16} className="text-accent-soft" />}
                    <span className="text-sm font-medium text-white/80">{s.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
