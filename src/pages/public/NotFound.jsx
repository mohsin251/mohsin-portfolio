import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-8xl font-bold text-white/10"
      >
        404
      </motion.p>
      <h1 className="font-display text-2xl font-bold text-white">Page not found</h1>
      <p className="max-w-sm text-white/50">The page you're looking for doesn't exist or may have been moved.</p>
      <Link
        to="/"
        className="mt-4 flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-soft"
      >
        <Home size={15} /> Back Home
      </Link>
    </div>
  );
}
