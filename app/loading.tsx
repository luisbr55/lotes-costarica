export default function Loading() {
  return (
    <div>
      <header className="bg-primary px-4 py-4 sm:px-6">
        <span className="text-background font-medium text-lg">Lotes CR</span>
      </header>

      <main className="px-4 py-6 sm:px-6">
        <div className="h-8 w-48 bg-surface-alt rounded animate-pulse mb-4" />
        <div className="h-12 w-full bg-surface-alt rounded animate-pulse mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-surface-alt rounded-lg overflow-hidden">
              <div className="h-28 bg-surface-alt animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-16 bg-surface-alt rounded-full animate-pulse" />
                <div className="h-4 w-32 bg-surface-alt rounded animate-pulse" />
                <div className="h-4 w-24 bg-surface-alt rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}