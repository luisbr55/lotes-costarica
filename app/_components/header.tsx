import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-primary px-4 py-4 sm:px-6">
      <Link href="/" className="text-background font-medium text-lg">Lotes CR</Link>
    </header>
  );
}