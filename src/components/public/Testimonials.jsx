import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

// Testimonials are intentionally static placeholders for now.
// The database is architected to add a `testimonials` table later
// (see README "Future Scalability") without any frontend rewrite —
// this component can be swapped for a service-backed version the same
// way Skills/Services/Experience are.
const placeholders = [
  {
    quote: 'Placeholder testimonial — replace with a real quote from a client or collaborator once available.',
    name: 'Client Name',
    role: 'Role, Company',
  },
  {
    quote: 'Placeholder testimonial — replace with a real quote from a client or collaborator once available.',
    name: 'Client Name',
    role: 'Role, Company',
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">Testimonials</p>
      <h2 className="mb-12 font-display text-3xl font-bold text-white sm:text-4xl">What people say</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {placeholders.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-line bg-white/[0.02] p-6"
          >
            <Quote size={20} className="mb-3 text-accent-soft/60" />
            <p className="text-sm leading-relaxed text-white/60">{t.quote}</p>
            <p className="mt-4 text-sm font-semibold text-white">{t.name}</p>
            <p className="text-xs text-white/40">{t.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
