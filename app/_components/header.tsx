import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-primary px-4 py-3 sm:px-6">
      <Link href="/" className="inline-flex items-center gap-2 text-background font-medium text-lg">
        <Image src="/logo-lotes-cr.svg" alt="" width={32} height={32} />
        Lotes CR
      </Link>
    </header>
  );
}