export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white/[0.02]">
      <div className="aspect-video animate-pulse bg-white/5" />
      <div className="space-y-2 p-5">
        <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
        <div className="h-3 w-full animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-10 w-24 animate-pulse rounded-xl border border-line bg-white/5" />
      ))}
    </div>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl border border-line bg-white/5" />
      ))}
    </div>
  );
}
