export default function Loading() {
  return (
    <main className="px-4 py-6 sm:px-6 max-w-3xl mx-auto">
      <div className="h-4 w-32 bg-surface-alt rounded animate-pulse mb-4" />
      <div className="h-56 sm:h-72 w-full bg-surface-alt rounded-lg animate-pulse mb-6" />
      <div className="h-7 w-64 bg-surface-alt rounded animate-pulse mb-2" />
      <div className="h-4 w-48 bg-surface-alt rounded animate-pulse mb-6" />
      <div className="h-32 w-full bg-surface-alt rounded-lg animate-pulse" />
    </main>
  );
}