import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, message, type }]);
    if (duration) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  const toast = {
    success: (msg) => push(msg, 'success'),
    error: (msg) => push(msg, 'error'),
    info: (msg) => push(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-[min(360px,90vw)]" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              role="status"
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md ${
                t.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : t.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-200'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
              }`}
            >
              {t.type === 'success' && <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
              {t.type === 'error' && <XCircle size={18} className="mt-0.5 shrink-0" />}
              {t.type === 'info' && <Info size={18} className="mt-0.5 shrink-0" />}
              <p className="text-sm leading-snug flex-1">{t.message}</p>
              <button onClick={() => remove(t.id)} aria-label="Dismiss notification" className="opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
