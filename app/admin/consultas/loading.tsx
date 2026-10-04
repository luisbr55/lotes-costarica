export default function Loading() {
  return (
    <div className="p-4 sm:p-6">
      <div className="h-8 w-32 bg-surface-alt rounded animate-pulse mb-6" />

      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-surface-alt rounded-lg p-4 space-y-2">
            <div className="h-4 w-40 bg-surface-alt rounded animate-pulse" />
            <div className="h-4 w-full bg-surface-alt rounded animate-pulse" />
            <div className="h-4 w-24 bg-surface-alt rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}