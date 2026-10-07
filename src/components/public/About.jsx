import { motion } from 'framer-motion';

const philosophies = [
  { title: 'Clarity over cleverness', body: 'Simple, legible systems beat clever ones that only their author understands.' },
  { title: 'Ship, then refine', body: 'Real feedback from a working product beats speculation about a perfect one.' },
  { title: 'Design is structural', body: 'Good interfaces are the visible surface of good architecture underneath.' },
];

export default function About({ settings }) {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-soft">About</p>
        <h2 className="max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">
          {settings?.bio || 'A developer focused on building intelligent, well-crafted software products.'}
        </h2>
        {settings?.location && <p className="mt-4 text-sm text-white/40">Based in {settings.location}</p>}
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {philosophies.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-line bg-white/[0.02] p-6"
          >
            <h3 className="font-display text-lg font-semibold text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
