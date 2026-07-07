import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/nav';
import { CartProvider } from '@/lib/cart';
import { Flame } from 'lucide-react';

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
          <footer className="border-t border-zinc-800 mt-20 py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-zinc-400">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="text-orange-500 h-5 w-5" />
                  <span className="font-black text-white text-base">FLARE BY TK</span>
                </div>
                <p>Fire-grilled perfection in Bahawalpur.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-3">Visit Us</p>
                <p>Near Dubai Chowk, Mehmood CNG</p>
                <p>Bahawalpur, Punjab, Pakistan</p>
                <p className="mt-2">0345-1116520</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-3">Hours</p>
                <p>Every Day</p>
                <p>12:00 PM – 1:00 AM</p>
              </div>
            </div>
            <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-zinc-800 text-center text-zinc-600 text-xs">
              © {new Date().getFullYear()} Flare by TK. All rights reserved.
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
