import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Save, X } from 'lucide-react';
import { getAllSkills, createSkill, updateSkill, deleteSkill } from '../../services/skillService';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/admin/ConfirmModal';

const empty = { name: '', category: 'General', icon: '', description: '', display_order: 0, published: true };

export default function Skills() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getAllSkills());
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

  const startEdit = (item) => {
    setEditing(item.id);
    setForm(item);
  };

  const startNew = () => {
    setEditing('new');
    setForm({ ...empty, display_order: items.length });
  };

  const cancel = () => {
    setEditing(null);
    setForm(empty);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required.');
      return;
    }
    try {
      if (editing === 'new') {
        await createSkill(form);
        toast.success('Skill added');
      } else {
        await updateSkill(editing, form);
        toast.success('Skill updated');
      }
      cancel();
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async () => {
    try {
      await deleteSkill(pendingDelete.id);
      toast.success('Skill deleted');
      setPendingDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Skills</h1>
          <p className="text-sm text-white/40">Manage the skills shown on your public portfolio.</p>
        </div>
        <button onClick={startNew} className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-soft">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {editing === 'new' && <SkillFormCard form={form} setForm={setForm} onSave={save} onCancel={cancel} />}

      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) =>
            editing === item.id ? (
              <SkillFormCard key={item.id} form={form} setForm={setForm} onSave={save} onCancel={cancel} />
            ) : (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-line bg-bg-panel px-4 py-3">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-xs text-white/40">
                    {item.category} {!item.published && '· Unpublished'}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => startEdit(item)} className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setPendingDelete(item)} className="rounded-md p-1.5 text-red-400/70 hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          )}
          {items.length === 0 && <p className="rounded-xl border border-dashed border-line p-10 text-center text-white/40">No skills yet.</p>}
        </div>
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title="DELETE SKILL?"
        description="This action cannot be easily undone."
        confirmLabel="DELETE"
        onConfirm={remove}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function SkillFormCard({ form, setForm, onSave, onCancel }) {
  const upd = (patch) => setForm((f) => ({ ...f, ...patch }));
  return (
    <div className="mb-4 rounded-xl border border-accent/30 bg-bg-panel p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input value={form.name} onChange={(e) => upd({ name: e.target.value })} placeholder="Skill name" className="rounded-lg border border-line bg-black/30 px-3 py-2 text-sm text-white" />
        <input value={form.category} onChange={(e) => upd({ category: e.target.value })} placeholder="Category" className="rounded-lg border border-line bg-black/30 px-3 py-2 text-sm text-white" />
        <input value={form.icon} onChange={(e) => upd({ icon: e.target.value })} placeholder="Icon name (lucide)" className="rounded-lg border border-line bg-black/30 px-3 py-2 text-sm text-white" />
        <input type="number" value={form.display_order} onChange={(e) => upd({ display_order: Number(e.target.value) })} placeholder="Order" className="rounded-lg border border-line bg-black/30 px-3 py-2 text-sm text-white" />
      </div>
      <textarea value={form.description} onChange={(e) => upd({ description: e.target.value })} placeholder="Description" rows={2} className="w-full rounded-lg border border-line bg-black/30 px-3 py-2 text-sm text-white" />
      <label className="flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" checked={form.published} onChange={(e) => upd({ published: e.target.checked })} className="h-4 w-4 accent-accent" />
        Published
      </label>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white">
          <Save size={13} /> Save
        </button>
        <button onClick={onCancel} className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-white/60">
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );
}
