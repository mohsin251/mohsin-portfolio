import { useCallback, useRef, useState } from 'react';
import { UploadCloud, X, RefreshCw, ImageOff, CheckCircle2 } from 'lucide-react';
import { validateImageFile } from '../../services/projectService';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(1)} ${units[i]}`;
}

export default function ImageDropzone({
  imageUrl,
  onFileSelected,
  onRemove,
  status = 'idle',
  progress = 0,
  errorMessage,
  fileMeta,
}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState(null);

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (!file) return;
      const err = validateImageFile(file);
      if (err) {
        setLocalError(err);
        return;
      }
      setLocalError(null);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const showPreview = imageUrl && status !== 'error';

  return (
    <div>
      {!showPreview ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors cursor-pointer ${
            dragActive ? 'border-accent bg-accent/5' : 'border-line hover:border-white/20'
          }`}
        >
          <UploadCloud size={36} className="text-accent-soft" />
          <div>
            <p className="font-semibold text-white">Drop project image here</p>
            <p className="text-sm text-white/40">or click to browse</p>
          </div>
          <p className="text-xs uppercase tracking-widest text-white/30">JPG / PNG / WEBP — max 5MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-line overflow-hidden bg-black/30">
          <div className="relative aspect-video bg-black/40">
            <img src={imageUrl} alt="Project preview" className="h-full w-full object-cover" />
            {status === 'uploading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60">
                <div className="h-2 w-3/4 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs text-white/70">Uploading… {progress}%</span>
              </div>
            )}
            {status === 'success' && (
              <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-1 text-xs font-medium text-white">
                <CheckCircle2 size={14} /> Uploaded
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{fileMeta?.name || 'project-image'}</p>
              {fileMeta?.size ? <p className="text-xs text-white/40">{formatBytes(fileMeta.size)}</p> : null}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/5"
              >
                <RefreshCw size={13} /> Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
              >
                <X size={13} /> Remove
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>
      )}
      {(localError || (status === 'error' && errorMessage)) && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
          <ImageOff size={14} /> {localError || errorMessage}
        </p>
      )}
    </div>
  );
}
