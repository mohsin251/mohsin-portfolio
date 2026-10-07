import { useState } from 'react';
import { X } from 'lucide-react';

export default function TechTagInput({ value = [], onChange }) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const clean = draft.trim();
    if (!clean) return;
    if (value.includes(clean)) {
      setDraft('');
      return;
    }
    onChange([...value, clean]);
    setDraft('');
  };

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

  const moveTag = (index, direction) => {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, i) => (
          <span
            key={tag}
            className="group flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-glow"
          >
            <button type="button" onClick={() => moveTag(i, -1)} className="opacity-40 hover:opacity-100" aria-label={`Move ${tag} earlier`}>
              ‹
            </button>
            {tag}
            <button type="button" onClick={() => moveTag(i, 1)} className="opacity-40 hover:opacity-100" aria-label={`Move ${tag} later`}>
              ›
            </button>
            <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`} className="ml-1 opacity-60 hover:opacity-100">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Type a technology and press Enter"
          className="flex-1 rounded-lg border border-line bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-accent focus:outline-none"
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded-lg border border-line px-3 py-2 text-sm text-white/70 hover:bg-white/5"
        >
          Add
        </button>
      </div>
    </div>
  );
}
