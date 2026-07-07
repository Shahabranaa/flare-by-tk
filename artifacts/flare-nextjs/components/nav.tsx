'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/menu', label: 'Menu' },
  { href: '/deals', label: 'Deals' },
  { href: '/about', label: 'About Us' },
];

export function Nav() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b"
            style={{ backgroundColor: 'rgba(21,24,31,0.95)', borderColor: 'var(--card-border)' }}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Flare by TK" className="h-8" />
          </Link>
          <nav className="hidden md:flex gap-6">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors"
                style={{ color: pathname === l.href || pathname.startsWith(l.href) ? 'var(--primary)' : 'var(--muted-fg)' }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <button className="p-2 rounded-lg transition-colors relative" style={{ color: 'var(--muted-fg)' }}>
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ backgroundColor: 'var(--primary)' }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          </Link>

          <button
            className="md:hidden p-2 transition-colors"
            style={{ color: 'var(--muted-fg)' }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 py-3 space-y-1"
             style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--background)' }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{ color: pathname === l.href ? 'var(--primary)' : 'var(--muted-fg)' }}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 pt-3 border-t" style={{ borderColor: 'var(--card-border)' }}>
            <Link href="/admin" onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium"
                  style={{ color: 'var(--muted-fg)' }}>
              Staff Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
