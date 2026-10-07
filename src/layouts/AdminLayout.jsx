import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/admin/Sidebar';

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      <div className="hidden md:grid md:grid-cols-[260px_1fr] h-screen">
        <Sidebar />
        <div className="overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <div className="md:hidden flex flex-col h-screen">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <button onClick={() => setDrawerOpen(true)} aria-label="Open menu" className="text-white/70">
            <Menu size={22} />
          </button>
          <p className="font-display text-sm font-bold tracking-[0.3em]">MOHSIN ADMIN</p>
          <div className="w-[22px]" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="h-full w-[260px]"
            >
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </motion.div>
            <div className="flex-1 bg-black/60" onClick={() => setDrawerOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
