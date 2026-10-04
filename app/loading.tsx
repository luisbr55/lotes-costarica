export default function Loading() {
  return (
    <div className="p-4 sm:p-6">
      <div className="h-8 w-32 bg-surface-alt rounded animate-pulse mb-6" />
      <div className="h-10 w-full bg-surface-alt rounded animate-pulse mb-6" />

      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-surface-alt rounded-lg p-4 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-20 bg-surface-alt rounded-full animate-pulse" />
              <div className="h-4 w-48 bg-surface-alt rounded animate-pulse" />
              <div className="h-4 w-32 bg-surface-alt rounded animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-surface-alt rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}