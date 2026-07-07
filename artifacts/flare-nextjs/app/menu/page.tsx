import type { Metadata } from 'next';
import { MenuSection } from '@/components/menu-section';

export const metadata: Metadata = { title: 'Menu — Flare by TK' };

export default function MenuPage() {
  return (
    <div className="min-h-screen pb-24">
      <div className="py-10 px-4 max-w-4xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--primary)' }}>
          Full Menu
        </p>
        <h1 className="text-4xl font-heading font-black text-white mb-0">What We Serve</h1>
      </div>
      <MenuSection />
    </div>
  );
}
