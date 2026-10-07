import { useEffect, useState } from 'react';
import { Mail, MailOpen, Archive, Trash2, X } from 'lucide-react';
import { getAllMessages, markMessageStatus, deleteMessage } from '../../services/messageService';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/admin/ConfirmModal';

const badge = {
  NEW: 'bg-accent/15 text-accent-glow',
  READ: 'bg-white/10 text-white/50',
  ARCHIVED: 'bg-amber-500/10 text-amber-300',
};

export default function Messages() {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setMessages(await getAllMessages());
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = async (msg) => {
    setSelected(msg);
    if (msg.status === 'NEW') {
      try {
        await markMessageStatus(msg.id, 'READ');
        load();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const archive = async (msg) => {
    try {
      await markMessageStatus(msg.id, 'ARCHIVED');
      toast.success('Message archived');
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async () => {
    try {
      await deleteMessage(pendingDelete.id);
      toast.success('Message deleted');
      setPendingDelete(null);
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="mb-1 font-display text-2xl font-bold text-white">Messages</h1>
      <p className="mb-6 text-sm text-white/40">Contact form submissions from your portfolio.</p>

      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-16 text-center text-white/40">No messages yet.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-bg-panel divide-y divide-line">
          {messages.map((m) => (
            <button key={m.id} onClick={() => open(m)} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02]">
              {m.status === 'NEW' ? <Mail size={16} className="shrink-0 text-accent-soft" /> : <MailOpen size={16} className="shrink-0 text-white/30" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-white">{m.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${badge[m.status]}`}>{m.status}</span>
                </div>
                <p className="truncate text-sm text-white/40">{m.email} {m.project_type ? `· ${m.project_type}` : ''}</p>
                <p className="truncate text-xs text-white/30">{m.message}</p>
              </div>
              <span className="shrink-0 text-xs text-white/30">{new Date(m.created_at).toLocaleDateString()}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/70 px-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-line bg-bg-panel p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-white">{selected.name}</h2>
                <p className="text-sm text-white/40">{selected.email}</p>
                {selected.project_type && <p className="text-xs text-accent-soft mt-1">{selected.project_type}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <p className="whitespace-pre-wrap rounded-lg border border-line bg-black/30 p-4 text-sm text-white/80">{selected.message}</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => archive(selected)} className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs text-white/70 hover:bg-white/5">
                <Archive size={14} /> Archive
              </button>
              <button
                onClick={() => setPendingDelete(selected)}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title="DELETE MESSAGE?"
        description="This action cannot be easily undone."
        confirmLabel="DELETE"
        onConfirm={remove}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
