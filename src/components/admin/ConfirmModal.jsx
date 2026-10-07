import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({
  open,
  title = 'ARE YOU SURE?',
  description = 'This action cannot be easily undone.',
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  danger = true,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-line bg-bg-panel p-6 shadow-2xl"
          >
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${danger ? 'bg-red-500/10 text-red-400' : 'bg-accent/10 text-accent-soft'}`}>
              <AlertTriangle size={22} />
            </div>
            <h2 id="confirm-modal-title" className="font-display text-lg font-bold text-white tracking-wide">
              {title}
            </h2>
            <p className="mt-2 text-sm text-white/50">{description}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                  danger ? 'bg-red-600 hover:bg-red-500' : 'bg-accent hover:bg-accent-soft'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
