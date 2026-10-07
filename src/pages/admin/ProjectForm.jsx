import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, UploadCloud, ArrowLeft } from 'lucide-react';
import ImageDropzone from '../../components/admin/ImageDropzone';
import TechTagInput from '../../components/admin/TechTagInput';
import { useToast } from '../../context/ToastContext';
import {
  createProject,
  updateProject,
  getProjectById,
  isSlugTaken,
  slugify,
  isValidUrl,
  uploadProjectImage,
  deleteProjectImageByUrl,
} from '../../services/projectService';

const CATEGORIES = ['Web', 'AI', 'Tools', 'Experiments', 'Other'];

const emptyForm = {
  title: '',
  slug: '',
  short_description: '',
  description: '',
  category: 'Web',
  technologies: [],
  github_url: '',
  live_url: '',
  image_url: '',
  featured: false,
  published: false,
  display_order: 0,
  project_date: '',
  role: '',
  client_type: 'Personal',
  key_features: '',
  challenges: '',
  solution: '',
  results: '',
};

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(emptyForm);
  const [initialForm, setInitialForm] = useState(emptyForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [imageStatus, setImageStatus] = useState('idle');
  const [imageProgress, setImageProgress] = useState(0);
  const [imageError, setImageError] = useState('');
  const [fileMeta, setFileMeta] = useState(null);
  const [, setPendingFile] = useState(null);
  const [imageDirty, setImageDirty] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const data = await getProjectById(id);
        if (!data) {
          toast.error('Project not found');
          navigate('/admin/projects');
          return;
        }
        const loaded = { ...emptyForm, ...data, project_date: data.project_date || '' };
        setForm(loaded);
        setInitialForm(loaded);
        setPreviousImageUrl(data.image_url || '');
        setSlugEdited(true);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initialForm) || imageDirty, [form, initialForm, imageDirty]);

  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleTitleChange = (title) => {
    update({ title, slug: slugEdited ? form.slug : slugify(title) });
  };

  const handleFileSelected = useCallback(async (file) => {
    setFileMeta({ name: file.name, size: file.size });
    setImageStatus('uploading');
    setImageProgress(0);
    setImageError('');
    setImageDirty(true);
    try {
      const localPreview = URL.createObjectURL(file);
      update({ image_url: localPreview });
      const { url } = await uploadProjectImage(file, setImageProgress);
      update({ image_url: url });
      setPendingFile(null);
      setImageStatus('success');
      toast.success('Image uploaded successfully');
    } catch (err) {
      setImageStatus('error');
      setImageError(err.message);
      toast.error('Image upload failed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveImage = () => {
    update({ image_url: '' });
    setFileMeta(null);
    setImageStatus('idle');
    setImageDirty(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.slug.trim()) errs.slug = 'Slug is required.';
    if (!form.category) errs.category = 'Category is required.';
    if (!form.description.trim() && !form.short_description.trim()) {
      errs.description = 'Provide at least a short description.';
    }
    if (!isValidUrl(form.github_url)) errs.github_url = 'Enter a valid URL (https://...).';
    if (!isValidUrl(form.live_url)) errs.live_url = 'Enter a valid URL (https://...).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    slug: slugify(form.slug),
    short_description: form.short_description.trim(),
    description: form.description.trim(),
    category: form.category,
    technologies: form.technologies,
    github_url: form.github_url.trim(),
    live_url: form.live_url.trim(),
    image_url: form.image_url.startsWith('blob:') ? previousImageUrl : form.image_url,
    featured: form.featured,
    display_order: Number(form.display_order) || 0,
    project_date: form.project_date || null,
    role: form.role,
    client_type: form.client_type,
    key_features: form.key_features,
    challenges: form.challenges,
    solution: form.solution,
    results: form.results,
  });

  const save = async (publish) => {
    if (!validate()) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    setSaving(true);
    try {
      const slug = slugify(form.slug);
      if (await isSlugTaken(slug, isEdit ? id : null)) {
        setErrors((e) => ({ ...e, slug: 'This slug is already in use.' }));
        setSaving(false);
        toast.error('Slug already exists — choose a different one.');
        return;
      }

      const payload = { ...buildPayload(), published: publish };

      if (imageDirty && previousImageUrl && previousImageUrl !== payload.image_url) {
        await deleteProjectImageByUrl(previousImageUrl);
      }

      if (isEdit) {
        await updateProject(id, payload);
        toast.success('Project updated successfully');
      } else {
        await createProject(payload);
        toast.success(publish ? 'Project published' : 'Project saved as draft');
      }
      navigate('/admin/projects');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-white/50">Loading project…</div>;
  }

  const inputClass = (field) =>
    `w-full rounded-lg border bg-black/30 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none ${
      errors[field] ? 'border-red-500/60' : 'border-line focus:border-accent'
    }`;

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <button onClick={() => navigate('/admin/projects')} className="mb-6 flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft size={15} /> Back to Projects
      </button>

      <h1 className="mb-1 font-display text-2xl font-bold text-white">{isEdit ? 'Edit Project' : 'Add Project'}</h1>
      <p className="mb-8 text-sm text-white/40">{isEdit ? 'Update project details below.' : 'Fill in the details for your new project.'}</p>

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Project Image</h2>
          <ImageDropzone
            imageUrl={form.image_url || null}
            onFileSelected={handleFileSelected}
            onRemove={handleRemoveImage}
            status={imageStatus}
            progress={imageProgress}
            errorMessage={imageError}
            fileMeta={fileMeta}
          />
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Project Title</label>
            <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass('title')} placeholder="AI Goal Tracker" />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Project Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/30">/projects/</span>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  update({ slug: e.target.value });
                }}
                className={inputClass('slug')}
                placeholder="ai-goal-tracker"
              />
            </div>
            {errors.slug && <p className="mt-1 text-xs text-red-400">{errors.slug}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Short Description</label>
            <input
              value={form.short_description}
              onChange={(e) => update({ short_description: e.target.value })}
              className={inputClass('short_description')}
              placeholder="One-line summary shown in project cards"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Full Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={4}
              className={inputClass('description')}
              placeholder="Detailed description shown on the project page"
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Category</label>
            <select value={form.category} onChange={(e) => update({ category: e.target.value })} className={inputClass('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Client / Personal</label>
            <select value={form.client_type} onChange={(e) => update({ client_type: e.target.value })} className={inputClass('client_type')}>
              <option value="Personal">Personal</option>
              <option value="Client">Client</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Role</label>
            <input value={form.role} onChange={(e) => update({ role: e.target.value })} className={inputClass('role')} placeholder="Lead Developer" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Project Date</label>
            <input type="date" value={form.project_date || ''} onChange={(e) => update({ project_date: e.target.value })} className={inputClass('project_date')} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">GitHub URL</label>
            <input
              value={form.github_url}
              onChange={(e) => update({ github_url: e.target.value })}
              className={inputClass('github_url')}
              placeholder="https://github.com/username/repo"
            />
            {errors.github_url && <p className="mt-1 text-xs text-red-400">{errors.github_url}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Live Demo URL</label>
            <input
              value={form.live_url}
              onChange={(e) => update({ live_url: e.target.value })}
              className={inputClass('live_url')}
              placeholder="https://your-project.com"
            />
            {errors.live_url && <p className="mt-1 text-xs text-red-400">{errors.live_url}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Project Order</label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) => update({ display_order: e.target.value })}
              className={inputClass('display_order')}
            />
          </div>

          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={form.featured} onChange={(e) => update({ featured: e.target.checked })} className="h-4 w-4 accent-accent" />
              Featured Project
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Technologies</label>
            <TechTagInput value={form.technologies} onChange={(technologies) => update({ technologies })} />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Key Features</label>
            <textarea value={form.key_features} onChange={(e) => update({ key_features: e.target.value })} rows={3} className={inputClass('key_features')} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Challenges</label>
            <textarea value={form.challenges} onChange={(e) => update({ challenges: e.target.value })} rows={3} className={inputClass('challenges')} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Solution</label>
            <textarea value={form.solution} onChange={(e) => update({ solution: e.target.value })} rows={3} className={inputClass('solution')} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">Results</label>
            <textarea value={form.results} onChange={(e) => update({ results: e.target.value })} rows={3} className={inputClass('results')} />
          </div>
        </section>

        <div className="sticky bottom-0 -mx-6 flex flex-wrap gap-3 border-t border-line bg-bg/95 px-6 py-4 backdrop-blur md:-mx-10 md:px-10">
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-60"
          >
            <Save size={16} /> Save Draft
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-soft disabled:opacity-60"
          >
            <UploadCloud size={16} /> {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
