import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/nav';
import { CartProvider } from '@/lib/cart';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Flare by TK — Bahawalpur',
  description: 'Fire-grilled perfection in Bahawalpur. Order burgers, biryani, broast & more online.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Nav />
          <main className="min-h-screen">{children}</main>

          <footer className="border-t mt-20"
                  style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card)' }}>
            <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <img src="/logo.svg" alt="Flare by TK" className="h-8 mb-4 opacity-80" />
                  <p className="text-sm max-w-xs" style={{ color: 'var(--muted-fg)' }}>
                    Premium fire-grilled meats, sizzling platters, and bold flavors near Dubai Chowk, Bahawalpur.
                  </p>
                  <p className="text-sm mt-3 font-medium" style={{ color: 'var(--muted-fg)' }}>
                    📞 0345-1116520
                  </p>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-sm" style={{ color: 'var(--muted-fg)' }}>
                    <li><Link href="/menu" className="hover:text-white transition-colors">Full Menu</Link></li>
                    <li><Link href="/deals" className="hover:text-white transition-colors">Offers & Deals</Link></li>
                    <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-white mb-4">Visit Us</h4>
                  <address className="not-italic text-sm space-y-2" style={{ color: 'var(--muted-fg)' }}>
                    <p>Near Dubai Chowk, Mehmood CNG</p>
                    <p>Bahawalpur, Punjab, Pakistan</p>
                    <p className="mt-3 font-medium text-white">0345-1116520</p>
                  </address>
                  <div className="mt-4">
                    <Link href="/admin" className="text-xs transition-colors hover:text-white" style={{ color: 'var(--muted-fg)' }}>
                      Admin Portal
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t text-center text-xs" style={{ borderColor: 'var(--card-border)', color: 'var(--muted-fg)' }}>
                © {new Date().getFullYear()} Flare by TK. All rights reserved.
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
