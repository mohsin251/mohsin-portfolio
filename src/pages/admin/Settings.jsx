import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../../services/settingsService';
import { useToast } from '../../context/ToastContext';

const empty = {
  name: '',
  role: '',
  bio: '',
  email: '',
  github_url: '',
  linkedin_url: '',
  youtube_url: '',
  instagram_url: '',
  location: '',
  availability_status: '',
  hero_heading: '',
  hero_description: '',
};

export default function Settings() {
  const toast = useToast();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSiteSettings();
        setForm({ ...empty, ...data });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upd = (patch) => setForm((f) => ({ ...f, ...patch }));

  const save = async () => {
    setSaving(true);
    try {
      await updateSiteSettings(form);
      toast.success('Changes saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-white/50">Loading settings…</div>;

  const field = (label, key, props = {}) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">{label}</label>
      <input
        value={form[key] || ''}
        onChange={(e) => upd({ [key]: e.target.value })}
        className="w-full rounded-lg border border-line bg-black/30 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
        {...props}
      />
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="mb-1 font-display text-2xl font-bold text-white">Site Settings</h1>
      <p className="mb-8 text-sm text-white/40">These changes update the public portfolio immediately.</p>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {field('Name', 'name')}
          {field('Role', 'role')}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Bio</label>
          <textarea value={form.bio || ''} onChange={(e) => upd({ bio: e.target.value })} rows={3} className="w-full rounded-lg border border-line bg-black/30 px-3 py-2.5 text-sm text-white focus:border-accent focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {field('Email', 'email', { type: 'email' })}
          {field('Location', 'location')}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {field('GitHub URL', 'github_url')}
          {field('LinkedIn URL', 'linkedin_url')}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {field('YouTube URL', 'youtube_url')}
          {field('Instagram URL', 'instagram_url')}
        </div>
        {field('Availability Status', 'availability_status')}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Hero Heading</label>
          <textarea value={form.hero_heading || ''} onChange={(e) => upd({ hero_heading: e.target.value })} rows={2} className="w-full rounded-lg border border-line bg-black/30 px-3 py-2.5 text-sm text-white focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Hero Description</label>
          <textarea value={form.hero_description || ''} onChange={(e) => upd({ hero_description: e.target.value })} rows={2} className="w-full rounded-lg border border-line bg-black/30 px-3 py-2.5 text-sm text-white focus:border-accent focus:outline-none" />
        </div>

        <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-soft disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
